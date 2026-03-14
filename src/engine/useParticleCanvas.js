import { useRef, useEffect, useCallback } from 'react';
import ParticleEngine from './ParticleEngine';

/**
 * Hook that manages a full-viewport particle canvas.
 * Returns a ref to attach to a <canvas> element.
 */
export default function useParticleCanvas(theme) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const rafRef = useRef(null);
  const visibleRef = useRef(true);

  const getColors = useCallback((t) => {
    const style = getComputedStyle(document.documentElement);
    return [
      style.getPropertyValue('--particle-color-1').trim() || '#f59e0b',
      style.getPropertyValue('--particle-color-2').trim() || '#ef4444',
      style.getPropertyValue('--particle-color-3').trim() || '#fbbf24',
    ];
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? (theme.particleCount?.mobile || 45) : (theme.particleCount?.desktop || 120);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Use a brief timeout to ensure CSS vars are applied
    const initTimeout = setTimeout(() => {
      const colors = getColors(theme);
      engineRef.current = new ParticleEngine(canvas, {
        particleType: theme.particleType,
        colors,
        count,
      });
      // Fix dimensions after engine constructor
      engineRef.current.w = w;
      engineRef.current.h = h;
    }, 50);

    const loop = () => {
      if (visibleRef.current && engineRef.current) {
        engineRef.current.update();
        engineRef.current.render();
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    const handleResize = () => {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      const ndpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = nw * ndpr;
      canvas.height = nh * ndpr;
      canvas.style.width = nw + 'px';
      canvas.style.height = nh + 'px';
      const ctx2 = canvas.getContext('2d');
      ctx2.scale(ndpr, ndpr);
      if (engineRef.current) {
        engineRef.current.w = nw;
        engineRef.current.h = nh;
      }
    };

    const handleVisibility = () => {
      visibleRef.current = !document.hidden;
    };

    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearTimeout(initTimeout);
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // React to theme changes
  useEffect(() => {
    if (!engineRef.current) return;
    const colors = getColors(theme);
    engineRef.current.setType(theme.particleType, colors);
  }, [theme.particleType, getColors, theme]);

  return canvasRef;
}
