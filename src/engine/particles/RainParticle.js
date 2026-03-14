/** Rain drop particle behavior */
const RainParticle = {
  spawn(p, w, h) {
    p.x = Math.random() * w * 1.2 - w * 0.1;
    p.y = -10 - Math.random() * h * 0.3;
    p.vx = -1 - Math.random() * 1.5;
    p.vy = 6 + Math.random() * 8;
    p.size = 1 + Math.random() * 1.5;
    p.length = 10 + Math.random() * 20;
    p.alpha = 0.15 + Math.random() * 0.35;
    p.life = 0;
    p.maxLife = 999;
    p.colorIdx = Math.floor(Math.random() * 3);
  },

  update(p, w, h) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.y > h + 20 || p.x < -20) return false;
    return true;
  },

  render(ctx, p, colors) {
    const c = colors[p.colorIdx] || colors[0];
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = c;
    ctx.lineWidth = p.size * 0.5;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + p.vx * 2, p.y - p.length);
    ctx.stroke();
  },
};

export default RainParticle;
