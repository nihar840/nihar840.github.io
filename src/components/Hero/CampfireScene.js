import React, { useRef, useEffect } from 'react';
import CampfireRenderer from '../../engine/CampfireRenderer';
import './CampfireScene.css';

export default function CampfireScene() {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = 300;
    const h = 200;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    rendererRef.current = new CampfireRenderer(canvas);
    rendererRef.current.w = w;
    rendererRef.current.h = h;

    const loop = () => {
      rendererRef.current.update();
      rendererRef.current.render();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (rendererRef.current) rendererRef.current.destroy();
    };
  }, []);

  return (
    <div className="campfire-scene" aria-hidden="true">
      {/* Landscape silhouette */}
      <svg className="campfire-scene__landscape" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax slice">
        {/* Mountains */}
        <path d="M0 300 L0 200 L150 80 L300 180 L400 60 L550 190 L650 100 L800 200 L900 120 L1050 180 L1200 140 L1200 300Z"
          fill="rgba(15,15,25,0.95)" />
        {/* Trees */}
        <path d="M100 210 L110 160 L120 210Z" fill="rgba(10,10,18,0.9)" />
        <path d="M130 215 L145 140 L160 215Z" fill="rgba(12,12,20,0.9)" />
        <path d="M950 190 L965 120 L980 190Z" fill="rgba(10,10,18,0.9)" />
        <path d="M1000 195 L1010 150 L1020 195Z" fill="rgba(12,12,20,0.9)" />
        <path d="M1050 200 L1065 130 L1080 200Z" fill="rgba(10,10,18,0.9)" />
      </svg>

      {/* Warrior silhouette sitting by fire */}
      <div className="campfire-scene__warrior">
        <svg viewBox="0 0 200 220" className="campfire-scene__warrior-svg">
          {/* Body - sitting cross-legged */}
          <path d="M85 60 C85 40 115 40 115 60 C115 75 100 80 100 80 C100 80 85 75 85 60Z" fill="#0a0a12" />
          {/* Shoulders & torso */}
          <path d="M70 85 C70 78 85 75 100 80 C115 75 130 78 130 85 L135 130 L125 130 L120 100 L115 130 L85 130 L80 100 L75 130 L65 130Z" fill="#0a0a12" />
          {/* Cape/cloak flowing */}
          <path d="M65 85 C50 90 45 130 55 160 L70 150 L65 130Z" fill="#0c0c16" className="campfire-scene__cape" />
          <path d="M135 85 C150 90 155 130 145 160 L130 150 L135 130Z" fill="#0c0c16" className="campfire-scene__cape" />
          {/* Legs - crossed */}
          <path d="M75 130 L55 170 L65 175 L85 145 L80 175 L120 175 L115 145 L135 175 L145 170 L125 130Z" fill="#0a0a12" />
          {/* Arms - one on laptop */}
          <path d="M75 95 L50 120 L55 125 L78 105Z" fill="#0a0a12" />
          <path d="M125 95 L150 110 L160 120 L155 125 L140 115 L122 105Z" fill="#0a0a12" />
          {/* Laptop */}
          <rect x="130" y="110" width="35" height="22" rx="2" fill="#111120" stroke="var(--accent-primary)" strokeWidth="0.5" opacity="0.8" />
          <rect x="132" y="112" width="31" height="16" rx="1" fill="#0d0d1a" opacity="0.6" className="campfire-scene__screen" />
          {/* Skill bags/pouches */}
          <ellipse cx="45" cy="155" rx="12" ry="10" fill="#1a1520" stroke="var(--gear-accent)" strokeWidth="0.5" opacity="0.6" />
          <ellipse cx="160" cy="150" rx="10" ry="8" fill="#1a1520" stroke="var(--gear-accent)" strokeWidth="0.5" opacity="0.6" />
          <ellipse cx="55" cy="170" rx="8" ry="7" fill="#15121e" stroke="var(--gear-accent)" strokeWidth="0.3" opacity="0.5" />
        </svg>
      </div>

      {/* Fire canvas */}
      <canvas ref={canvasRef} className="campfire-scene__fire" />

      {/* Ground glow */}
      <div className="campfire-scene__ground-glow" />

      {/* Log silhouettes */}
      <div className="campfire-scene__logs">
        <svg viewBox="0 0 120 30" className="campfire-scene__logs-svg">
          <rect x="10" y="15" width="50" height="8" rx="4" fill="#1a1510" transform="rotate(-15 35 19)" />
          <rect x="55" y="15" width="55" height="8" rx="4" fill="#1a1510" transform="rotate(12 82 19)" />
          <rect x="30" y="20" width="60" height="6" rx="3" fill="#151210" transform="rotate(-5 60 23)" />
        </svg>
      </div>
    </div>
  );
}
