/** Snowflake particle behavior */
const SnowParticle = {
  spawn(p, w, h) {
    p.x = Math.random() * w;
    p.y = -10 - Math.random() * h * 0.2;
    p.vx = (Math.random() - 0.5) * 0.5;
    p.vy = 0.5 + Math.random() * 1.5;
    p.size = 1 + Math.random() * 3;
    p.alpha = 0.3 + Math.random() * 0.5;
    p.life = 0;
    p.maxLife = 999;
    p.rotation = Math.random() * Math.PI * 2;
    p.wobbleSpeed = 0.02 + Math.random() * 0.03;
    p.wobbleAmp = 0.5 + Math.random() * 1;
    p.colorIdx = Math.floor(Math.random() * 3);
  },

  update(p, w, h) {
    p.life++;
    p.x += p.vx + Math.sin(p.life * p.wobbleSpeed) * p.wobbleAmp;
    p.y += p.vy;
    p.rotation += 0.01;
    if (p.y > h + 10) return false;
    return true;
  },

  render(ctx, p, colors) {
    const c = colors[p.colorIdx] || colors[0];
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    // Soft glow for larger flakes
    if (p.size > 2) {
      ctx.globalAlpha = p.alpha * 0.2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  },
};

export default SnowParticle;
