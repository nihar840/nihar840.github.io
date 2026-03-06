import { useState, useRef, useEffect, useCallback } from 'react';
import './AIChat.css';

const API_BASE = 'https://api.niharranjan.com';

type ServerState = 'idle' | 'checking' | 'online' | 'offline';

interface Source {
  documentId: string;
  chunkIndex: number;
  score: number;
  text: string;
  metadata?: Record<string, string>;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
}

// Full-sentence hints embed far better than short phrases — better vector similarity matches
const HINTS = [
  'What is Nihar\'s React and frontend experience?',
  'Tell me about Nihar\'s work at Microsoft',
  'What AI and RAG projects has Nihar built?',
  'What are Nihar\'s Azure and cloud skills?',
];

export default function AIChat() {
  const [open,     setOpen]    = useState(false);
  const [pulling,  setPulling] = useState(false);
  const [server,   setServer]  = useState<ServerState>('idle');
  const [messages, setMsgs]   = useState<Message[]>([]);
  const [input,    setInput]   = useState('');
  const [loading,  setLoad]    = useState(false);
  const [stream,   setStream]  = useState('');

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  /* ── Server health check ── */
  const checkServer = useCallback(() => {
    setServer('checking');
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);

    fetch(`${API_BASE}/api/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '__ping__', topK: 1 }),
      signal: ctrl.signal,
    })
      // Any HTTP response (200, 400, 500) means the server process is reachable → online.
      // Only a network-level failure (DNS, connection refused, timeout) → offline.
      .then(() => setServer('online'))
      .catch(() => setServer('offline'))
      .finally(() => clearTimeout(timer));

    return () => { ctrl.abort(); clearTimeout(timer); };
  }, []);

  /* Run health check when panel first opens */
  useEffect(() => {
    if (open && server === 'idle') return checkServer();
  }, [open, server, checkServer]);

  /* Scroll chat to bottom on new content — never on mount */
  useEffect(() => {
    if (messages.length > 0 || stream) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, stream]);

  /* Focus input once panel is open and server is online */
  useEffect(() => {
    if (open && server === 'online') {
      const t = setTimeout(() => inputRef.current?.focus(), 420);
      return () => clearTimeout(t);
    }
  }, [open, server]);

  /* Escape to close */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    if (open) window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [open]);

  /* Pull the rope → short tug animation → drop panel */
  function pullRope() {
    if (open) { setOpen(false); return; }
    setPulling(true);
    setTimeout(() => { setPulling(false); setOpen(true); }, 280);
  }

  /* Send a message */
  async function send() {
    const q = input.trim();
    if (!q || loading || server !== 'online') return;
    setInput('');
    setMsgs(p => [...p, { role: 'user', content: q }]);
    setLoad(true);
    setStream('');

    try {
      const url = `${API_BASE}/api/search/stream?${new URLSearchParams({ query: q })}`;
      const es = new EventSource(url);
      let ans = '', srcs: Source[] = [], streamDone = false;

      /* Helper — parse SSE payload.
         The server sends each event's data as a JSON object:
           { eventType, token, sources, finishReason, ... }
         So ev.data is always a JSON string, not a raw token. */
      function handlePayload(raw: string) {
        try {
          const obj = JSON.parse(raw);
          const type = obj.eventType as string | undefined;
          if (type === 'token' || (!type && obj.token != null)) {
            ans += obj.token ?? '';
            setStream(ans);
          } else if (type === 'sources' && Array.isArray(obj.sources)) {
            srcs = obj.sources;
          } else if (type === 'done' || obj.finishReason != null) {
            if (!streamDone) {
              streamDone = true;
              es.close();
              setMsgs(p => [...p, { role: 'assistant', content: ans, sources: srcs }]);
              setStream(''); setLoad(false);
            }
          }
        } catch {
          // Raw string token (non-JSON server) — treat as plain text
          ans += raw;
          setStream(ans);
        }
      }

      // Named SSE events (event: token / sources / done)
      es.addEventListener('sources', ev => {
        try {
          const obj = JSON.parse((ev as MessageEvent).data);
          srcs = Array.isArray(obj) ? obj : (obj.sources ?? []);
        } catch {}
      });
      es.addEventListener('token', ev => {
        try {
          const obj = JSON.parse((ev as MessageEvent).data);
          ans += obj.token ?? (ev as MessageEvent).data;
        } catch {
          ans += (ev as MessageEvent).data;
        }
        setStream(ans);
      });
      es.addEventListener('done', () => {
        streamDone = true;
        es.close();
        setMsgs(p => [...p, { role: 'assistant', content: ans, sources: srcs }]);
        setStream(''); setLoad(false);
      });

      // Fallback: server sends everything as the default 'message' event
      es.addEventListener('message', ev => handlePayload((ev as MessageEvent).data));
      es.addEventListener('error', () => {
        // EventSource fires 'error' when the server closes the SSE connection
        // (it attempts to reconnect). If 'done' already fired, this is a
        // harmless race-condition — ignore it completely.
        if (streamDone) return;

        es.close();
        if (ans) {
          // Partial answer received — commit what we have
          setMsgs(p => [...p, { role: 'assistant', content: ans, sources: srcs }]);
        } else {
          // No tokens at all — restore question so user can resend after retry
          setInput(q);
        }
        setStream(''); setLoad(false);
        setServer('offline');
      });
    } catch {
      // EventSource failed to open — restore question, let offline UI explain
      setInput(q);
      setLoad(false);
      setServer('offline');
    }
  }

  /* Derived status label */
  const statusLabel = server === 'online'   ? 'Live — Ollama · ChromaDB RAG'
                    : server === 'checking' ? 'Connecting…'
                    : server === 'offline'  ? 'Server offline'
                    :                         'Local LLM · RAG';
  const isOnline  = server === 'online';
  const isChecking = server === 'checking';

  return (
    <>
      {/* ══ ROPE ══ */}
      <div
        className={`aic-rope${pulling ? ' aic-rope--pulling' : ''}${open ? ' aic-rope--hidden' : ''}`}
        onClick={pullRope}
        role="button"
        tabIndex={0}
        aria-label="Pull to open AI chat"
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && pullRope()}
      >
        <svg className="aic-rope__cord" width="12" height="90" viewBox="0 0 12 90" aria-hidden="true">
          <path d="M6 0 C3 8, 9 16, 6 24 C3 32, 9 40, 6 48 C3 56, 9 64, 6 72 C3 80, 6 90, 6 90"
                fill="none" stroke="#7a5c10" strokeWidth="3" strokeLinecap="round"/>
          <path d="M6 0 C9 8, 3 16, 6 24 C9 32, 3 40, 6 48 C9 56, 3 64, 6 72 C9 80, 6 90, 6 90"
                fill="none" stroke="#a07820" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
          <circle cx="6" cy="24" r="1.5" fill="#5c3d0e"/>
          <circle cx="6" cy="48" r="1.5" fill="#5c3d0e"/>
          <circle cx="6" cy="72" r="1.5" fill="#5c3d0e"/>
        </svg>

        <div className="aic-rope__knob">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span>AI</span>
        </div>

        <div className="aic-rope__tip" aria-hidden="true">Pull for AI Chat</div>
      </div>

      {/* ══ BACKDROP ══ */}
      <div
        className={`aic-backdrop${open ? ' aic-backdrop--on' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* ══ PANEL ══ */}
      <div
        className={`aic-panel${open ? ' aic-panel--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="AI Chat"
      >
        {/* Rope hooks at top */}
        <div className="aic-panel__hooks" aria-hidden="true">
          <span/><span/><span/>
        </div>

        {/* Header */}
        <div className="aic-header">
          <div>
            <div className="aic-header__chap">Chapter ??? · The Oracle</div>
            <div className="aic-header__title">ASK AI ABOUT NIHAR</div>
          </div>
          <button className="aic-close" onClick={() => setOpen(false)} aria-label="Close chat">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Status strip */}
        <div className={`aic-status${server === 'offline' ? ' aic-status--offline' : ''}`}>
          <span className={`aic-status__dot${isChecking ? ' aic-status__dot--checking' : ''}${server === 'offline' ? ' aic-status__dot--offline' : ''}`}/>
          <span>{statusLabel}</span>
          {server === 'offline' && (
            <button className="aic-retry" onClick={checkServer} title="Retry connection">↺ Retry</button>
          )}
        </div>

        {/* Messages area */}
        <div className="aic-msgs">

          {/* ── OFFLINE STATE ── */}
          {server === 'offline' && messages.length === 0 && (
            <div className="aic-offline-state">
              <div className="aic-offline-state__icon">📡</div>
              <div className="aic-offline-state__title">RAG Server Offline</div>
              <p className="aic-offline-state__body">
                This AI chat is powered by a <strong>local RAG stack</strong> — Ollama LLM + ChromaDB vector DB + .NET orchestration API. It answers questions about Nihar by searching embedded portfolio documents.
              </p>
              <div className="aic-offline-state__steps">
                <div className="aic-offline-step">
                  <span className="aic-offline-step__num">1</span>
                  <span>Start Ollama + ChromaDB locally</span>
                </div>
                <div className="aic-offline-step">
                  <span className="aic-offline-step__num">2</span>
                  <span>Run the .NET API on <code>localhost:5000</code></span>
                </div>
                <div className="aic-offline-step">
                  <span className="aic-offline-step__num">3</span>
                  <span>Ask anything — answers stream in real-time ✦</span>
                </div>
              </div>
              <div className="aic-offline-state__sample">
                <div className="aic-offline-sample__label">Sample answer when live:</div>
                <div className="aic-offline-sample__bubble">
                  "Nihar has 7+ years of React experience, including enterprise work within Microsoft 365 Admin UX — building wizards, filters, panels, and reusable component libraries…" <span style={{color:'#e63946'}}>▋</span>
                </div>
              </div>
            </div>
          )}

          {/* ── CHECKING STATE ── */}
          {isChecking && messages.length === 0 && (
            <div className="aic-empty">
              <div className="aic-checking-dots"><span/><span/><span/></div>
              <p style={{color:'#64748b', fontSize:'12px', marginTop:'8px'}}>Connecting to RAG server…</p>
            </div>
          )}

          {/* ── ONLINE EMPTY STATE ── */}
          {isOnline && messages.length === 0 && !loading && (
            <div className="aic-empty">
              <div className="aic-empty__icon">✦</div>
              <p>Ask anything about Nihar's experience, projects, or stack!</p>
              <div className="aic-hints">
                {HINTS.map(h => (
                  <button key={h} className="aic-hint" onClick={() => { setInput(h); inputRef.current?.focus(); }}>
                    {h}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((m, i) => (
            <div key={i} className={`aic-msg aic-msg--${m.role}`}>
              {m.role === 'assistant' && <span className="aic-avatar">✦</span>}
              <div className="aic-bubble">{m.content}</div>
              {m.role === 'assistant' && m.sources && m.sources.length > 0 && (
                <div className="aic-sources">
                  {m.sources.slice(0, 3).map((s, si) => {
                    const p = Math.max(0, Math.min(100, Math.round(s.score * 100)));
                    return (
                      <span key={si} className={`aic-src ${p >= 70 ? 'hi' : p >= 40 ? 'mid' : 'lo'}`}>
                        [{si + 1}] {s.metadata?.title || s.documentId} · {p}%
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {loading && stream && (
            <div className="aic-msg aic-msg--assistant">
              <span className="aic-avatar">✦</span>
              <div className="aic-bubble">{stream}<span className="aic-cursor">▋</span></div>
            </div>
          )}
          {loading && !stream && (
            <div className="aic-msg aic-msg--assistant">
              <span className="aic-avatar">✦</span>
              <div className="aic-dots"><span/><span/><span/></div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        {/* Input row */}
        <div className={`aic-input-row${!isOnline ? ' aic-input-row--disabled' : ''}`}>
          <input
            ref={inputRef}
            className="aic-input"
            type="text"
            placeholder={isChecking ? 'Connecting…' : !isOnline ? 'Server offline — see instructions above' : 'Ask anything about Nihar…'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            disabled={loading || !isOnline}
            maxLength={300}
          />
          <button className="aic-send" onClick={send} disabled={loading || !input.trim() || !isOnline} aria-label="Send">
            {loading
              ? <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 9 9" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/></path></svg>
              : <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M2 21L23 12 2 3v7l15 2-15 2v7z"/></svg>
            }
          </button>
        </div>
      </div>
    </>
  );
}
