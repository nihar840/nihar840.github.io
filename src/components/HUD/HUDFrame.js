import React from 'react';
import './HUDFrame.css';

export default function HUDFrame({ children, label, className = '' }) {
  return (
    <div className={`hud-frame hud-corners ${className}`}>
      {label && <span className="hud-frame__label hud-label">{label}</span>}
      <div className="hud-frame__content">
        {children}
      </div>
    </div>
  );
}
