import React, { useEffect, useState, useCallback } from 'react';
import './SearchPage.css';
import SearchBar from './SearchBar/SearchBar';
import ChatWindow from './ChatWindow/ChatWindow';
import SourceCards from './SourceCards/SourceCards';
import { useStreamingChat } from './hooks/useStreamingChat';
import { checkHealth } from '../services/apiClient';

function SearchPage({ onClose }) {
  const { messages, sources, isLoading, error, sendQuery, clearMessages } = useStreamingChat();
  const [apiStatus, setApiStatus] = useState('checking'); // 'checking' | 'online' | 'offline'

  // Health check on open
  useEffect(() => {
    checkHealth().then(ok => setApiStatus(ok ? 'online' : 'offline'));
  }, []);

  // Retry health check
  const retry = useCallback(() => {
    setApiStatus('checking');
    checkHealth().then(ok => setApiStatus(ok ? 'online' : 'offline'));
  }, []);

  // Close on Escape key
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="search-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="search-panel">

        {/* Header */}
        <div className="search-panel__header">
          <h2 className="search-panel__title">
            <span className="search-panel__ai-icon">✦</span>
            Ask Nihar's AI
          </h2>
          <div className="search-panel__actions">
            {/* Status pill */}
            <span className={`search-panel__status search-panel__status--${apiStatus}`}>
              <span className="search-panel__status-dot" />
              {apiStatus === 'checking' ? 'Connecting…' : apiStatus === 'online' ? 'Online' : 'Offline'}
            </span>
            {messages.length > 0 && (
              <button className="search-panel__clear" onClick={clearMessages}>Clear</button>
            )}
            <button className="search-panel__close" onClick={onClose} aria-label="Close">✕</button>
          </div>
        </div>

        {/* Offline state */}
        {apiStatus === 'offline' ? (
          <div className="search-panel__offline">
            <div className="search-panel__offline-icon">🌙</div>
            <h3 className="search-panel__offline-title">AI is currently offline</h3>
            <p className="search-panel__offline-body">
              This AI assistant runs on Nihar's local machine using a private Ollama model.
              It's not always on — but you can still reach out directly!
            </p>
            <button className="search-panel__offline-retry" onClick={retry}>
              ↺ &nbsp;Try again
            </button>
            <div className="search-panel__offline-links">
              <a href="mailto:niharranjan.mahajan420@gmail.com" className="search-panel__offline-link">
                ✉ Email
              </a>
              <a href="https://linkedin.com/in/niharranjan-mahajan" target="_blank" rel="noreferrer"
                 className="search-panel__offline-link search-panel__offline-link--linkedin">
                in LinkedIn
              </a>
              <a href="https://github.com/nihar840" target="_blank" rel="noreferrer"
                 className="search-panel__offline-link search-panel__offline-link--github">
                ⌥ GitHub
              </a>
            </div>
          </div>
        ) : (
          <>
            <ChatWindow messages={messages} isLoading={isLoading || apiStatus === 'checking'} />
            {sources.length > 0 && <SourceCards sources={sources} />}
            {error && <div className="search-panel__error">⚠ {error}</div>}
            <SearchBar onSearch={sendQuery} isLoading={isLoading || apiStatus === 'checking'} />
          </>
        )}

      </div>
    </div>
  );
}

export default SearchPage;
