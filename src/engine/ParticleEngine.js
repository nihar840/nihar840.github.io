import FireParticle from './particles/FireParticle';
import RainParticle from './particles/RainParticle';
import SnowParticle from './particles/SnowParticle';
import StarParticle from './particles/StarParticle';

const BEHAVIORS = {
  fire: FireParticle,
  rain: RainParticle,
  snow: SnowParticle,
  star: StarParticle,
};

/**
 * Lightweight canvas particle engine with object pooling.
 * No GC pressure — pre-allocates all particle objects.
 */
export default class ParticleEngine {
  constructor(canvas, config) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.w = canvas.width;
    this.h = canvas.height;
    this.behavior = BEHAVIORS[config.particleType] || BEHAVIORS.fire;
    this.colors = config.colors || ['#f59e0b', '#ef4444', '#fbbf24'];
    this.maxCount = config.count || 120;

    // Pre-allocate particle pool
    this.pool = new Array(this.maxCount);
    for (let i = 0; i < this.maxCount; i++) {
      this.pool[i] = { active: false, x: 0, y: 0, vx: 0, vy: 0, size: 0, alpha: 0, life: 0, maxLife: 0, rotation: 0, colorIdx: 0, length: 0, wobbleSpeed: 0, wobbleAmp: 0, twinkleSpeed: 0, baseAlpha: 0 };
    }
    this.activeCount = 0;
    this._spawnAll();
  }

  _spawnAll() {
    for (let i = 0; i < this.maxCount; i++) {
      const p = this.pool[i];
      p.active = true;
      this.behavior.spawn(p, this.w, this.h);
      // Stagger initial life for variety
      p.life = Math.floor(Math.random() * (p.maxLife || 100));
    }
    this.activeCount = this.maxCount;
  }

  setType(particleType, colors) {
    this.behavior = BEHAVIORS[particleType] || BEHAVIORS.fire;
    this.colors = colors;
    this._spawnAll();
  }

  resize(w, h) {
    this.w = w;
    this.h = h;
    this.canvas.width = w;
    this.canvas.height = h;
  }

  update() {
    for (let i = 0; i < this.maxCount; i++) {
      const p = this.pool[i];
      if (!p.active) {
        // Respawn dead particles
        p.active = true;
        this.behavior.spawn(p, this.w, this.h);
        continue;
      }
      const alive = this.behavior.update(p, this.w, this.h);
      if (!alive) {
        p.active = true;
        this.behavior.spawn(p, this.w, this.h);
      }
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.w, this.h);
    for (let i = 0; i < this.maxCount; i++) {
      const p = this.pool[i];
      if (p.active && p.alpha > 0.01) {
        this.behavior.render(this.ctx, p, this.colors);
      }
    }
    this.ctx.globalAlpha = 1;
  }

  destroy() {
    this.pool = null;
    this.ctx = null;
    this.canvas = null;
  }
}
