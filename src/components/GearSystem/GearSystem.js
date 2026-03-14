import React, { useMemo } from 'react';
import { generateGearPath } from '../../engine/gearUtils';
import './GearSystem.css';

/**
 * Premium watch mechanism — gears drive real moving parts:
 * - Oscillating balance wheel
 * - Sweeping second hand
 * - Ticking escapement lever
 * - Connecting rods between gears
 */
export default function GearSystem({ size = 80, position = 'right', className = '' }) {
  const mech = useMemo(() => {
    const s = size;
    const s2 = s * 0.65;
    const s3 = s * 0.45;

    // Main gear: 16 teeth
    const gearA = generateGearPath(s, s, s * 0.9, s * 0.7, s * 0.18, 16);
    // Secondary gear: 10 teeth, meshed right
    const offsetB = s * 0.9 + s2 * 0.58;
    const gearB = generateGearPath(s + offsetB, s + s2 * 0.25, s2 * 0.9, s2 * 0.7, s2 * 0.14, 10);
    // Tertiary gear: 6 teeth, meshed below B
    const offsetCx = s + offsetB + s2 * 0.3;
    const offsetCy = s + s2 * 0.25 + s2 * 0.9 + s3 * 0.45;
    const gearC = generateGearPath(offsetCx, offsetCy, s3 * 0.9, s3 * 0.7, s3 * 0.12, 6);

    return { gearA, gearB, gearC, s, s2, s3, offsetB, offsetCx, offsetCy };
  }, [size]);

  const svgW = size * 3.5;
  const svgH = size * 3.2;

  // Centers for each gear
  const cA = { x: size, y: size };
  const cB = { x: size + mech.offsetB, y: size + mech.s2 * 0.25 };
  const cC = { x: mech.offsetCx, y: mech.offsetCy };

  return (
    <div className={`gear-system gear-system--${position} ${className}`}>
      <svg
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="gear-system__svg"
        aria-hidden="true"
      >
        {/* Connecting rods between gear centers */}
        <line x1={cA.x} y1={cA.y} x2={cB.x} y2={cB.y}
          className="gear-system__rod" />
        <line x1={cB.x} y1={cB.y} x2={cC.x} y2={cC.y}
          className="gear-system__rod" />

        {/* Gear A — Main drive */}
        <path d={mech.gearA}
          className="gear-system__gear gear-system__gear--a"
          style={{ transformOrigin: `${cA.x}px ${cA.y}px` }} />

        {/* Gear B — Secondary */}
        <path d={mech.gearB}
          className="gear-system__gear gear-system__gear--b"
          style={{ transformOrigin: `${cB.x}px ${cB.y}px` }} />

        {/* Gear C — Tertiary */}
        <path d={mech.gearC}
          className="gear-system__gear gear-system__gear--c"
          style={{ transformOrigin: `${cC.x}px ${cC.y}px` }} />

        {/* Center jewels (watch bearing dots) */}
        <circle cx={cA.x} cy={cA.y} r={3} className="gear-system__jewel" />
        <circle cx={cB.x} cy={cB.y} r={2.5} className="gear-system__jewel" />
        <circle cx={cC.x} cy={cC.y} r={2} className="gear-system__jewel" />

        {/* Sweeping second hand — driven by gear A */}
        <g style={{ transformOrigin: `${cA.x}px ${cA.y}px` }}
           className="gear-system__hand gear-system__hand--seconds">
          <line x1={cA.x} y1={cA.y} x2={cA.x} y2={cA.y - size * 0.75}
            stroke="var(--accent-primary)" strokeWidth="1" strokeLinecap="round" />
          <circle cx={cA.x} cy={cA.y - size * 0.75} r="1.5" fill="var(--accent-primary)" />
        </g>

        {/* Balance wheel — oscillating escapement */}
        <g style={{ transformOrigin: `${cC.x}px ${cC.y}px` }}
           className="gear-system__balance">
          <circle cx={cC.x} cy={cC.y} r={size * 0.28}
            fill="none" stroke="var(--gear-accent)" strokeWidth="0.5"
            strokeDasharray="3 5" />
          {/* Balance arm */}
          <line x1={cC.x - size * 0.22} y1={cC.y}
                x2={cC.x + size * 0.22} y2={cC.y}
            stroke="var(--gear-accent)" strokeWidth="0.8" strokeLinecap="round" />
          {/* Balance weights */}
          <circle cx={cC.x - size * 0.22} cy={cC.y} r="2" fill="var(--accent-primary)" opacity="0.6" />
          <circle cx={cC.x + size * 0.22} cy={cC.y} r="2" fill="var(--accent-primary)" opacity="0.6" />
        </g>

        {/* Escapement lever — ticking back and forth driven by gear B */}
        <g style={{ transformOrigin: `${cB.x}px ${cB.y}px` }}
           className="gear-system__escapement">
          <line x1={cB.x} y1={cB.y}
                x2={cB.x + size * 0.35} y2={cB.y - size * 0.15}
            stroke="var(--gear-accent)" strokeWidth="0.8" strokeLinecap="round" />
          {/* Fork at end */}
          <line x1={cB.x + size * 0.32} y1={cB.y - size * 0.18}
                x2={cB.x + size * 0.38} y2={cB.y - size * 0.12}
            stroke="var(--gear-accent)" strokeWidth="0.6" />
        </g>

        {/* Decorative screws */}
        {[cA, cB, cC].map((c, i) => (
          <g key={i}>
            <line x1={c.x - 1.5} y1={c.y - 1.5} x2={c.x + 1.5} y2={c.y + 1.5}
              stroke="var(--metallic-silver)" strokeWidth="0.4" opacity="0.5" />
            <line x1={c.x + 1.5} y1={c.y - 1.5} x2={c.x - 1.5} y2={c.y + 1.5}
              stroke="var(--metallic-silver)" strokeWidth="0.4" opacity="0.5" />
          </g>
        ))}
      </svg>
    </div>
  );
}
