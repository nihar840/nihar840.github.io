import React, { useState } from 'react';
import './SkillBag.css';

export default function SkillBag({ category, icon, items }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`skill-bag hud-corners ${open ? 'skill-bag--open' : ''}`}
      onClick={() => setOpen(!open)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && setOpen(!open)}
      aria-expanded={open}
    >
      <div className="skill-bag__header">
        <div className="skill-bag__gear-indicator">
          <svg viewBox="0 0 24 24" className="skill-bag__gear-icon" aria-hidden="true">
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
              fill="none" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </div>
        <span className="skill-bag__icon">{icon}</span>
        <h3 className="skill-bag__title">{category}</h3>
        <span className="skill-bag__count hud-label">{items.length}</span>
        <span className={`skill-bag__chevron ${open ? 'open' : ''}`}>&#9662;</span>
      </div>
      <div className="skill-bag__items">
        {items.map(item => (
          <span key={item} className="skill-bag__tag">{item}</span>
        ))}
      </div>
    </div>
  );
}
