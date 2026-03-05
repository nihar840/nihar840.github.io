import React, { useEffect, useState } from 'react';
import { profile } from './data';
import './Hero.css';

const TITLES = [
  'Software Engineer & Tech Lead',
  'React & TypeScript Developer',
  'AI / RAG Systems Builder',
  '.NET & Azure Engineer',
];

function Hero({ onSearchOpen }) {
  const [titleIdx, setTitleIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = TITLES[titleIdx];
    let timer;

    if (!deleting && displayed.length < target.length) {
      timer = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === target.length) {
      timer = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timer = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setTitleIdx((i) => (i + 1) % TITLES.length);
    }

    return () => clearTimeout(timer);
  }, [displayed, deleting, titleIdx]);

  return (
    <section className="hero" id="home">
      {/* Animated blobs */}
      <div className="hero__blob hero__blob--1" />
      <div className="hero__blob hero__blob--2" />
      <div className="hero__blob hero__blob--3" />

      <div className="hero__content">
        <div className="hero__photo-wrap">
          <div className="hero__photo-ring" />
          <img
            className="hero__photo"
            src="Images/Profile pic.jpg"
            alt={profile.name}
          />
        </div>

        <div className="hero__text">
          <p className="hero__greeting">Hey there, I'm</p>
          <h1 className="hero__name">{profile.name}</h1>
          <div className="hero__typewriter">
            <span className="hero__typewriter-text">{displayed}</span>
            <span className="hero__cursor">|</span>
          </div>
          <p className="hero__tagline">{profile.tagline}</p>

          <div className="hero__actions">
            <a
              href="/resume.pdf"
              download="Nihar_Ranjan_Resume.pdf"
              className="hero__btn hero__btn--primary"
            >
              ↓ Download Profile
            </a>
            <button
              className="hero__btn hero__btn--ai"
              onClick={onSearchOpen}
            >
              <span className="hero__btn-icon">✨</span> Ask AI About Me
            </button>
          </div>

          <div className="hero__socials">
            <a href={profile.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hero__social hero__social--linkedin">
              <i className="fa fa-linkedin" />
            </a>
            <a href={profile.social.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hero__social hero__social--github">
              <i className="fa fa-github" />
            </a>
            <a href={profile.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="hero__social hero__social--instagram">
              <i className="fa fa-instagram" />
            </a>
          </div>
        </div>
      </div>

      <a href="#skills" className="hero__scroll-hint" aria-label="Scroll down">
        <span className="hero__scroll-arrow" />
      </a>
    </section>
  );
}

export default Hero;
