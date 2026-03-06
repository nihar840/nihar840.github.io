import { useState, useEffect } from 'react';
import './ZoneToggle.css';

type Zone = 'work' | 'fun';

export default function ZoneToggle() {
  const [zone, setZone] = useState<Zone>('work');

  // Restore from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('portfolio-zone') as Zone | null;
    if (saved === 'fun') applyZone('fun');
  }, []);

  function applyZone(z: Zone) {
    setZone(z);
    sessionStorage.setItem('portfolio-zone', z);

    const workEl = document.getElementById('work-zone');
    const funEl  = document.getElementById('fun-zone');
    if (!workEl || !funEl) return;

    if (z === 'work') {
      workEl.classList.remove('zone-hidden');
      funEl.classList.remove('zone-visible');
    } else {
      workEl.classList.add('zone-hidden');
      funEl.classList.add('zone-visible');
    }
  }

  return (
    <div id="zone-toggle-bar">
      <div className="toggle-track">
        <button
          className={`zone-btn zone-btn--work ${zone === 'work' ? 'active' : ''}`}
          onClick={() => applyZone('work')}
          aria-pressed={zone === 'work'}
        >
          💼 <span>Work Zone</span>
        </button>

        <div className={`toggle-thumb ${zone === 'fun' ? 'toggle-thumb--fun' : ''}`} />

        <button
          className={`zone-btn zone-btn--fun ${zone === 'fun' ? 'active' : ''}`}
          onClick={() => applyZone('fun')}
          aria-pressed={zone === 'fun'}
        >
          🏴‍☠️ <span>Adventure</span>
        </button>
      </div>
    </div>
  );
}
