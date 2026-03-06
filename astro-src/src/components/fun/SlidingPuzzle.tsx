import { useState, useEffect, useCallback } from 'react';
import './SlidingPuzzle.css';

const SIZE = 3;
const TOTAL = SIZE * SIZE;
const SOLVED = Array.from({ length: TOTAL }, (_, i) => i); // [0,1,2,...,8]; 8 = empty

function isSolvable(tiles: number[]): boolean {
  // For 3x3: count inversions. Puzzle is solvable iff inversions count is even.
  const flat = tiles.filter(t => t !== TOTAL - 1);
  let inv = 0;
  for (let i = 0; i < flat.length; i++) {
    for (let j = i + 1; j < flat.length; j++) {
      if (flat[i] > flat[j]) inv++;
    }
  }
  return inv % 2 === 0;
}

function shuffle(arr: number[]): number[] {
  const a = [...arr];
  do {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
  } while (!isSolvable(a) || a.every((v, i) => v === SOLVED[i]));
  return a;
}

const LABELS = [
  'SHIP', 'THE', 'CODE', '&', 'SAIL', 'THE', 'SEAS', '🏴‍☠️', ''
];

export default function SlidingPuzzle() {
  const [tiles, setTiles]   = useState<number[]>(() => shuffle(SOLVED));
  const [won, setWon]       = useState(false);
  const [moves, setMoves]   = useState(0);

  const isSolved = useCallback(
    (t: number[]) => t.every((v, i) => v === i),
    []
  );

  function handleClick(idx: number) {
    if (won) return;
    const emptyIdx = tiles.indexOf(TOTAL - 1);
    const row = Math.floor(idx / SIZE);
    const col = idx % SIZE;
    const eRow = Math.floor(emptyIdx / SIZE);
    const eCol = emptyIdx % SIZE;

    const adjacent =
      (Math.abs(row - eRow) === 1 && col === eCol) ||
      (Math.abs(col - eCol) === 1 && row === eRow);

    if (!adjacent) return;

    const next = [...tiles];
    [next[idx], next[emptyIdx]] = [next[emptyIdx], next[idx]];
    setTiles(next);
    setMoves(m => m + 1);
    if (isSolved(next)) setWon(true);
  }

  function reset() {
    setTiles(shuffle(SOLVED));
    setWon(false);
    setMoves(0);
  }

  const emptyIdx = tiles.indexOf(TOTAL - 1);

  return (
    <div className="puzzle-wrap">
      <div className="puzzle-header">
        <span className="puzzle-moves">⚡ {moves} moves</span>
        <button className="btn-manga btn-manga--secondary puzzle-reset-btn" onClick={reset}>
          🔀 Shuffle
        </button>
      </div>

      <div className={`puzzle-grid ${won ? 'puzzle-grid--won' : ''}`}>
        {tiles.map((tileVal, idx) => {
          const isEmpty = tileVal === TOTAL - 1;
          const row = Math.floor(tileVal / SIZE);
          const col = tileVal % SIZE;
          return (
            <div
              key={tileVal}
              className={`puzzle-tile ${isEmpty ? 'puzzle-tile--empty' : ''}`}
              onClick={() => handleClick(idx)}
              style={
                isEmpty
                  ? {}
                  : {
                      backgroundImage: `url('/puzzle/luffy.svg')`,
                      backgroundSize: `${SIZE * 100}% ${SIZE * 100}%`,
                      backgroundPosition: `${(col / (SIZE - 1)) * 100}% ${(row / (SIZE - 1)) * 100}%`,
                    }
              }
            >
              {isEmpty ? '' : <span className="puzzle-tile__label">{LABELS[tileVal]}</span>}
            </div>
          );
        })}
      </div>

      {won && (
        <div className="puzzle-win">
          <div className="puzzle-win__bubble speech-bubble--big">
            🎉 GOMU GOMU NO WIN! 🎉
            <br/>
            <span style={{ fontSize: '14px', fontFamily: 'var(--font-body)' }}>
              Solved in {moves} moves — Nakama approved!
            </span>
          </div>
          <button className="btn-manga btn-manga--primary" style={{ marginTop: '16px' }} onClick={reset}>
            🔀 Play Again
          </button>
        </div>
      )}
    </div>
  );
}
