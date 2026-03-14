import React, { useState } from 'react';
import { experience, education, awards } from '../../data/experience';
import GlitchText from '../HUD/GlitchText';
import HUDFrame from '../HUD/HUDFrame';
import GearSystem from '../GearSystem/GearSystem';
import RuneFlow from '../RuneFlow/RuneFlow';
import Mandala from '../Mandala/Mandala';
import PhysicsPatterns from '../PhysicsPatterns/PhysicsPatterns';
import JourneyPath from './JourneyPath';
import useIntersectionReveal from '../../engine/useIntersectionReveal';
import './Experience.css';

function ExperienceCard({ item, index, revealed }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`exp-card ${revealed ? 'exp-card--revealed' : ''}`}
      style={{ animationDelay: `${0.3 + index * 0.15}s` }}
    >
      <HUDFrame label={`0${index + 1}`}>
        <div className="exp-card__header" onClick={() => setExpanded(!expanded)}>
          <div className="exp-card__info">
            <h3 className="exp-card__role">{item.role}</h3>
            <p className="exp-card__company">{item.company}</p>
            <div className="exp-card__meta">
              <span className="exp-card__period hud-label">{item.period}</span>
              <span className="exp-card__location">{item.location}</span>
            </div>
          </div>
          <button
            className={`exp-card__toggle ${expanded ? 'open' : ''}`}
            aria-label="Toggle details"
            aria-expanded={expanded}
          >
            &#9662;
          </button>
        </div>
        {expanded && (
          <ul className="exp-card__highlights">
            {item.highlights.map((h, i) => (
              <li key={i} className="exp-card__highlight">{h}</li>
            ))}
          </ul>
        )}
      </HUDFrame>
    </div>
  );
}

export default function Experience() {
  const [ref, revealed] = useIntersectionReveal(0.05);

  return (
    <section className="hud-section experience-section" id="experience" ref={ref}>
      <PhysicsPatterns pattern="waves" className="physics-patterns--experience" />
      <GearSystem size={50} position="left" />
      <RuneFlow columns={4} position="right" />
      <Mandala size={160} position="bottom-right" />
      <div className="hud-section__inner">
        <span className="hud-label">{'// journey'}</span>
        <GlitchText text="Experience" className="hud-title" />

        <div className="experience-timeline">
          <JourneyPath revealed={revealed} count={experience.length} />
          <div className="experience-cards">
            {experience.map((item, i) => (
              <ExperienceCard key={i} item={item} index={i} revealed={revealed} />
            ))}
          </div>
        </div>

        {/* Education */}
        <div className={`experience-edu ${revealed ? 'revealed' : ''}`}>
          <span className="hud-label">{'// education'}</span>
          {education.map((edu, i) => (
            <HUDFrame key={i} label="edu">
              <h4 className="edu-degree">{edu.degree}</h4>
              <p className="edu-institution">{edu.institution}</p>
              <div className="edu-meta">
                <span className="hud-label">{edu.period}</span>
                <span className="edu-gpa">GPA: {edu.gpa}</span>
              </div>
            </HUDFrame>
          ))}
        </div>

        {/* Awards */}
        <div className={`experience-awards ${revealed ? 'revealed' : ''}`}>
          <span className="hud-label">{'// achievements'}</span>
          <div className="awards-grid">
            {awards.map((award, i) => (
              <div key={i} className="award-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="award-icon">&#9733;</span>
                <div>
                  <strong className="award-title">{award.title}</strong>
                  <span className="award-org">{award.org}</span>
                  {award.detail && <span className="award-detail">{award.detail}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
