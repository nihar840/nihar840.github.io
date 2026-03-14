/**
 * Generates SVG path data for a gear shape.
 * @param {number} cx - center X
 * @param {number} cy - center Y
 * @param {number} outerR - outer radius (tip of teeth)
 * @param {number} innerR - inner radius (base of teeth)
 * @param {number} holeR - center hole radius
 * @param {number} teeth - number of teeth
 * @returns {string} SVG path d attribute
 */
export function generateGearPath(cx, cy, outerR, innerR, holeR, teeth) {
  const step = (Math.PI * 2) / teeth;
  const toothWidth = step * 0.35;
  let d = '';

  for (let i = 0; i < teeth; i++) {
    const angle = i * step;
    // Inner start
    const a1 = angle - toothWidth;
    // Outer start
    const a2 = angle - toothWidth * 0.6;
    // Outer end
    const a3 = angle + toothWidth * 0.6;
    // Inner end
    const a4 = angle + toothWidth;

    const p1 = { x: cx + Math.cos(a1) * innerR, y: cy + Math.sin(a1) * innerR };
    const p2 = { x: cx + Math.cos(a2) * outerR, y: cy + Math.sin(a2) * outerR };
    const p3 = { x: cx + Math.cos(a3) * outerR, y: cy + Math.sin(a3) * outerR };
    const p4 = { x: cx + Math.cos(a4) * innerR, y: cy + Math.sin(a4) * innerR };

    if (i === 0) {
      d += `M ${p1.x} ${p1.y} `;
    }
    d += `L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} L ${p4.x} ${p4.y} `;

    // Arc along inner radius to next tooth
    const nextAngle = (i + 1) * step - toothWidth;
    const p5 = { x: cx + Math.cos(nextAngle) * innerR, y: cy + Math.sin(nextAngle) * innerR };
    d += `A ${innerR} ${innerR} 0 0 1 ${p5.x} ${p5.y} `;
  }

  d += 'Z';

  // Center hole (counter-clockwise)
  if (holeR > 0) {
    d += ` M ${cx + holeR} ${cy}`;
    d += ` A ${holeR} ${holeR} 0 1 0 ${cx - holeR} ${cy}`;
    d += ` A ${holeR} ${holeR} 0 1 0 ${cx + holeR} ${cy}`;
    d += ' Z';
  }

  return d;
}
