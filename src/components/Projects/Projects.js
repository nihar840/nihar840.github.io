import React from 'react';
import { projects } from '../../data/projects';
import GlitchText from '../HUD/GlitchText';
import GearSystem from '../GearSystem/GearSystem';
import PhysicsPatterns from '../PhysicsPatterns/PhysicsPatterns';
import useIntersectionReveal from '../../engine/useIntersectionReveal';
import './Projects.css';

function ProjectCard({ project, index, revealed }) {
  return (
    <div
      className={`project-card hud-corners ${revealed ? 'project-card--revealed' : ''}`}
      style={{ animationDelay: `${0.2 + index * 0.12}s` }}
    >
      <div className="project-card__inner">
        <div className="project-card__header">
          <span className="project-card__emoji">{project.emoji}</span>
          <span className="project-card__index hud-label">#{String(index + 1).padStart(2, '0')}</span>
        </div>
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__desc">{project.description}</p>
        <div className="project-card__tags">
          {project.tags.map(tag => (
            <span key={tag} className="project-card__tag">{tag}</span>
          ))}
        </div>
      </div>
      {/* Glow effect on hover */}
      <div className="project-card__glow" />
    </div>
  );
}

export default function Projects() {
  const [ref, revealed] = useIntersectionReveal(0.1);

  return (
    <section className="hud-section projects-section" id="projects" ref={ref}>
      <PhysicsPatterns pattern="lissajous" className="physics-patterns--projects" />
      <GearSystem size={55} position="right" />
      <div className="hud-section__inner">
        <span className="hud-label">{'// builds'}</span>
        <GlitchText text="Projects" className="hud-title" />
        <div className="projects-grid">
          {projects.map((project, i) => (
            <ProjectCard key={i} project={project} index={i} revealed={revealed} />
          ))}
        </div>
      </div>
    </section>
  );
}
