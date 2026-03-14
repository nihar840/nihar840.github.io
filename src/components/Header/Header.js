import React, { useState, useEffect } from 'react';
import ThemeSelector from './ThemeSelector';
import './Header.css';

const NAV_LINKS = [
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Journey' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`hud-header ${scrolled ? 'hud-header--scrolled' : ''}`}>
      <div className="hud-header__inner">
        {/* Logo */}
        <a href="#top" className="hud-header__logo" aria-label="Home">
          <span className="hud-header__logo-text">NR</span>
          <span className="hud-header__logo-dot">.</span>
        </a>

        {/* Nav */}
        <nav className={`hud-header__nav ${menuOpen ? 'open' : ''}`}>
          {NAV_LINKS.map(link => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="hud-header__link"
              onClick={() => setMenuOpen(false)}
            >
              <span className="hud-header__link-bracket">[</span>
              {link.label}
              <span className="hud-header__link-bracket">]</span>
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="hud-header__actions">
          <ThemeSelector />
          <button
            className={`hud-header__burger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
      {/* Scan line accent */}
      <div className="hud-header__scanline" />
    </header>
  );
}
