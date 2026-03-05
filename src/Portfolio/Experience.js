import React, { useState } from 'react';
import { experience, education, awards } from './data';
import './Experience.css';

function Experience() {
  const [expanded, setExpanded] = useState(0);

  return (
    <section className="experience" id="experience">
      <div className="section-container">
        <h2 className="section-title">Experience</h2>
        <p className="section-sub">My professional journey so far</p>

        <div className="timeline">
          {experience.map((job, i) => (
            <div
              className={`timeline__item ${expanded === i ? 'timeline__item--open' : ''}`}
              key={`${job.company}-${i}`}
              onClick={() => setExpanded(expanded === i ? -1 : i)}
              style={{ '--accent-color': job.color }}
            >
              <div className="timeline__dot" />
              <div className="timeline__card">
                <div className="timeline__card-top">
                  <div>
                    <h3 className="timeline__role">{job.role}</h3>
                    <div className="timeline__meta">
                      <span className="timeline__company" style={{ color: job.color }}>{job.company}</span>
                      <span className="timeline__sep">·</span>
                      <span className="timeline__location">{job.location}</span>
                    </div>
                  </div>
                  <div className="timeline__right">
                    <span className="timeline__period">{job.period}</span>
                    <span className="timeline__chevron">{expanded === i ? '▲' : '▼'}</span>
                  </div>
                </div>

                <ul className={`timeline__highlights ${expanded === i ? 'timeline__highlights--show' : ''}`}>
                  {job.highlights.map((h, hi) => (
                    <li key={hi}><span className="timeline__bullet" style={{ color: job.color }}>▹</span> {h}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="edu">
          <h3 className="edu__title">Education</h3>
          {education.map((e) => (
            <div className="edu__card" key={e.institution}>
              <div className="edu__icon">🎓</div>
              <div className="edu__info">
                <div className="edu__degree">{e.degree}</div>
                <div className="edu__school">{e.institution}</div>
              </div>
              <div className="edu__right">
                <span className="edu__period">{e.period}</span>
                <span className="edu__gpa">GPA {e.gpa}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Awards & Certifications */}
        <div className="edu">
          <h3 className="edu__title">Awards & Certifications</h3>
          <div className="awards__grid">
            {awards.map((a, i) => (
              <div className="awards__card" key={i}>
                <div className="awards__icon">🏆</div>
                <div className="awards__info">
                  <div className="awards__title">{a.title}</div>
                  <div className="awards__org">{a.org}{a.detail ? ` · ${a.detail}` : ''}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default Experience;
