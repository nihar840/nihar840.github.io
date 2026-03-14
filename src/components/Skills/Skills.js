import React from 'react';
import { skills } from '../../data/skills';
import SkillBag from './SkillBag';
import GlitchText from '../HUD/GlitchText';
import GearSystem from '../GearSystem/GearSystem';
import RuneFlow from '../RuneFlow/RuneFlow';
import Mandala from '../Mandala/Mandala';
import PhysicsPatterns from '../PhysicsPatterns/PhysicsPatterns';
import useIntersectionReveal from '../../engine/useIntersectionReveal';
import './Skills.css';

export default function Skills() {
  const [ref, revealed] = useIntersectionReveal(0.1);

  return (
    <section className="hud-section skills-section" id="skills" ref={ref}>
      <PhysicsPatterns pattern="neural" className="physics-patterns--skills" />
      <GearSystem size={60} position="right" />
      <RuneFlow columns={4} position="left" />
      <Mandala size={180} position="top-right" />
      <div className="hud-section__inner">
        <span className="hud-label">{'// arsenal'}</span>
        <GlitchText text="Skills & Tools" className="hud-title" />
        <div className={`skills-grid ${revealed ? 'revealed' : ''}`}>
          {skills.map((skill, i) => (
            <div
              key={skill.category}
              className="skills-grid__item"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <SkillBag
                category={skill.category}
                icon={skill.icon}
                items={skill.items}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
