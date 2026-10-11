/**
 * renderer.js
 *
 * Canvas 2D pipeline tuned for fill-rate:
 *  - devicePixelRatio capped (CONFIG.DPR_CAP) — big cost on 2x/3x displays
 *  - trail fade via translucent full-screen rect (cheap, GPU-composited)
 *  - agents drawn as oriented triangles, one fill() each
 *  - color mapped from velocity onto a precomputed HSL palette
 *    (zero string allocation in the hot loop)
 */
export class Renderer {
  constructor(canvas, cfg) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.cfg = cfg;
    this.trails = true;
    this.palette = this.buildPalette();
    this.resize();
  }

  /** Cyan → blue → violet gradient ramp (precomputed strings). */
  buildPalette() {
    const out = [];
    const n = this.cfg.PALETTE_SIZE;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const hue = 188 + t * 78;   // 188 (cyan) → 266 (violet)
      const light = 58 + t * 8;   // slightly brighter when fast
      out.push(`hsl(${hue.toFixed(0)}, 90%, ${light.toFixed(0)}%)`);
    }
    return out;
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, this.cfg.DPR_CAP);
    const w = window.innerWidth, h = window.innerHeight;
    this.canvas.width = (w * dpr) | 0;
    this.canvas.height = (h * dpr) | 0;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = w; this.h = h;
    this.paintBackground(1);
  }

  paintBackground(alpha) {
    const ctx = this.ctx;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#070a10';
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.globalAlpha = 1;
  }

  render(system, mouse) {
    const { ctx, w, h } = this;

    // Trail fade (or hard clear)
    if (this.trails) this.paintBackground(this.cfg.TRAIL_ALPHA);
    else this.paintBackground(1);

    // Pointer field indicator
    if (mouse.active) {
      const r = this.cfg.MOUSE_RADIUS;
      const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, r);
      const c = mouse.attract ? '139,92,246' : '34,211,238';
      g.addColorStop(0, `rgba(${c}, 0.10)`);
      g.addColorStop(1, `rgba(${c}, 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, r, 0, 6.2832);
      ctx.fill();
    }

    // Agents: oriented triangles, color = speed on palette
    const n = system.n;
    const px = system.px, py = system.py, vx = system.vx, vy = system.vy;
    const pal = this.palette, palN = pal.length;
    const minS = this.cfg.MIN_SPEED, span = this.cfg.MAX_SPEED - minS;
    const s = 5.5, sB = s * 0.62, hw = s * 0.55;

    for (let i = 0; i < n; i++) {
      const x = px[i], y = py[i];
      const inv = 1 / Math.sqrt(vx[i] * vx[i] + vy[i] * vy[i] + 1e-6);
      const c = vx[i] * inv, sn = vy[i] * inv;

      let t = (Math.sqrt(vx[i] * vx[i] + vy[i] * vy[i]) - minS) / span;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      ctx.fillStyle = pal[(t * (palN - 1)) | 0];

      ctx.beginPath();
      ctx.moveTo(x + c * s, y + sn * s);
      ctx.lineTo(x - c * sB - sn * hw, y - sn * sB + c * hw);
      ctx.lineTo(x - c * sB + sn * hw, y - sn * sB - c * hw);
      ctx.closePath();
      ctx.fill();
    }
  }
}
