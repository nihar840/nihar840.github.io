import React, { useRef, useEffect, useCallback } from 'react';
import './PhysicsPatterns.css';

/**
 * Physics-based generative art engine.
 *
 * Renders real physics equations as beautiful animated patterns on a canvas:
 * - Lissajous curves (parametric harmonics)
 * - Standing wave interference (superposition)
 * - Golden ratio spiral (Fibonacci/phi)
 * - Neural Brownian connections (random walk + spring forces)
 * - Electromagnetic field lines
 *
 * All patterns are theme-reactive via CSS custom properties.
 */

const PHI = (1 + Math.sqrt(5)) / 2; // Golden ratio 1.618...
const TAU = Math.PI * 2;

// ── Lissajous Curve ──────────────────────────────────────────
// x = A·sin(a·t + δ),  y = B·sin(b·t)
// When a/b is rational → closed curves of stunning beauty
function drawLissajous(ctx, w, h, time, color) {
  const cx = w / 2;
  const cy = h / 2;
  const A = w * 0.25;
  const B = h * 0.2;

  // Slowly evolving frequency ratios create morphing patterns
  const a = 3 + Math.sin(time * 0.1) * 0.5;
  const b = 2 + Math.cos(time * 0.07) * 0.3;
  const delta = time * 0.3; // Phase shift rotates the figure

  ctx.beginPath();
  for (let t = 0; t < TAU; t += 0.005) {
    const x = cx + A * Math.sin(a * t + delta);
    const y = cy + B * Math.sin(b * t);
    if (t === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.8;
  ctx.globalAlpha = 0.4;
  ctx.stroke();
  ctx.globalAlpha = 1;
}

// ── Standing Wave Interference ───────────────────────────────
// ψ(x,t) = Σ Aᵢ·sin(kᵢ·x - ωᵢ·t + φᵢ)
// Superposition of multiple sine waves → interference patterns
function drawWaveInterference(ctx, w, h, time, color) {
  const waves = [
    { A: 20, k: 0.03, omega: 1.5, phi: 0 },
    { A: 15, k: 0.05, omega: 2.1, phi: Math.PI / 3 },
    { A: 12, k: 0.07, omega: 0.8, phi: Math.PI / 5 },
    { A: 8, k: 0.11, omega: 3.0, phi: Math.PI / 7 },
  ];

  // Draw 3 horizontal interference lines at different heights
  for (let line = 0; line < 3; line++) {
    const baseY = h * 0.3 + line * h * 0.2;
    ctx.beginPath();
    for (let x = 0; x < w; x += 2) {
      // Superposition principle: sum all wave contributions
      let y = 0;
      for (const wave of waves) {
        y += wave.A * Math.sin(wave.k * x - wave.omega * time + wave.phi + line * 0.5);
      }
      if (x === 0) ctx.moveTo(x, baseY + y);
      else ctx.lineTo(x, baseY + y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.6;
    ctx.globalAlpha = 0.15 + line * 0.05;
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

// ── Golden Ratio Spiral ──────────────────────────────────────
// r = a·e^(b·θ), where b = ln(φ)/(π/2)
// The same spiral found in galaxies, shells, hurricanes, DNA
function drawGoldenSpiral(ctx, w, h, time, color) {
  const cx = w * 0.45;
  const cy = h * 0.55;
  const b = Math.log(PHI) / (Math.PI / 2);
  const a = 2;
  const rotation = time * 0.15;

  ctx.beginPath();
  for (let theta = 0; theta < 6 * Math.PI; theta += 0.02) {
    const r = a * Math.exp(b * theta);
    if (r > Math.max(w, h) * 0.5) break;
    const x = cx + r * Math.cos(theta + rotation);
    const y = cy + r * Math.sin(theta + rotation);
    if (theta === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.7;
  ctx.globalAlpha = 0.25;
  ctx.stroke();

  // Golden ratio rectangles — fading fibonacci boxes
  ctx.globalAlpha = 0.08;
  let rw = 30, rh = rw / PHI;
  let rx = cx, ry = cy;
  for (let i = 0; i < 8; i++) {
    ctx.strokeRect(rx - rw / 2, ry - rh / 2, rw, rh);
    const temp = rw;
    rw = rw + rh;
    rh = temp;
    rx += Math.cos(rotation + i * Math.PI / 2) * rh * 0.3;
    ry += Math.sin(rotation + i * Math.PI / 2) * rh * 0.3;
  }
  ctx.globalAlpha = 1;
}

// ── Neural Brownian Network ──────────────────────────────────
// Simulates random synaptic connections with spring-damper physics:
// F = -k·(x - x₀) - c·v + noise
// Models how neurons form random connections — the basis of creativity
class NeuralNode {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.homeX = x;
    this.homeY = y;
    this.vx = 0;
    this.vy = 0;
    this.radius = 1 + Math.random() * 2;
    this.w = w;
    this.h = h;
    this.phase = Math.random() * TAU;
  }

  update(dt) {
    // Spring force back to home position
    const k = 0.3;
    const c = 0.9; // damping
    const fx = -k * (this.x - this.homeX) + (Math.random() - 0.5) * 2;
    const fy = -k * (this.y - this.homeY) + (Math.random() - 0.5) * 2;

    this.vx = (this.vx + fx * dt) * c;
    this.vy = (this.vy + fy * dt) * c;
    this.x += this.vx;
    this.y += this.vy;
    this.phase += dt * 0.5;
  }
}

let neuralNodes = null;
let neuralConnections = null;

function initNeuralNetwork(w, h) {
  const count = 25;
  neuralNodes = Array.from({ length: count }, () =>
    new NeuralNode(
      Math.random() * w,
      Math.random() * h,
      w, h
    )
  );

  // Random connections — like synaptic formation
  neuralConnections = [];
  for (let i = 0; i < count; i++) {
    const connectionCount = 1 + Math.floor(Math.random() * 3);
    for (let c = 0; c < connectionCount; c++) {
      const j = Math.floor(Math.random() * count);
      if (j !== i) neuralConnections.push([i, j]);
    }
  }
}

function drawNeuralNetwork(ctx, w, h, time, color, accentColor) {
  if (!neuralNodes || neuralNodes[0].w !== w) {
    initNeuralNetwork(w, h);
  }

  const dt = 0.16;
  for (const node of neuralNodes) {
    node.update(dt);
  }

  // Draw connections — signal propagation with traveling pulse
  ctx.lineWidth = 0.4;
  for (const [i, j] of neuralConnections) {
    const a = neuralNodes[i];
    const b = neuralNodes[j];
    const dist = Math.hypot(b.x - a.x, b.y - a.y);
    if (dist > w * 0.4) continue;

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.12;
    ctx.stroke();

    // Traveling signal dot along connection
    const pulse = (Math.sin(time * 2 + i * 0.7) + 1) / 2;
    const px = a.x + (b.x - a.x) * pulse;
    const py = a.y + (b.y - a.y) * pulse;
    ctx.beginPath();
    ctx.arc(px, py, 1, 0, TAU);
    ctx.fillStyle = accentColor;
    ctx.globalAlpha = 0.3 * (1 - dist / (w * 0.4));
    ctx.fill();
  }

  // Draw nodes — pulsing neural bodies
  for (const node of neuralNodes) {
    const pulse = 0.7 + Math.sin(node.phase + time) * 0.3;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius * pulse, 0, TAU);
    ctx.fillStyle = accentColor;
    ctx.globalAlpha = 0.35;
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// ── Electromagnetic Field Lines ──────────────────────────────
// B = μ₀/(4π) · Σ (qᵢvᵢ × r̂)/r²
// Simplified: draw field lines between two oscillating charges
function drawEMField(ctx, w, h, time, color) {
  const charge1 = { x: w * 0.35 + Math.sin(time * 0.4) * 30, y: h * 0.5 };
  const charge2 = { x: w * 0.65 + Math.cos(time * 0.3) * 30, y: h * 0.5 };

  ctx.lineWidth = 0.4;
  ctx.globalAlpha = 0.1;
  ctx.strokeStyle = color;

  // Field lines emanating from each charge
  for (let angle = 0; angle < TAU; angle += TAU / 12) {
    ctx.beginPath();
    let x = charge1.x + Math.cos(angle) * 5;
    let y = charge1.y + Math.sin(angle) * 5;
    ctx.moveTo(x, y);

    for (let step = 0; step < 80; step++) {
      // Electric field = sum of contributions from both charges
      const dx1 = x - charge1.x, dy1 = y - charge1.y;
      const dx2 = x - charge2.x, dy2 = y - charge2.y;
      const r1sq = dx1 * dx1 + dy1 * dy1 + 1;
      const r2sq = dx2 * dx2 + dy2 * dy2 + 1;

      // E = q/r² · r̂  (positive + negative charge dipole)
      let Ex = dx1 / (r1sq * Math.sqrt(r1sq)) - dx2 / (r2sq * Math.sqrt(r2sq));
      let Ey = dy1 / (r1sq * Math.sqrt(r1sq)) - dy2 / (r2sq * Math.sqrt(r2sq));

      const mag = Math.sqrt(Ex * Ex + Ey * Ey) + 0.0001;
      Ex /= mag;
      Ey /= mag;

      x += Ex * 4;
      y += Ey * 4;

      if (x < 0 || x > w || y < 0 || y > h) break;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

// ═══════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════

export default function PhysicsPatterns({ pattern = 'all', className = '' }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const startTime = useRef(Date.now());

  const getThemeColors = useCallback(() => {
    const style = getComputedStyle(document.documentElement);
    return {
      primary: style.getPropertyValue('--accent-primary').trim() || '#f59e0b',
      glow: style.getPropertyValue('--accent-glow').trim() || 'rgba(245,158,11,0.3)',
      hud: style.getPropertyValue('--hud-border-color').trim() || 'rgba(232,232,237,0.1)',
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let running = true;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.scale(dpr, dpr);
      neuralNodes = null; // reset on resize
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      if (!running) return;
      const time = (Date.now() - startTime.current) / 1000;
      const w = canvas.width / (Math.min(window.devicePixelRatio || 1, 2));
      const h = canvas.height / (Math.min(window.devicePixelRatio || 1, 2));
      const colors = getThemeColors();

      ctx.clearRect(0, 0, w, h);

      if (pattern === 'all' || pattern === 'waves') {
        drawWaveInterference(ctx, w, h, time, colors.hud);
      }
      if (pattern === 'all' || pattern === 'lissajous') {
        drawLissajous(ctx, w, h, time, colors.primary);
      }
      if (pattern === 'all' || pattern === 'spiral') {
        drawGoldenSpiral(ctx, w, h, time, colors.hud);
      }
      if (pattern === 'all' || pattern === 'neural') {
        drawNeuralNetwork(ctx, w, h, time, colors.hud, colors.primary);
      }
      if (pattern === 'all' || pattern === 'em') {
        drawEMField(ctx, w, h, time, colors.hud);
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    // Visibility API — pause when tab hidden
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frameRef.current);
      } else {
        animate();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    animate();

    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [pattern, getThemeColors]);

  return (
    <div className={`physics-patterns ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="physics-patterns__canvas" />
    </div>
  );
}
