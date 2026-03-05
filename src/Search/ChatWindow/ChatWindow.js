import React, { useEffect, useRef } from 'react';
import './ChatWindow.css';
import ChatMessage from '../ChatMessage/ChatMessage';

function ChatWindow({ messages, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-window">
      {messages.length === 0 && (
        <div className="chat-window__empty">
          <p>Ask a question to get started.</p>
          <ul>
            <li>"What projects have you worked on?"</li>
            <li>"What are your technical skills?"</li>
            <li>"Tell me about your work experience."</li>
          </ul>
        </div>
      )}
      {messages.map(msg => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      {isLoading && messages.length === 0 && (
        <div className="chat-window__loading">Thinking…</div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}

export default ChatWindow;
