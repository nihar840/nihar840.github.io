import React from 'react';
import './GlitchText.css';

export default function GlitchText({ text, tag: Tag = 'h2', className = '' }) {
  return (
    <Tag className={`glitch-text ${className}`} data-text={text}>
      {text}
    </Tag>
  );
}
