import { useMemo } from 'react';

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Generates randomized CSS custom properties for 3D block animation.
 * Returns an object of inline style vars to spread onto an element.
 */
export default function useFloatingBlock(index) {
  return useMemo(() => ({
    '--dx1': rand(-20, 20) + 'px',
    '--dy1': rand(-15, 15) + 'px',
    '--dz1': rand(-30, 30) + 'px',
    '--rx1': rand(-8, 8) + 'deg',
    '--ry1': rand(-12, 12) + 'deg',
    '--dx2': rand(-25, 25) + 'px',
    '--dy2': rand(-20, 20) + 'px',
    '--dz2': rand(-40, 40) + 'px',
    '--rx2': rand(-10, 10) + 'deg',
    '--ry2': rand(-15, 15) + 'deg',
    '--dx3': rand(-20, 20) + 'px',
    '--dy3': rand(-18, 18) + 'px',
    '--dz3': rand(-35, 35) + 'px',
    '--rx3': rand(-6, 6) + 'deg',
    '--ry3': rand(-10, 10) + 'deg',
    '--float-duration': (8 + rand(0, 12)) + 's',
    '--float-delay': (index * -1.5) + 's',
  }), [index]);
}
