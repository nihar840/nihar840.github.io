import React from 'react';
import { profile } from '../../data/profile';
import Portal from './Portal';
import GlitchText from '../HUD/GlitchText';
import RuneFlow from '../RuneFlow/RuneFlow';
import Mandala from '../Mandala/Mandala';
import PhysicsPatterns from '../PhysicsPatterns/PhysicsPatterns';
import useIntersectionReveal from '../../engine/useIntersectionReveal';
import './Contact.css';

export default function Contact() {
  const [ref, revealed] = useIntersectionReveal(0.15);

  return (
    <section className="hud-section contact-section" id="contact" ref={ref}>
      <PhysicsPatterns pattern="spiral" className="physics-patterns--contact" />
      <RuneFlow columns={5} position="background" />
      <Mandala size={200} position="center" />
      <div className={`hud-section__inner contact-inner ${revealed ? 'revealed' : ''}`}>
        <Portal />
        <span className="hud-label">{'// connect'}</span>
        <GlitchText text="Get In Touch" className="hud-title contact-title" />
        <p className="contact-text">
          Open to collaboration, new challenges, and conversations about engineering at scale.
        </p>
        <div className="contact-links">
          <a href={`mailto:${profile.email}`} className="contact-link">
            <span className="contact-link__bracket">&lt;</span>
            {profile.email}
            <span className="contact-link__bracket">/&gt;</span>
          </a>
          <a href={profile.social.linkedin} className="contact-link" target="_blank" rel="noopener noreferrer">
            <span className="contact-link__bracket">&lt;</span>
            LinkedIn
            <span className="contact-link__bracket">/&gt;</span>
          </a>
          <a href={profile.social.github} className="contact-link" target="_blank" rel="noopener noreferrer">
            <span className="contact-link__bracket">&lt;</span>
            GitHub
            <span className="contact-link__bracket">/&gt;</span>
          </a>
        </div>
      </div>
    </section>
  );
}
