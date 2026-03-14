import React from 'react';
import FloatingBlocks from '../FloatingBlocks/FloatingBlocks';
import './SkillBlocks.css';

const SKILL_LABELS = ['React', '.NET', 'Python', 'Azure', 'AI', 'TypeScript', 'Cosmos DB', 'DevOps'];

export default function SkillBlocks() {
  return (
    <FloatingBlocks items={SKILL_LABELS} className="hero-skill-blocks" />
  );
}
