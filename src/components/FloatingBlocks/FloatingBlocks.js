import React from 'react';
import useFloatingBlock from '../../engine/useFloatingBlock';
import './FloatingBlocks.css';

function Block({ label, index }) {
  const vars = useFloatingBlock(index);

  return (
    <div className="floating-block" style={vars}>
      <div className="floating-block__face floating-block__face--front">
        <span className="floating-block__label">{label}</span>
      </div>
      <div className="floating-block__face floating-block__face--back" />
      <div className="floating-block__face floating-block__face--left" />
      <div className="floating-block__face floating-block__face--right" />
      <div className="floating-block__face floating-block__face--top" />
      <div className="floating-block__face floating-block__face--bottom" />
    </div>
  );
}

const MemoBlock = React.memo(Block);

export default function FloatingBlocks({ items, className = '' }) {
  return (
    <div className={`floating-blocks ${className}`}>
      {items.map((item, i) => (
        <MemoBlock key={item} label={item} index={i} />
      ))}
    </div>
  );
}
