import React, { useState } from 'react';
import './SourceCards.css';

function SourceCard({ source, index }) {
  const [expanded, setExpanded] = useState(false);
  const preview = source.text.length > 120 ? source.text.slice(0, 120) + '…' : source.text;
  const title = source.metadata?.title || source.documentId;
  const score = Math.round(source.score * 100);

  return (
    <div className="source-card" onClick={() => setExpanded(e => !e)}>
      <div className="source-card__header">
        <span className="source-card__num">[{index + 1}]</span>
        <span className="source-card__title">{title}</span>
        <span className="source-card__score">{score}%</span>
      </div>
      <p className="source-card__text">{expanded ? source.text : preview}</p>
    </div>
  );
}

function SourceCards({ sources }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="source-cards">
      <h4 className="source-cards__heading">Sources</h4>
      <div className="source-cards__list">
        {sources.map((s, i) => (
          <SourceCard key={s.documentId + s.chunkIndex} source={s} index={i} />
        ))}
      </div>
    </div>
  );
}

export default SourceCards;
