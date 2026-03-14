export const THEMES = {
  ember: {
    id: 'ember',
    label: 'Ember',
    icon: '🔥',
    particleType: 'fire',
    particleCount: { desktop: 120, mobile: 45 },
  },
  storm: {
    id: 'storm',
    label: 'Storm',
    icon: '⛈️',
    particleType: 'rain',
    particleCount: { desktop: 150, mobile: 55 },
  },
  frost: {
    id: 'frost',
    label: 'Frost',
    icon: '❄️',
    particleType: 'snow',
    particleCount: { desktop: 100, mobile: 40 },
  },
  void: {
    id: 'void',
    label: 'Void',
    icon: '🌌',
    particleType: 'star',
    particleCount: { desktop: 130, mobile: 50 },
  },
};

export const DEFAULT_THEME = 'ember';

export const THEME_LIST = Object.values(THEMES);
