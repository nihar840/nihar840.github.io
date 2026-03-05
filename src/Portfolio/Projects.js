import React from 'react';
import { projects } from './data';
import './Projects.css';

function Projects() {
  return (
    <section className="projects" id="projects">
      <div className="section-container">
        <h2 className="section-title">Projects</h2>
        <p className="section-sub">Things I've built &amp; shipped</p>

        <div className="projects__grid">
          {projects.map((p) => (
            <div className="project-card" key={p.title} style={{ '--project-color': p.color }}>
              <div className="project-card__glow" />
              <div className="project-card__emoji">{p.emoji}</div>
              <h3 className="project-card__title">{p.title}</h3>
              <p className="project-card__desc">{p.description}</p>
              <div className="project-card__tags">
                {p.tags.map((t) => (
                  <span className="project-card__tag" key={t}>{t}</span>
                ))}
              </div>
              {p.link && (
                <a href={p.link} className="project-card__link" target="_blank" rel="noreferrer">
                  View →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
