import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { THEMES, DEFAULT_THEME } from './themes';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(() => {
    try {
      return localStorage.getItem('portfolio-theme') || DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  });

  const setTheme = useCallback((id) => {
    if (!THEMES[id]) return;
    setThemeId(id);
    document.documentElement.setAttribute('data-theme', id);
    try { localStorage.setItem('portfolio-theme', id); } catch {}
  }, []);

  // Set initial data-theme attribute
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeId);
  }, [themeId]);

  const value = useMemo(() => ({
    themeId,
    theme: THEMES[themeId],
    setTheme,
  }), [themeId, setTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
