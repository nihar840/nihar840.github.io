import { useState, useRef, useEffect } from 'react';
import './AskAI.css';

const API_BASE = 'https://api.niharranjan.com';

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

function scoreClass(pct: number) {
  if (pct >= 70) return 'ai-score--high';
  if (pct >= 40) return 'ai-score--mid';
  return 'ai-score--low';
}

export default function AskAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamText, setStreamText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamText]);

  async function send() {
    const q = input.trim();
    if (!q || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: q }]);
    setLoading(true);
    setStreamText('');

    try {
      const url = `${API_BASE}/api/search/stream?${new URLSearchParams({ question: q })}`;
      const es = new EventSource(url);
      let answer = '';
      let sources: Source[] = [];

      es.addEventListener('sources', (e) => {
        try { sources = JSON.parse(e.data); } catch {}
      });

      es.addEventListener('token', (e) => {
        answer += e.data;
        setStreamText(answer);
      });

      es.addEventListener('done', () => {
        es.close();
        setMessages(prev => [...prev, { role: 'assistant', content: answer, sources }]);
        setStreamText('');
        setLoading(false);
      });

      es.addEventListener('error', () => {
        es.close();
        if (!answer) {
          setMessages(prev => [...prev, { role: 'assistant', content: '⚠ Connection failed. Make sure the API is running.' }]);
        }
        setStreamText('');
        setLoading(false);
      });
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠ Failed to connect.' }]);
      setLoading(false);
    }
  }

  return (
    <div className="ask-ai-section">
      <div className="chapter-label" style={{ marginBottom: '16px' }}>
        Chapter 06 · The Oracle
      </div>
      <h2 style={{ fontFamily: 'var(--font-manga)', fontSize: '32px', marginBottom: '8px' }}>
        Ask AI About Nihar
      </h2>
      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
        Powered by local Ollama + ChromaDB RAG — ask anything about the portfolio!
      </p>

      <div className="ai-messages">
        {messages.length === 0 && (
          <div className="ai-placeholder">
            <span>🤖</span>
            <p>Ask me anything — "What's Nihar's experience with React?" or "Tell me about the AI project."</p>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`ai-msg ai-msg--${m.role}`}>
            <div className="ai-msg__bubble">{m.content}</div>
            {m.role === 'assistant' && m.sources && m.sources.length > 0 && (
              <div className="ai-sources">
                {m.sources.map((s, si) => {
                  const score = Math.max(0, Math.min(100, Math.round(s.score * 100)));
                  return (
                    <div key={`${s.documentId}-${si}`} className="ai-source-chip">
                      <span className="ai-source-num">[{si + 1}]</span>
                      <span className="ai-source-id">{s.metadata?.title || s.documentId}</span>
                      <span className={`ai-score ${scoreClass(score)}`}>{score}%</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {loading && streamText && (
          <div className="ai-msg ai-msg--assistant">
            <div className="ai-msg__bubble">{streamText}<span className="ai-cursor">▋</span></div>
          </div>
        )}

        {loading && !streamText && (
          <div className="ai-msg ai-msg--assistant">
            <div className="ai-thinking">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="ai-input-row">
        <input
          className="ai-input"
          type="text"
          placeholder="Ask anything about Nihar..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          disabled={loading}
        />
        <button
          className="btn-manga btn-manga--primary ai-send-btn"
          onClick={send}
          disabled={loading || !input.trim()}
        >
          {loading ? '...' : '⚡ Ask'}
        </button>
      </div>
    </div>
  );
}
