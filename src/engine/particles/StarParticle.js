/** Cosmic star particle behavior */
const StarParticle = {
  spawn(p, w, h) {
    p.x = Math.random() * w;
    p.y = Math.random() * h;
    p.vx = (Math.random() - 0.5) * 0.15;
    p.vy = (Math.random() - 0.5) * 0.15;
    p.size = 0.5 + Math.random() * 2;
    p.alpha = 0.2 + Math.random() * 0.6;
    p.life = 0;
    p.maxLife = 300 + Math.random() * 400;
    p.twinkleSpeed = 0.02 + Math.random() * 0.04;
    p.baseAlpha = p.alpha;
    p.colorIdx = Math.floor(Math.random() * 3);
  },

  update(p, w, h) {
    p.life++;
    p.x += p.vx;
    p.y += p.vy;
    // Twinkle
    p.alpha = p.baseAlpha * (0.5 + 0.5 * Math.sin(p.life * p.twinkleSpeed));
    // Wrap around edges
    if (p.x < 0) p.x = w;
    if (p.x > w) p.x = 0;
    if (p.y < 0) p.y = h;
    if (p.y > h) p.y = 0;
    return p.life < p.maxLife;
  },

  render(ctx, p, colors) {
    const c = colors[p.colorIdx] || colors[0];
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = c;
    // Star shape - 4-point cross
    const s = p.size;
    ctx.fillRect(p.x - s * 0.15, p.y - s, s * 0.3, s * 2);
    ctx.fillRect(p.x - s, p.y - s * 0.15, s * 2, s * 0.3);
    // Center glow
    if (s > 1) {
      ctx.globalAlpha = p.alpha * 0.25;
      ctx.beginPath();
      ctx.arc(p.x, p.y, s * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  },
};

export default StarParticle;
