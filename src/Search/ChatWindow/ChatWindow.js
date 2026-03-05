import React, { useEffect, useRef } from 'react';
import './ChatWindow.css';
import ChatMessage from '../ChatMessage/ChatMessage';

const SUGGESTIONS = [
  '✦  What are Nihar\'s core technical skills?',
  '💼  Tell me about his work at Microsoft.',
  '🤖  What AI projects has he built?',
  '🏆  What certifications and awards does he have?',
];

function ChatWindow({ messages, isLoading, onSuggest }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="chat-window">
      {messages.length === 0 && !isLoading && (
        <div className="chat-window__empty">
          <div className="chat-window__empty-icon">✦</div>
          <p className="chat-window__empty-title">Ask me anything about Nihar</p>
          <p className="chat-window__empty-sub">Powered by local AI · answers grounded in his resume</p>
          <div className="chat-window__suggestions">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                className="chat-window__chip"
                onClick={() => onSuggest && onSuggest(s.replace(/^[\W]+/, '').trim())}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.map(msg => (
        <ChatMessage key={msg.id} message={msg} />
      ))}

      {isLoading && (
        <div className="chat-window__loading">
          <div className="chat-window__dots">
            <div className="chat-window__dot" />
            <div className="chat-window__dot" />
            <div className="chat-window__dot" />
          </div>
          <span>Thinking…</span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export default ChatWindow;
