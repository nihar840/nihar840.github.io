import React from 'react';
import './JourneyPath.css';

/**
 * SVG winding path that draws as user scrolls into view.
 */
export default function JourneyPath({ revealed, count }) {
  const height = count * 280 + 50;

  // Generate winding path points
  let d = `M 30 20`;
  for (let i = 0; i < count; i++) {
    const y = i * 280 + 20;
    const isRight = i % 2 === 0;
    d += ` C ${isRight ? 60 : 0} ${y + 100}, ${isRight ? 0 : 60} ${y + 180}, 30 ${y + 280}`;
  }

  return (
    <svg
      className={`journey-path ${revealed ? 'journey-path--revealed' : ''}`}
      viewBox={`0 0 60 ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Background path */}
      <path
        d={d}
        fill="none"
        stroke="var(--border-subtle)"
        strokeWidth="1"
      />
      {/* Animated foreground path */}
      <path
        d={d}
        fill="none"
        stroke="var(--accent-primary)"
        strokeWidth="1.5"
        className="journey-path__line"
        strokeDasharray="2000"
        strokeDashoffset="2000"
      />
      {/* Milestone dots */}
      {Array.from({ length: count }, (_, i) => (
        <circle
          key={i}
          cx="30"
          cy={i * 280 + 20}
          r="4"
          fill="var(--bg-base)"
          stroke="var(--accent-primary)"
          strokeWidth="1.5"
          className="journey-path__dot"
          style={{ animationDelay: `${0.5 + i * 0.3}s` }}
        />
      ))}
    </svg>
  );
}
