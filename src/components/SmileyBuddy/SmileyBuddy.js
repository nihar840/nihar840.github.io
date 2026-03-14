import React, { useRef, useEffect, useCallback } from 'react';
import './SmileyBuddy.css';

/**
 * SmileyBuddy — An equation-drawn smiley that roams the page.
 * SpiderBuddy — A separate cartoon Spider-Man character swinging around.
 *
 * All shapes drawn with parametric equations:
 *  - Circle: x = r·cos(t), y = r·sin(t)
 *  - Ellipse: x = a·cos(t), y = b·sin(t)
 *  - Smile/Frown: parabola y = k·x²
 *  - Lollipop spiral: Archimedean r = a + b·θ
 *  - Stars: polar rose r = cos(n·θ)
 *  - Web: catenary/Bézier curves
 */

const TAU = Math.PI * 2;

// ═══ Shared Drawing Helpers ═══

function drawCircle(ctx, cx, cy, r, steps = 64) {
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * TAU;
    const x = cx + r * Math.cos(t);
    const y = cy + r * Math.sin(t);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function drawEllipse(ctx, cx, cy, rx, ry, steps = 32) {
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * TAU;
    const x = cx + rx * Math.cos(t);
    const y = cy + ry * Math.sin(t);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function drawSmile(ctx, cx, cy, width, curvature) {
  ctx.beginPath();
  const steps = 20;
  for (let i = 0; i <= steps; i++) {
    const x = -width / 2 + (i / steps) * width;
    const y = curvature * x * x;
    if (i === 0) ctx.moveTo(cx + x, cy + y);
    else ctx.lineTo(cx + x, cy + y);
  }
}

function drawStar(ctx, cx, cy, size, petals) {
  ctx.beginPath();
  for (let i = 0; i <= 64; i++) {
    const t = (i / 64) * TAU;
    const r = size * Math.cos(petals * t);
    const x = cx + Math.abs(r) * Math.cos(t);
    const y = cy + Math.abs(r) * Math.sin(t);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function drawLollipop(ctx, x, y, angle, size) {
  const stickLen = size * 2.5;
  const endX = x + Math.cos(angle) * stickLen;
  const endY = y + Math.sin(angle) * stickLen;

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = '#d4a574';
  ctx.lineWidth = 2;
  ctx.stroke();

  drawCircle(ctx, x, y, size);
  ctx.fillStyle = '#ff6b9d';
  ctx.fill();

  // Archimedean spiral: r = a + b·θ
  ctx.beginPath();
  for (let t = 0; t < TAU * 2.5; t += 0.1) {
    const r = 1 + t * (size / (TAU * 2.5));
    const px = x + r * Math.cos(t);
    const py = y + r * Math.sin(t);
    if (t === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.strokeStyle = '#ff3366';
  ctx.lineWidth = 1;
  ctx.stroke();
}

// ═══════════════════════════════════════════════════
// SMILEY CHARACTER
// ═══════════════════════════════════════════════════

const SMILEY_R = 22;

const SM = {
  FLYING: 'FLYING',
  CRASHED: 'CRASHED',
  LOLLIPOP: 'LOLLIPOP',
  TRUMP_DANCE: 'TRUMP_DANCE',
  IDLE: 'IDLE',
  GRABBED: 'GRABBED',
  VANISHING: 'VANISHING',
};

function drawSmileyFace(ctx, x, y, state, t, accentColor) {
  let bodyAngle = 0;
  let bodyScaleX = 1;
  let armLeftAngle = 0;
  let armRightAngle = 0;
  let legSpread = 0;

  if (state === SM.TRUMP_DANCE) {
    bodyAngle = Math.sin(t * 6) * 0.15;
    bodyScaleX = 1 + Math.sin(t * 12) * 0.05;
    armLeftAngle = Math.sin(t * 6) * 0.8 - 0.5;
    armRightAngle = -Math.sin(t * 6) * 0.8 - 0.5;
    legSpread = Math.sin(t * 3) * 3;
  }

  if (state === SM.CRASHED) {
    bodyAngle = Math.sin(t * 20) * 0.1 * Math.max(0, 1 - t * 0.5);
  }

  if (state === SM.GRABBED) {
    bodyAngle = Math.sin(t * 15) * 0.2; // panic wiggle
  }

  // Vanishing — shrink to nothing
  let scale = 1;
  if (state === SM.VANISHING) {
    scale = Math.max(0, 1 - t * 1.5);
    if (scale <= 0) return;
  }

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(bodyAngle);
  ctx.scale(bodyScaleX * scale, scale);

  const isGrabbed = state === SM.GRABBED;
  // Face
  const isCrashed = state === SM.CRASHED;
  const faceColor = isCrashed ? '#ffaa44' : '#ffd93d';
  drawCircle(ctx, 0, 0, SMILEY_R);
  ctx.fillStyle = faceColor;
  ctx.fill();
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Eyes
  if (isGrabbed) {
    // Scared wide eyes — big circles with tiny pupils
    drawCircle(ctx, -8, -7, 5);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.stroke();
    drawCircle(ctx, 8, -7, 5);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.stroke();
    // Tiny scared pupils
    drawCircle(ctx, -8, -7, 1.5);
    ctx.fillStyle = '#333';
    ctx.fill();
    drawCircle(ctx, 8, -7, 1.5);
    ctx.fillStyle = '#333';
    ctx.fill();
  } else if (isCrashed && t < 2) {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    for (const eyeX of [-8, 8]) {
      ctx.beginPath();
      ctx.moveTo(eyeX - 3, -8 - 3); ctx.lineTo(eyeX + 3, -8 + 3);
      ctx.moveTo(eyeX + 3, -8 - 3); ctx.lineTo(eyeX - 3, -8 + 3);
      ctx.stroke();
    }
  } else {
    // Happy eyes
    drawEllipse(ctx, -8, -7, 3, 4);
    ctx.fillStyle = '#333';
    ctx.fill();
    drawEllipse(ctx, 8, -7, 3, 4);
    ctx.fillStyle = '#333';
    ctx.fill();
    // Shine
    drawCircle(ctx, -7, -8, 1.2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    drawCircle(ctx, 9, -8, 1.2);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }

  // Mouth
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  if (isGrabbed) {
    // Screaming open mouth — big oval
    drawEllipse(ctx, 0, 6, 6, 8);
    ctx.fillStyle = '#c0392b';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  } else if (isCrashed && t < 2) {
    // Sad frown
    drawSmile(ctx, 0, 12, 14, 0.1);
    ctx.stroke();
  } else if (state === SM.LOLLIPOP && t > 0.5 && t < 1.5) {
    drawCircle(ctx, 0, 6, 5);
    ctx.fillStyle = '#c0392b';
    ctx.fill();
  } else {
    // Big happy smile — parabola opening upward (ends curve DOWN in screen space)
    drawSmile(ctx, 0, 8, 18, -0.08);
    ctx.stroke();
  }

  // Blush
  if (!isCrashed) {
    ctx.globalAlpha = 0.3;
    drawCircle(ctx, -14, 2, 4);
    ctx.fillStyle = '#ff9999';
    ctx.fill();
    drawCircle(ctx, 14, 2, 4);
    ctx.fillStyle = '#ff9999';
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // Arms & Legs for Trump Dance
  ctx.strokeStyle = faceColor;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';

  if (state === SM.TRUMP_DANCE) {
    ctx.beginPath();
    ctx.moveTo(-SMILEY_R, 5);
    const laX = -SMILEY_R - 15 * Math.cos(armLeftAngle);
    const laY = 5 + 15 * Math.sin(armLeftAngle);
    ctx.lineTo(laX, laY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(SMILEY_R, 5);
    const raX = SMILEY_R + 15 * Math.cos(armRightAngle);
    const raY = 5 + 15 * Math.sin(armRightAngle);
    ctx.lineTo(raX, raY);
    ctx.stroke();

    drawCircle(ctx, laX, laY, 3);
    ctx.fillStyle = faceColor;
    ctx.fill();
    drawCircle(ctx, raX, raY, 3);
    ctx.fillStyle = faceColor;
    ctx.fill();

    ctx.strokeStyle = faceColor;
    ctx.beginPath(); ctx.moveTo(-5, SMILEY_R); ctx.lineTo(-5 - legSpread, SMILEY_R + 15); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(5, SMILEY_R); ctx.lineTo(5 + legSpread, SMILEY_R + 15); ctx.stroke();
  }

  // AHHH text + sweat when grabbed
  if (isGrabbed) {
    ctx.font = 'bold 14px monospace';
    ctx.fillStyle = '#ff4444';
    ctx.textAlign = 'center';
    const shakeX = Math.sin(t * 30) * 3;
    ctx.fillText('AHHH!!', shakeX, -SMILEY_R - 10);

    // Sweat drops — teardrop parametric
    ctx.fillStyle = '#66ccff';
    for (let i = 0; i < 3; i++) {
      const dropY = -SMILEY_R + 5 + ((t * 40 + i * 15) % 30);
      const dropX = (i - 1) * 12 + Math.sin(t * 8 + i) * 2;
      ctx.beginPath();
      ctx.moveTo(dropX, dropY - 3);
      ctx.quadraticCurveTo(dropX + 2, dropY, dropX, dropY + 3);
      ctx.quadraticCurveTo(dropX - 2, dropY, dropX, dropY - 3);
      ctx.fill();
    }
  }

  // Poof particles when vanishing
  if (state === SM.VANISHING) {
    ctx.globalAlpha = Math.max(0, 1 - t);
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * TAU + t * 3;
      const dist = t * 60;
      const px = Math.cos(angle) * dist;
      const py = Math.sin(angle) * dist;
      drawStar(ctx, px, py, 4 - t * 3, 4);
      ctx.fillStyle = '#ffd93d';
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // Dizzy stars
  if (isCrashed && t < 2.5) {
    ctx.strokeStyle = '#ffcc00';
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      const sa = t * 4 + (i / 3) * TAU;
      const sr = SMILEY_R + 8 + Math.sin(t * 5 + i) * 3;
      drawStar(ctx, Math.cos(sa) * sr, -SMILEY_R * 0.6 + Math.sin(sa) * sr * 0.3, 4, 5);
      ctx.stroke();
    }
  }

  ctx.restore();
}

class SmileyCharacter {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.x = w * 0.3 + Math.random() * w * 0.4;
    this.y = h * 0.3 + Math.random() * h * 0.3;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.state = SM.FLYING;
    this.stateTime = 0;
    this.nextActionTimer = 6 + Math.random() * 8;
    this.crashCooldown = 20; // start happy — no crashing for first 20s

    this.lollipopX = 0;
    this.lollipopY = 0;
    this.lollipopAngle = 0;
    this.lollipopVisible = false;
  }

  setState(s) { this.state = s; this.stateTime = 0; }

  update(dt, w, h) {
    this.w = w;
    this.h = h;
    this.stateTime += dt;
    if (this.crashCooldown > 0) this.crashCooldown -= dt;

    const m = SMILEY_R + 5;

    switch (this.state) {
      case SM.FLYING: {
        this.x += this.vx + Math.sin(this.stateTime * 1.2) * 0.4;
        this.y += this.vy + Math.cos(this.stateTime * 0.9) * 0.3;

        // Soft bounce — only crash sometimes (when cooldown allows)
        let hitWall = false;
        if (this.x < m) { this.x = m; this.vx = Math.abs(this.vx) * 0.7; hitWall = true; }
        if (this.x > w - m) { this.x = w - m; this.vx = -Math.abs(this.vx) * 0.7; hitWall = true; }
        if (this.y < m) { this.y = m; this.vy = Math.abs(this.vy) * 0.7; hitWall = true; }
        if (this.y > h - m) { this.y = h - m; this.vy = -Math.abs(this.vy) * 0.7; hitWall = true; }

        if (hitWall && this.crashCooldown <= 0 && Math.random() < 0.3) {
          this.setState(SM.CRASHED);
          this.crashCooldown = 15; // 15s before next crash
        }

        this.nextActionTimer -= dt;
        if (this.nextActionTimer <= 0) {
          this.pickAction();
        }
        break;
      }
      case SM.CRASHED: {
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.x += this.vx;
        this.y += this.vy;
        if (this.stateTime > 2) {
          this.spawnLollipop();
          this.setState(SM.LOLLIPOP);
        }
        break;
      }
      case SM.LOLLIPOP: {
        if (this.stateTime < 1.2) {
          const dx = this.x - this.lollipopX;
          const dy = this.y - this.lollipopY;
          this.lollipopX += dx * 0.05;
          this.lollipopY += dy * 0.05;
          this.lollipopAngle += 0.1;
          this.lollipopVisible = true;
        } else if (this.stateTime < 2.2) {
          this.lollipopX = this.x;
          this.lollipopY = this.y + 6;
          this.lollipopVisible = this.stateTime < 1.8;
        } else {
          this.lollipopVisible = false;
          this.vx = (Math.random() - 0.5) * 1.2;
          this.vy = (Math.random() - 0.5) * 0.8;
          this.setState(SM.FLYING);
          this.nextActionTimer = 8 + Math.random() * 8;
        }
        break;
      }
      case SM.TRUMP_DANCE: {
        this.x += Math.sin(this.stateTime * 3) * 1.5;
        this.y += Math.cos(this.stateTime * 2) * 0.5;
        if (this.stateTime > 4) {
          this.vx = (Math.random() - 0.5) * 1.2;
          this.vy = (Math.random() - 0.5) * 0.8;
          this.setState(SM.FLYING);
          this.nextActionTimer = 6 + Math.random() * 8;
        }
        break;
      }
      case SM.IDLE: {
        this.x += Math.sin(this.stateTime * 0.8) * 0.3;
        this.y += Math.cos(this.stateTime * 0.6) * 0.2;
        if (this.stateTime > 4) {
          this.vx = (Math.random() - 0.5) * 1.2;
          this.vy = (Math.random() - 0.5) * 0.8;
          this.setState(SM.FLYING);
          this.nextActionTimer = 5 + Math.random() * 6;
        }
        break;
      }
      default: break;
    }

    this.x = Math.max(m, Math.min(w - m, this.x));
    this.y = Math.max(m, Math.min(h - m, this.y));
  }

  spawnLollipop() {
    const side = Math.floor(Math.random() * 4);
    if (side === 0) { this.lollipopX = -20; this.lollipopY = Math.random() * this.h; }
    else if (side === 1) { this.lollipopX = this.w + 20; this.lollipopY = Math.random() * this.h; }
    else if (side === 2) { this.lollipopX = Math.random() * this.w; this.lollipopY = -20; }
    else { this.lollipopX = Math.random() * this.w; this.lollipopY = this.h + 20; }
  }

  pickAction() {
    const pick = Math.random() < 0.4 ? SM.TRUMP_DANCE : SM.IDLE;
    this.setState(pick);
  }

  hitTest(mx, my) {
    return Math.hypot(mx - this.x, my - this.y) < SMILEY_R + 8;
  }

  grab(mx, my) {
    this.setState(SM.GRABBED);
    this.x = mx;
    this.y = my;
    this.lollipopVisible = false;
  }

  dragTo(mx, my) {
    this.x = mx;
    this.y = my;
  }

  release() {
    if (this.state === SM.GRABBED) {
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1;
      this.setState(SM.FLYING);
      this.crashCooldown = 10;
      this.nextActionTimer = 5 + Math.random() * 5;
    }
  }

  vanish() {
    this.setState(SM.VANISHING);
  }

  get isAlive() {
    return !(this.state === SM.VANISHING && this.stateTime > 1);
  }

  draw(ctx, accent) {
    if (!this.isAlive) return;
    if (this.lollipopVisible) {
      drawLollipop(ctx, this.lollipopX, this.lollipopY, this.lollipopAngle, 7);
    }
    drawSmileyFace(ctx, this.x, this.y, this.state, this.stateTime, accent);
  }
}

// ═══════════════════════════════════════════════════
// SPIDER-MAN CHARACTER (separate cartoon buddy)
// ═══════════════════════════════════════════════════

const SPIDEY_R = 16;

const SP = {
  SWINGING: 'SWINGING',
  FLYING: 'FLYING',
  PERCHING: 'PERCHING',
  GRABBED: 'GRABBED',
  VANISHING: 'VANISHING',
};

function drawSpideyFace(ctx, x, y, angle, t) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Head — red circle
  drawCircle(ctx, 0, 0, SPIDEY_R);
  ctx.fillStyle = '#c0392b';
  ctx.fill();
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Web pattern on mask — concentric rings
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 0.5;
  for (let r = 4; r <= SPIDEY_R; r += 4) {
    drawCircle(ctx, 0, 0, r);
    ctx.stroke();
  }
  // Radial web lines
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * SPIDEY_R, Math.sin(a) * SPIDEY_R);
    ctx.stroke();
  }

  // Eyes — angular white shapes (iconic Spider-Man)
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 1;

  // Left eye
  ctx.beginPath();
  ctx.moveTo(-11, -6);
  ctx.lineTo(-5, -10);
  ctx.lineTo(-2, -4);
  ctx.lineTo(-7, -1);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right eye
  ctx.beginPath();
  ctx.moveTo(11, -6);
  ctx.lineTo(5, -10);
  ctx.lineTo(2, -4);
  ctx.lineTo(7, -1);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Body
  ctx.strokeStyle = '#c0392b';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, SPIDEY_R);
  ctx.lineTo(0, SPIDEY_R + 14);
  ctx.stroke();

  // Blue trunks area
  ctx.strokeStyle = '#2980b9';
  ctx.beginPath();
  ctx.moveTo(0, SPIDEY_R + 8);
  ctx.lineTo(0, SPIDEY_R + 14);
  ctx.stroke();

  // Legs
  const legKick = Math.sin(t * 8) * 0.3;
  ctx.strokeStyle = '#2980b9';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, SPIDEY_R + 14);
  ctx.lineTo(-6, SPIDEY_R + 24 + Math.sin(legKick) * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, SPIDEY_R + 14);
  ctx.lineTo(6, SPIDEY_R + 24 - Math.sin(legKick) * 2);
  ctx.stroke();

  // Arms — one extended shooting web
  ctx.strokeStyle = '#c0392b';
  ctx.lineWidth = 2.5;
  // Left arm: relaxed
  ctx.beginPath();
  ctx.moveTo(-3, SPIDEY_R + 2);
  ctx.lineTo(-12, SPIDEY_R + 10 + Math.sin(t * 3) * 2);
  ctx.stroke();
  // Right arm: shooting pose
  ctx.beginPath();
  ctx.moveTo(3, SPIDEY_R + 2);
  ctx.lineTo(16, SPIDEY_R - 6);
  ctx.stroke();

  // Web-shooter hand — splayed fingers (the classic pose)
  const hx = 16, hy = SPIDEY_R - 6;
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + 5, hy - 4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + 6, hy - 1); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + 5, hy + 2); ctx.stroke();
  // Middle + ring fingers curled (classic Spidey hand)
  ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + 3, hy + 4); ctx.stroke();

  ctx.restore();
}

function drawWebLine(ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  const midX = (x1 + x2) / 2;
  const midY = Math.min(y1, y2) - 20;
  ctx.quadraticCurveTo(midX, midY, x2, y2);
  ctx.strokeStyle = 'rgba(220,220,220,0.5)';
  ctx.lineWidth = 1.2;
  ctx.setLineDash([4, 3]);
  ctx.stroke();
  ctx.setLineDash([]);
}

class SpiderCharacter {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.x = w * 0.7;
    this.y = h * 0.2;
    this.vx = 0;
    this.vy = 0;
    this.state = SP.SWINGING;
    this.stateTime = 0;
    this.nextActionTimer = 0;

    this.webAnchorX = w * 0.5;
    this.webAnchorY = 0;
    this.ropeLength = 200;
    this.swingAngle = 0.5;
    this.swingSpeed = 2;
    this.bodyAngle = 0;
  }

  setState(s) { this.state = s; this.stateTime = 0; }

  update(dt, w, h) {
    this.w = w;
    this.h = h;
    this.stateTime += dt;
    const m = SPIDEY_R + 5;

    switch (this.state) {
      case SP.SWINGING: {
        // Pendulum: θ'' = -(g/L)·sin(θ)
        const g = 300;
        const L = this.ropeLength;
        this.swingSpeed += (-g / L) * Math.sin(this.swingAngle) * dt;
        this.swingSpeed *= 0.997; // very light damping
        this.swingAngle += this.swingSpeed * dt;

        this.x = this.webAnchorX + Math.sin(this.swingAngle) * L;
        this.y = this.webAnchorY + Math.cos(this.swingAngle) * L;
        this.bodyAngle = this.swingAngle * 0.5;

        if (this.stateTime > 4 + Math.random() * 3) {
          // Release and fly
          this.vx = this.swingSpeed * L * Math.cos(this.swingAngle) * 0.015;
          this.vy = -2 + Math.random() * 1;
          this.setState(SP.FLYING);
          this.nextActionTimer = 1.5 + Math.random() * 2;
        }
        break;
      }
      case SP.FLYING: {
        // Projectile motion with air resistance
        this.vy += 80 * dt; // gravity
        this.vx *= 0.99;
        this.x += this.vx;
        this.y += this.vy * dt;
        this.bodyAngle = Math.atan2(this.vy, this.vx) * 0.3;

        // Bounce softly
        if (this.x < m) { this.x = m; this.vx = Math.abs(this.vx) * 0.5; }
        if (this.x > w - m) { this.x = w - m; this.vx = -Math.abs(this.vx) * 0.5; }
        if (this.y < m) { this.y = m; this.vy = Math.abs(this.vy) * 0.3; }
        if (this.y > h - m * 3) { this.y = h - m * 3; this.vy = 0; }

        this.nextActionTimer -= dt;
        if (this.nextActionTimer <= 0) {
          this.shootWeb(w, h);
        }
        break;
      }
      case SP.PERCHING: {
        // Hang still from web
        this.x += Math.sin(this.stateTime * 2) * 0.3;
        this.bodyAngle = Math.sin(this.stateTime * 1.5) * 0.1;

        if (this.stateTime > 2 + Math.random() * 2) {
          this.shootWeb(w, h);
        }
        break;
      }
      default: break;
    }

    this.x = Math.max(m, Math.min(w - m, this.x));
    this.y = Math.max(m, Math.min(h - m * 3, this.y));
  }

  shootWeb(w) {
    // Find a new anchor point ahead of current movement
    this.webAnchorX = Math.max(50, Math.min(w - 50,
      this.x + (Math.random() - 0.5) * 400
    ));
    this.webAnchorY = Math.max(0, this.y - 120 - Math.random() * 200);
    this.ropeLength = Math.hypot(this.x - this.webAnchorX, this.y - this.webAnchorY);
    this.ropeLength = Math.max(80, Math.min(300, this.ropeLength));
    this.swingAngle = Math.atan2(this.x - this.webAnchorX, this.y - this.webAnchorY);
    this.swingSpeed = (this.vx || 0) * 0.05 + (Math.random() - 0.5) * 2;
    this.setState(SP.SWINGING);
  }

  hitTest(mx, my) {
    return Math.hypot(mx - this.x, my - this.y) < SPIDEY_R + 20;
  }

  grab(mx, my) {
    this.state = SP.GRABBED;
    this.stateTime = 0;
    this.x = mx;
    this.y = my;
  }

  dragTo(mx, my) {
    this.x = mx;
    this.y = my;
  }

  release() {
    if (this.state === SP.GRABBED) {
      this.vx = (Math.random() - 0.5) * 3;
      this.vy = -2;
      this.setState(SP.FLYING);
      this.nextActionTimer = 1 + Math.random() * 2;
    }
  }

  vanish() {
    this.state = SP.VANISHING;
    this.stateTime = 0;
  }

  get isAlive() {
    return !(this.state === SP.VANISHING && this.stateTime > 1);
  }

  draw(ctx) {
    if (!this.isAlive) return;

    // Web line
    if (this.state === SP.SWINGING || this.state === SP.PERCHING) {
      drawWebLine(ctx, this.webAnchorX, this.webAnchorY, this.x, this.y - SPIDEY_R);
    }

    // Vanishing shrink
    if (this.state === SP.VANISHING) {
      const s = Math.max(0, 1 - this.stateTime * 1.5);
      if (s <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.scale(s, s);
      ctx.translate(-this.x, -this.y);
      drawSpideyFace(ctx, this.x, this.y, this.bodyAngle, this.stateTime);
      // Poof
      ctx.globalAlpha = Math.max(0, 1 - this.stateTime);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * TAU + this.stateTime * 4;
        const d = this.stateTime * 50;
        drawStar(ctx, this.x + Math.cos(a) * d, this.y + Math.sin(a) * d, 3, 4);
        ctx.fillStyle = '#c0392b';
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.restore();
      return;
    }

    // Grabbed — wiggling and scared text
    if (this.state === SP.GRABBED) {
      this.bodyAngle = Math.sin(this.stateTime * 18) * 0.25;
      drawSpideyFace(ctx, this.x, this.y, this.bodyAngle, this.stateTime);
      // Scared text
      ctx.save();
      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#ff4444';
      ctx.textAlign = 'center';
      const shakeX = Math.sin(this.stateTime * 25) * 2;
      ctx.fillText('NOOO!!', this.x + shakeX, this.y - SPIDEY_R - 12);
      ctx.restore();
      return;
    }

    drawSpideyFace(ctx, this.x, this.y, this.bodyAngle, this.stateTime);
  }
}

// ═══════════════════════════════════════════════════
// CAGE — hangs from top when dragging a character
// ═══════════════════════════════════════════════════

const CAGE_W = 70;
const CAGE_H = 80;
const CAGE_DROP_SPEED = 6; // px per frame for drop animation

function drawCage(ctx, cx, cy, openAmount, accent) {
  // Chain links from top
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 2;
  const chainTop = 0;
  const links = Math.floor((cy - 10) / 12);
  for (let i = 0; i < links; i++) {
    const ly = chainTop + i * 12;
    ctx.beginPath();
    drawEllipse(ctx, cx, ly + 6, 3, 5);
    ctx.strokeStyle = i % 2 === 0 ? '#999' : '#777';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  const left = cx - CAGE_W / 2;
  const right = cx + CAGE_W / 2;
  const top = cy;
  const bottom = cy + CAGE_H;

  // Cage bottom — flat bar
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(left, bottom);
  ctx.lineTo(right, bottom);
  ctx.stroke();

  // Vertical bars
  ctx.lineWidth = 2;
  const bars = 7;
  for (let i = 0; i <= bars; i++) {
    const bx = left + (i / bars) * CAGE_W;
    ctx.beginPath();
    ctx.moveTo(bx, top);
    ctx.lineTo(bx, bottom);
    ctx.strokeStyle = `rgba(${accent === '#f59e0b' ? '245,158,11' : '100,180,255'}, 0.6)`;
    ctx.stroke();
  }

  // Top bar
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(right, top);
  ctx.stroke();

  // Horizontal cross bars
  ctx.lineWidth = 1;
  ctx.strokeStyle = `rgba(${accent === '#f59e0b' ? '245,158,11' : '100,180,255'}, 0.35)`;
  for (let j = 1; j < 4; j++) {
    const by = top + (j / 4) * CAGE_H;
    ctx.beginPath();
    ctx.moveTo(left, by);
    ctx.lineTo(right, by);
    ctx.stroke();
  }

  // Glow effect
  ctx.shadowColor = accent;
  ctx.shadowBlur = 8;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1;
  ctx.strokeRect(left, top, CAGE_W, CAGE_H);
  ctx.shadowBlur = 0;
}

function isInsideCage(charX, charY, cageX, cageY) {
  const left = cageX - CAGE_W / 2;
  const right = cageX + CAGE_W / 2;
  const top = cageY;
  const bottom = cageY + CAGE_H;
  return charX > left && charX < right && charY > top && charY < bottom;
}

// ═══════════════════════════════════════════════════
// REACT COMPONENT — runs both characters + cage
// ═══════════════════════════════════════════════════

export default function SmileyBuddy() {
  const canvasRef = useRef(null);
  const smileyRef = useRef(null);
  const spideyRef = useRef(null);
  const frameRef = useRef(null);
  const lastTimeRef = useRef(Date.now());
  const dragRef = useRef(null); // { target: 'smiley'|'spidey' }
  const cageRef = useRef({ x: 0, y: -CAGE_H - 20, targetY: -CAGE_H - 20, visible: false });

  const getAccentColor = useCallback(() => {
    const style = getComputedStyle(document.documentElement);
    return style.getPropertyValue('--accent-primary').trim() || '#f59e0b';
  }, []);

  // Pointer coordinate helper (works for mouse + touch)
  const getPointerPos = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let running = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!smileyRef.current) {
        smileyRef.current = new SmileyCharacter(window.innerWidth, window.innerHeight);
      }
      if (!spideyRef.current) {
        spideyRef.current = new SpiderCharacter(window.innerWidth, window.innerHeight);
      }
      // Position cage at center-x
      cageRef.current.x = window.innerWidth / 2;
    };

    resize();
    window.addEventListener('resize', resize);

    // ── Pointer Events ──
    const onPointerDown = (e) => {
      const pos = getPointerPos(e);
      const smiley = smileyRef.current;
      const spidey = spideyRef.current;

      // Check if clicking on a character (smiley first, then spidey)
      if (smiley && smiley.isAlive && smiley.hitTest(pos.x, pos.y)) {
        dragRef.current = { target: 'smiley' };
        smiley.grab(pos.x, pos.y);
        canvas.classList.add('smiley-buddy--dragging');
        canvas.style.pointerEvents = 'auto';
        // Show cage — animate it dropping down
        cageRef.current.visible = true;
        cageRef.current.targetY = 20;
        e.preventDefault();
        return;
      }
      if (spidey && spidey.isAlive && spidey.hitTest(pos.x, pos.y)) {
        dragRef.current = { target: 'spidey' };
        spidey.grab(pos.x, pos.y);
        canvas.classList.add('smiley-buddy--dragging');
        canvas.style.pointerEvents = 'auto';
        cageRef.current.visible = true;
        cageRef.current.targetY = 20;
        e.preventDefault();
        return;
      }
    };

    const onPointerMove = (e) => {
      if (!dragRef.current) return;
      const pos = getPointerPos(e);
      const target = dragRef.current.target === 'smiley' ? smileyRef.current : spideyRef.current;
      if (target) target.dragTo(pos.x, pos.y);
      e.preventDefault();
    };

    const onPointerUp = (e) => {
      if (!dragRef.current) return;
      const target = dragRef.current.target === 'smiley' ? smileyRef.current : spideyRef.current;
      if (target) {
        // Check if dropped inside cage
        const cage = cageRef.current;
        if (isInsideCage(target.x, target.y, cage.x, cage.y)) {
          target.vanish();
        } else {
          target.release();
        }
      }
      dragRef.current = null;
      canvas.classList.remove('smiley-buddy--dragging');
      canvas.style.pointerEvents = '';
      // Retract cage
      cageRef.current.targetY = -CAGE_H - 20;
    };

    // Use pointer events for unified mouse+touch
    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Also listen for hits on the document (characters are under pointer-events:none canvas,
    // so we need to detect hover via the animation loop hit-testing)
    // Actually we use a different approach: we make canvas pointer-events:auto temporarily
    // by checking if mouse is near a character

    // Periodically check if cursor is near a character to enable pointer events
    let hoverCheckInterval;
    const checkHover = () => {
      // Only enable pointer-events when not already dragging
      if (dragRef.current) return;
    };
    hoverCheckInterval = setInterval(checkHover, 200);

    const animate = () => {
      if (!running) return;
      const now = Date.now();
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const accent = getAccentColor();

      ctx.clearRect(0, 0, w, h);

      // Update cage position (smooth drop/retract)
      const cage = cageRef.current;
      if (cage.visible || cage.y > -CAGE_H - 10) {
        const diff = cage.targetY - cage.y;
        cage.y += diff * 0.12;
        // Hide once fully retracted
        if (cage.targetY < 0 && cage.y < -CAGE_H - 15) {
          cage.visible = false;
        }
      }

      // Draw cage when visible
      if (cage.visible || cage.y > -CAGE_H) {
        drawCage(ctx, cage.x, cage.y, 0, accent);
      }

      if (smileyRef.current) {
        if (smileyRef.current.state !== SM.GRABBED) {
          smileyRef.current.update(dt, w, h);
        }
        smileyRef.current.draw(ctx, accent);
      }
      if (spideyRef.current) {
        if (spideyRef.current.state !== SP.GRABBED) {
          spideyRef.current.update(dt, w, h);
        }
        spideyRef.current.draw(ctx);
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frameRef.current);
      } else {
        lastTimeRef.current = Date.now();
        animate();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    animate();

    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
      clearInterval(hoverCheckInterval);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [getAccentColor, getPointerPos]);

  // Enable pointer events on the canvas when mouse is near a character
  const onMouseMovePassive = useCallback((e) => {
    if (dragRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const smiley = smileyRef.current;
    const spidey = spideyRef.current;
    const nearChar = (smiley && smiley.isAlive && smiley.hitTest(mx, my)) ||
                     (spidey && spidey.isAlive && spidey.hitTest(mx, my));
    canvas.style.pointerEvents = nearChar ? 'auto' : '';
    canvas.style.cursor = nearChar ? 'grab' : '';
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMovePassive, { passive: true });
    return () => document.removeEventListener('mousemove', onMouseMovePassive);
  }, [onMouseMovePassive]);

  return (
    <canvas ref={canvasRef} className="smiley-buddy" aria-hidden="true" />
  );
}
