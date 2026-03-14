/** Fire ember particle behavior */
const FireParticle = {
  spawn(p, w, h) {
    p.x = w * 0.3 + Math.random() * w * 0.4;
    p.y = h * 0.7 + Math.random() * h * 0.3;
    p.vx = (Math.random() - 0.5) * 0.8;
    p.vy = -(0.5 + Math.random() * 1.5);
    p.size = 1 + Math.random() * 3;
    p.alpha = 0.6 + Math.random() * 0.4;
    p.life = 0;
    p.maxLife = 60 + Math.random() * 120;
    p.rotation = Math.random() * Math.PI * 2;
    p.colorIdx = Math.floor(Math.random() * 3);
  },

  update(p) {
    p.life++;
    p.x += p.vx + Math.sin(p.life * 0.05) * 0.3;
    p.y += p.vy;
    p.vy *= 0.995;
    p.alpha = Math.max(0, (1 - p.life / p.maxLife) * 0.8);
    p.size *= 0.998;
    p.rotation += 0.02;
    return p.life < p.maxLife;
  },

  render(ctx, p, colors) {
    const c = colors[p.colorIdx] || colors[0];
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    // Glow
    if (p.size > 1.5) {
      ctx.globalAlpha = p.alpha * 0.3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  },
};

export default FireParticle;
