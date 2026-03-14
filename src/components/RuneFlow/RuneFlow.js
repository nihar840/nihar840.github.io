import React, { useMemo } from 'react';
import './RuneFlow.css';

/**
 * Norse Futhark rune characters flowing with mystical animations.
 * Elder Futhark alphabet — 24 runes arranged in flowing streams.
 */

// Elder Futhark runes (Unicode block: Runic U+16A0-U+16FF)
const ELDER_FUTHARK = [
  '\u16A0', // ᚠ Fehu
  '\u16A2', // ᚢ Uruz
  '\u16A6', // ᚦ Thurisaz
  '\u16A8', // ᚨ Ansuz
  '\u16B1', // ᚱ Raidho
  '\u16B2', // ᚲ Kenaz (Kaun)
  '\u16B7', // ᚷ Gebo
  '\u16B9', // ᚹ Wunjo
  '\u16BA', // ᚺ Hagalaz
  '\u16BE', // ᚾ Naudiz
  '\u16C1', // ᛁ Isaz
  '\u16C3', // ᛃ Jera
  '\u16C7', // ᛇ Eihwaz
  '\u16C8', // ᛈ Perthro
  '\u16C9', // ᛉ Algiz
  '\u16CA', // ᛊ Sowilo
  '\u16CF', // ᛏ Tiwaz
  '\u16D2', // ᛒ Berkano
  '\u16D6', // ᛖ Ehwaz
  '\u16D7', // ᛗ Mannaz
  '\u16DA', // ᛚ Laguz
  '\u16DC', // ᛜ Ingwaz
  '\u16DE', // ᛞ Dagaz
  '\u16DF', // ᛟ Othala
];

function RuneColumn({ runes, index, direction, speed }) {
  return (
    <div
      className={`rune-column rune-column--${direction}`}
      style={{
        '--col-speed': `${speed}s`,
        '--col-delay': `${index * -3.5}s`,
        left: `${8 + index * 14}%`,
      }}
    >
      {runes.map((rune, i) => (
        <span
          key={i}
          className="rune-char"
          style={{ '--rune-delay': `${i * 0.4}s` }}
        >
          {rune}
        </span>
      ))}
    </div>
  );
}

/**
 * Renders flowing columns of Norse runes.
 * Props:
 *  - columns: number of rune streams (default 6)
 *  - position: 'background' | 'left' | 'right'
 */
export default function RuneFlow({ columns = 6, position = 'background' }) {
  const runeColumns = useMemo(() => {
    return Array.from({ length: columns }, (_, i) => {
      const count = 6 + Math.floor(Math.random() * 5);
      const runes = [];
      for (let j = 0; j < count; j++) {
        runes.push(ELDER_FUTHARK[Math.floor(Math.random() * ELDER_FUTHARK.length)]);
      }
      return {
        runes,
        direction: i % 2 === 0 ? 'up' : 'down',
        speed: 15 + Math.random() * 20,
      };
    });
  }, [columns]);

  return (
    <div className={`rune-flow rune-flow--${position}`} aria-hidden="true">
      {runeColumns.map((col, i) => (
        <RuneColumn key={i} index={i} {...col} />
      ))}
    </div>
  );
}
