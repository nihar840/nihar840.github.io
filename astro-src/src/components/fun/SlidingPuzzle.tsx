import { useState, useCallback } from 'react';
import './SlidingPuzzle.css';

const SIZE = 3;
const TOTAL = SIZE * SIZE;   // 9 cells; index 8 = empty
const SOLVED = Array.from({ length: TOTAL }, (_, i) => i);

/* ── Solvability (3×3: even inversions = solvable) ── */
function isSolvable(tiles: number[]): boolean {
  const flat = tiles.filter(t => t !== TOTAL - 1);
  let inv = 0;
  for (let i = 0; i < flat.length; i++)
    for (let j = i + 1; j < flat.length; j++)
      if (flat[i] > flat[j]) inv++;
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

/* ── Tile data — each non-empty tile has its own personality ── */
const TILES: { emoji: string; label: string; color: string; textColor: string }[] = [
  { emoji: '👒', label: '1',  color: '#e63946', textColor: '#fff' },   // 0 — Straw Hat
  { emoji: '🌊', label: '2',  color: '#2d6a9f', textColor: '#fff' },   // 1 — Sea
  { emoji: '⚔️', label: '3',  color: '#c77c2a', textColor: '#fff' },   // 2 — Swords
  { emoji: '🏴‍☠️', label: '4', color: '#1a1a2e', textColor: '#f4a261' }, // 3 — Flag
  { emoji: '🔥', label: '5',  color: '#d62828', textColor: '#fff' },   // 4 — Fire
  { emoji: '⚡', label: '6',  color: '#4a4a8a', textColor: '#ffd700' }, // 5 — Lightning
  { emoji: '🍖', label: '7',  color: '#8b5e3c', textColor: '#fff' },   // 6 — Meat
  { emoji: '🌸', label: '8',  color: '#7b2d8b', textColor: '#fff' },   // 7 — Sakura
  // index 8 = empty tile (not in TILES)
];

/* ── Goal arrangement shown below grid ── */
const GOAL_ORDER = [1, 2, 3, 4, 5, 6, 7, 8, '□'];

export default function SlidingPuzzle() {
  const [tiles, setTiles] = useState<number[]>(() => shuffle(SOLVED));
  const [won, setWon]     = useState(false);
  const [moves, setMoves] = useState(0);

  const isSolved = useCallback((t: number[]) => t.every((v, i) => v === i), []);

  function handleClick(idx: number) {
    if (won) return;
    const emptyIdx = tiles.indexOf(TOTAL - 1);
    const row  = Math.floor(idx / SIZE);
    const col  = idx % SIZE;
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

  return (
    <div className="puzzle-wrap">
      {/* Goal hint */}
      <div className="puzzle-goal-hint">
        <span className="puzzle-goal__label">Goal:</span>
        {TILES.map((t, i) => (
          <div
            key={i}
            className="puzzle-goal-chip"
            style={{ background: t.color, color: t.textColor }}
          >
            {t.emoji}
          </div>
        ))}
        <div className="puzzle-goal-chip puzzle-goal-chip--empty">□</div>
      </div>

      <div className="puzzle-header">
        <span className="puzzle-moves">⚡ {moves} moves</span>
        <button className="puzzle-shuffle-btn" onClick={reset}>🔀 Shuffle</button>
      </div>

      <div className={`puzzle-grid ${won ? 'puzzle-grid--won' : ''}`}>
        {tiles.map((tileVal, idx) => {
          const isEmpty = tileVal === TOTAL - 1;
          const tile    = isEmpty ? null : TILES[tileVal];
          return (
            <div
              key={tileVal}
              className={`puzzle-tile ${isEmpty ? 'puzzle-tile--empty' : ''} ${!isEmpty ? 'puzzle-tile--clickable' : ''}`}
              onClick={() => handleClick(idx)}
              role={isEmpty ? undefined : 'button'}
              aria-label={tile ? `Tile ${tile.label} ${tile.emoji}` : 'Empty'}
              style={tile ? { background: tile.color, color: tile.textColor } : {}}
            >
              {tile && (
                <div className="puzzle-tile__inner">
                  <span className="puzzle-tile__emoji">{tile.emoji}</span>
                  <span className="puzzle-tile__num">{tile.label}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="puzzle-tip">Tap a tile next to the blank to move it →</p>

      {won && (
        <div className="puzzle-win" role="alert">
          <div className="puzzle-win__box">
            <div className="puzzle-win__emoji">🎉</div>
            <div className="puzzle-win__title">GOMU GOMU NO WIN!</div>
            <div className="puzzle-win__sub">Solved in {moves} moves — Nakama approved! 🏴‍☠️</div>
            <button className="puzzle-shuffle-btn puzzle-shuffle-btn--win" onClick={reset}>
              🔀 Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
