import React, { useEffect } from 'react';
import './SearchPage.css';
import SearchBar from './SearchBar/SearchBar';
import ChatWindow from './ChatWindow/ChatWindow';
import SourceCards from './SourceCards/SourceCards';
import { useStreamingChat } from './hooks/useStreamingChat';

function SearchPage({ onClose }) {
  const { messages, sources, isLoading, error, sendQuery, clearMessages } = useStreamingChat();

  // Close on Escape key
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="search-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="search-panel">
        <div className="search-panel__header">
          <h2 className="search-panel__title">Ask Nihar's Portfolio</h2>
          <div className="search-panel__actions">
            {messages.length > 0 && (
              <button className="search-panel__clear" onClick={clearMessages}>Clear</button>
            )}
            <button className="search-panel__close" onClick={onClose} aria-label="Close">✕</button>
          </div>
        </div>

        <ChatWindow messages={messages} isLoading={isLoading} />

        {sources.length > 0 && <SourceCards sources={sources} />}

        {error && (
          <div className="search-panel__error">
            ⚠ {error}
          </div>
        )}

        <SearchBar onSearch={sendQuery} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default SearchPage;
