import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <span className="site-footer__brand hud-label">NR.</span>
        <span className="site-footer__text">
          Designed & built by Nihar Ranjan
        </span>
        <span className="site-footer__year hud-label">{new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
