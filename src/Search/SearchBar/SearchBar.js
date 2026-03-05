import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed && !isLoading) {
      onSearch(trimmed);
      setQuery('');
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e);
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <textarea
        className="search-bar__input"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything about Nihar's experience, projects, or skills..."
        rows={2}
        disabled={isLoading}
      />
      <button
        type="submit"
        className="search-bar__btn"
        disabled={!query.trim() || isLoading}
        aria-label="Send"
      >
        {isLoading ? '⏳' : '➤'}
      </button>
    </form>
  );
}

export default SearchBar;
