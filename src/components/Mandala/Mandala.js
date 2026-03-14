import React, { useMemo } from 'react';
import './Mandala.css';

/**
 * Ancient Indian circuit-mandala pattern merged with AI neural aesthetics.
 * SVG-based — concentric rings with circuit traces, Sanskrit-inspired geometry,
 * and neural network node connections.
 */
export default function Mandala({ size = 200, className = '', position = '' }) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;

  const circuits = useMemo(() => {
    const paths = [];
    const nodeCount = 8;

    // Generate circuit trace paths radiating from center
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const r1 = s * 0.15;
      const r2 = s * 0.3;
      const r3 = s * 0.42;

      const x1 = cx + Math.cos(angle) * r1;
      const y1 = cy + Math.sin(angle) * r1;
      const x2 = cx + Math.cos(angle) * r2;
      const y2 = cy + Math.sin(angle) * r2;
      const x3 = cx + Math.cos(angle) * r3;
      const y3 = cy + Math.sin(angle) * r3;

      // Right-angle circuit trace
      const midAngle = angle + Math.PI / nodeCount;
      const bendX = cx + Math.cos(midAngle) * r2 * 0.7;
      const bendY = cy + Math.sin(midAngle) * r2 * 0.7;

      paths.push({
        line: `M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3}`,
        circuit: `M ${x2} ${y2} L ${bendX} ${bendY}`,
        nodes: [
          { x: x1, y: y1, r: 1.5 },
          { x: x2, y: y2, r: 2 },
          { x: x3, y: y3, r: 1.8 },
          { x: bendX, y: bendY, r: 1.2 },
        ],
        delay: i * 0.15,
      });
    }
    return paths;
  }, [s, cx, cy]);

  return (
    <div className={`mandala ${position ? `mandala--${position}` : ''} ${className}`} style={{ width: s, height: s }}>
      <svg viewBox={`0 0 ${s} ${s}`} className="mandala__svg" aria-hidden="true">
        {/* Concentric mandala rings */}
        <circle cx={cx} cy={cy} r={s * 0.44} className="mandala__ring mandala__ring--outer" />
        <circle cx={cx} cy={cy} r={s * 0.35} className="mandala__ring mandala__ring--mid" />
        <circle cx={cx} cy={cy} r={s * 0.22} className="mandala__ring mandala__ring--inner"
          strokeDasharray="4 6" />
        <circle cx={cx} cy={cy} r={s * 0.12} className="mandala__ring mandala__ring--core" />

        {/* Lotus petal pattern (ancient Indian geometry) */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const tipR = s * 0.38;
          const baseR = s * 0.18;
          const spread = Math.PI / 18;

          const tip = { x: cx + Math.cos(angle) * tipR, y: cy + Math.sin(angle) * tipR };
          const left = { x: cx + Math.cos(angle - spread) * baseR, y: cy + Math.sin(angle - spread) * baseR };
          const right = { x: cx + Math.cos(angle + spread) * baseR, y: cy + Math.sin(angle + spread) * baseR };

          return (
            <path key={`petal-${i}`}
              d={`M ${left.x} ${left.y} Q ${tip.x} ${tip.y} ${right.x} ${right.y}`}
              className="mandala__petal"
              style={{ animationDelay: `${i * 0.08}s` }}
            />
          );
        })}

        {/* Circuit traces — AI neural connections */}
        {circuits.map((c, i) => (
          <g key={i} className="mandala__circuit" style={{ animationDelay: `${c.delay}s` }}>
            <path d={c.line} className="mandala__trace" />
            <path d={c.circuit} className="mandala__trace mandala__trace--branch" />
            {c.nodes.map((n, j) => (
              <circle key={j} cx={n.x} cy={n.y} r={n.r} className="mandala__node" />
            ))}
          </g>
        ))}

        {/* Center — AI core eye */}
        <circle cx={cx} cy={cy} r={s * 0.05} className="mandala__core-dot" />
        <circle cx={cx} cy={cy} r={s * 0.03} className="mandala__core-inner" />

        {/* Rotating outer dots — data flow */}
        {Array.from({ length: 16 }, (_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const r = s * 0.46;
          return (
            <circle key={`dot-${i}`}
              cx={cx + Math.cos(angle) * r}
              cy={cy + Math.sin(angle) * r}
              r={i % 3 === 0 ? 1.5 : 0.8}
              className="mandala__data-dot"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          );
        })}
      </svg>
    </div>
  );
}
