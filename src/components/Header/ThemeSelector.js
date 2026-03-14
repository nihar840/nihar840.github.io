import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { THEME_LIST } from '../../context/themes';
import './ThemeSelector.css';

export default function ThemeSelector() {
  const { themeId, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const current = THEME_LIST.find(t => t.id === themeId);

  return (
    <div className="theme-selector" ref={ref}>
      <button
        className="theme-selector__trigger"
        onClick={() => setOpen(!open)}
        aria-label="Select weather theme"
        aria-expanded={open}
      >
        <span className="theme-selector__icon">{current?.icon}</span>
        <span className="theme-selector__label">{current?.label}</span>
        <span className={`theme-selector__arrow ${open ? 'open' : ''}`}>&#9662;</span>
      </button>
      {open && (
        <div className="theme-selector__dropdown">
          {THEME_LIST.map(t => (
            <button
              key={t.id}
              className={`theme-selector__option ${t.id === themeId ? 'active' : ''}`}
              onClick={() => { setTheme(t.id); setOpen(false); }}
            >
              <span className="theme-selector__opt-icon">{t.icon}</span>
              <span className="theme-selector__opt-label">{t.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
