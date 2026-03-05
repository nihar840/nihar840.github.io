import React, { useState, useEffect } from 'react';
import './Header.css';

const NAV_LINKS = [
  { label: 'Skills',      href: '#skills' },
  { label: 'Experience',  href: '#experience' },
  { label: 'Projects',    href: '#projects' },
  { label: 'Contact',     href: '#contact' },
];

function Header({ onSearchOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__inner">
        {/* Logo */}
        <a href="#home" className="header__logo">
          NR<span className="header__logo-dot">.</span>
        </a>

        {/* Desktop nav */}
        <nav className="header__nav">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} className="header__nav-link">{l.label}</a>
          ))}
        </nav>

        {/* Actions */}
        <div className="header__actions">
          <button className="header__search-btn" onClick={onSearchOpen} aria-label="AI Search">
            <span>✨</span> Ask AI
          </button>
          {/* Hamburger */}
          <button
            className={`header__hamburger ${menuOpen ? 'header__hamburger--open' : ''}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="header__mobile-nav">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="header__mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

export default Header;
