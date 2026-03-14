/**
 * Canvas-based campfire flame renderer.
 * Draws realistic animated flames using layered particles.
 */
export default class CampfireRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.flames = [];
    this.maxFlames = 35;
    this.w = canvas.width;
    this.h = canvas.height;
    this._initFlames();
  }

  _initFlames() {
    this.flames = [];
    for (let i = 0; i < this.maxFlames; i++) {
      this.flames.push(this._spawnFlame());
    }
  }

  _spawnFlame() {
    const cx = this.w / 2;
    const baseY = this.h * 0.75;
    return {
      x: cx + (Math.random() - 0.5) * 30,
      y: baseY,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -(1.5 + Math.random() * 3),
      size: 4 + Math.random() * 8,
      life: 0,
      maxLife: 30 + Math.random() * 40,
      hue: 20 + Math.random() * 30, // orange-red range
    };
  }

  resize(w, h) {
    this.w = w;
    this.h = h;
    this.canvas.width = w;
    this.canvas.height = h;
  }

  update() {
    for (let i = 0; i < this.flames.length; i++) {
      const f = this.flames[i];
      f.life++;
      f.x += f.vx + Math.sin(f.life * 0.15) * 0.5;
      f.y += f.vy;
      f.vy *= 0.98;
      f.size *= 0.97;

      if (f.life >= f.maxLife || f.size < 0.5) {
        this.flames[i] = this._spawnFlame();
      }
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.w, this.h);

    // Base glow
    const cx = this.w / 2;
    const baseY = this.h * 0.75;
    const glowGrad = this.ctx.createRadialGradient(cx, baseY, 0, cx, baseY, 80);
    glowGrad.addColorStop(0, 'rgba(245, 158, 11, 0.15)');
    glowGrad.addColorStop(0.5, 'rgba(239, 68, 68, 0.05)');
    glowGrad.addColorStop(1, 'transparent');
    this.ctx.fillStyle = glowGrad;
    this.ctx.fillRect(0, 0, this.w, this.h);

    // Flames
    for (const f of this.flames) {
      const progress = f.life / f.maxLife;
      const alpha = Math.max(0, 1 - progress);

      this.ctx.globalAlpha = alpha * 0.7;
      this.ctx.fillStyle = `hsl(${f.hue - progress * 20}, 90%, ${55 - progress * 20}%)`;
      this.ctx.beginPath();
      this.ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
      this.ctx.fill();

      // Inner bright core
      if (f.size > 3) {
        this.ctx.globalAlpha = alpha * 0.4;
        this.ctx.fillStyle = `hsl(${f.hue + 10}, 100%, 75%)`;
        this.ctx.beginPath();
        this.ctx.arc(f.x, f.y, f.size * 0.4, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    this.ctx.globalAlpha = 1;
  }

  destroy() {
    this.flames = null;
    this.ctx = null;
    this.canvas = null;
  }
}
