import React from 'react';
import { skills } from './data';
import './Skills.css';

function Skills() {
  return (
    <section className="skills" id="skills">
      <div className="section-container">
        <h2 className="section-title">Skills &amp; Technologies</h2>
        <p className="section-sub">The tools I use to build things that matter</p>

        <div className="skills__grid">
          {skills.map((group) => (
            <div className="skills__card" key={group.category}>
              <div className="skills__card-header">
                <span className="skills__icon">{group.icon}</span>
                <h3 className="skills__category">{group.category}</h3>
              </div>
              <div className="skills__tags">
                {group.items.map((item) => (
                  <span className="skills__tag" key={item}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
