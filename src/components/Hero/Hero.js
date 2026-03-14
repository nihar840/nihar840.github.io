import React, { useState, useEffect } from 'react';
import CampfireScene from './CampfireScene';
import SkillBlocks from './SkillBlocks';
import RuneFlow from '../RuneFlow/RuneFlow';
import Mandala from '../Mandala/Mandala';
import PhysicsPatterns from '../PhysicsPatterns/PhysicsPatterns';
import { profile } from '../../data/profile';
import './Hero.css';

export default function Hero() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const titles = profile.titles;
    const current = titles[titleIndex];
    let timeout;

    if (typing) {
      if (text.length < current.length) {
        timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), 80);
      } else {
        timeout = setTimeout(() => setTyping(false), 2000);
      }
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(text.slice(0, -1)), 40);
      } else {
        setTitleIndex((titleIndex + 1) % titles.length);
        setTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, typing, titleIndex]);

  return (
    <section className="hero" id="top">
      <PhysicsPatterns pattern="all" className="physics-patterns--hero" />
      <RuneFlow columns={6} position="background" />
      <Mandala size={220} position="top-right" />
      <div className="hero__content">
        {/* Campfire Scene */}
        <div className="hero__scene">
          <SkillBlocks />
          <CampfireScene />
        </div>

        {/* Text Overlay */}
        <div className="hero__text">
          <span className="hero__label hud-label">{'// identity'}</span>
          <h1 className="hero__name">{profile.name}</h1>
          <div className="hero__title-line">
            <span className="hero__title">{text}</span>
            <span className="hero__cursor">|</span>
          </div>
          <p className="hero__tagline">{profile.tagline}</p>
          <p className="hero__quote">&ldquo;{profile.quote}&rdquo;</p>

          <div className="hero__actions">
            <a
              href="/resume.pdf"
              className="hero__btn hero__btn--primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="hero__btn-bracket">&lt;</span>
              Download Profile
              <span className="hero__btn-bracket">/&gt;</span>
            </a>
          </div>

          <div className="hero__socials">
            {Object.entries(profile.social).map(([key, url]) => (
              <a
                key={key}
                href={url}
                className="hero__social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={key}
              >
                <i className={`fa fa-${key === 'linkedin' ? 'linkedin-square' : key}`} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="hero__scroll-hint">
        <div className="hero__scroll-line" />
        <span className="hero__scroll-text hud-label">scroll</span>
      </div>
    </section>
  );
}
