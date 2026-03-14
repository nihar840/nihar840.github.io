import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import useParticleCanvas from '../../engine/useParticleCanvas';
import './ParticleBackground.css';

export default function ParticleBackground() {
  const { theme } = useTheme();
  const canvasRef = useParticleCanvas(theme);

  return (
    <canvas
      ref={canvasRef}
      className="particle-bg"
      aria-hidden="true"
    />
  );
}
