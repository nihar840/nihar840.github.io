import React from 'react';
import { profile } from './data';
import './Contact.css';

function Contact({ onSearchOpen }) {
  return (
    <section className="contact" id="contact">
      <div className="section-container contact__inner">
        <div className="contact__blob" />

        <h2 className="section-title">Let's Connect</h2>
        <p className="contact__body">
          I'm always open to interesting conversations, collaborations, or just a friendly
          chat about tech. Drop me a line — or ask my AI assistant anything about my work!
        </p>

        <button className="contact__ai-btn" onClick={onSearchOpen}>
          <span>✨</span> Ask AI About Nihar
        </button>

        <div className="contact__links">
          <a href={`mailto:${profile.email}`} className="contact__link contact__link--email">
            <i className="fa fa-envelope" /> {profile.email}
          </a>
          <a href={profile.social.linkedin} className="contact__link contact__link--linkedin" target="_blank" rel="noreferrer">
            <i className="fa fa-linkedin-square" /> LinkedIn
          </a>
          <a href={profile.social.github} className="contact__link contact__link--github" target="_blank" rel="noreferrer">
            <i className="fa fa-github" /> GitHub
          </a>
        </div>
      </div>

      <footer className="footer">
        <p>Built with React &amp; ❤️ by Nihar Ranjan · {new Date().getFullYear()}</p>
      </footer>
    </section>
  );
}

export default Contact;
