import React from 'react';
import './ChatMessage.css';

function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`chat-message chat-message--${isUser ? 'user' : 'assistant'}`}>
      {!isUser && <div className="chat-message__avatar">✦</div>}
      <div className="chat-message__bubble">
        {message.content}
      </div>
    </div>
  );
}

export default ChatMessage;
