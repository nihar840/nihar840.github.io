import React from 'react';

const style = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none',
  zIndex: 9999,
  overflow: 'hidden',
};

const lineStyle = {
  position: 'absolute',
  left: 0,
  right: 0,
  height: '2px',
  background: 'linear-gradient(90deg, transparent, var(--accent-glow), transparent)',
  opacity: 0.08,
  animation: 'scanLine 8s linear infinite',
};

export default function ScanLine() {
  return (
    <div style={style} aria-hidden="true">
      <div style={lineStyle} />
    </div>
  );
}
