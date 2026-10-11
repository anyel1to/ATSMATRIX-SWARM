/**
 * flocking.js
 *
 * Core boids simulation using Structure-of-Arrays (SoA) layout with
 * Float32Array buffers. No per-agent objects, no per-frame allocations.
 *
 * Per-agent rule set:
 *   1. Separation — inverse-distance push away from close neighbors
 *   2. Alignment  — steer toward local mean heading
 *   3. Cohesion   — steer toward local center of mass
 *   4. Pointer    — attract or repel force field (UI-controlled)
 *   5. Noise      — small jitter for organic, non-mechanical motion
 *
 * World is toroidal (wrap-around) so flocks flow continuously.
 */
import { SpatialGrid } from './spatialGrid.js';

export class FlockingSystem {
  constructor(cfg) {
    this.cfg = cfg;
    this.n = 0;
    this.width = 800;
    this.height = 600;

    // SoA buffers (grow once to MAX_AGENTS, never reallocated)
    const max = cfg.MAX_AGENTS;
    this.px = new Float32Array(max);
    this.py = new Float32Array(max);
    this.vx = new Float32Array(max);
    this.vy = new Float32Array(max);

    this.grid = new SpatialGrid(cfg.PERCEPTION, max);
  }

  setCount(n) {
    n = Math.min(n, this.cfg.MAX_AGENTS);
    for (let i = this.n; i < n; i++) this.seed(i);
    this.n = n;
  }

  reset(n) { this.n = 0; this.setCount(n); }

  /** Spawn one agent with random position/heading at safe speed. */
  seed(i) {
    const w = this.width, h = this.height;
    this.px[i] = Math.random() * w;
    this.py[i] = Math.random() * h;
    const a = Math.random() * Math.PI * 2;
    const s = this.cfg.MIN_SPEED + Math.random() * (this.cfg.MAX_SPEED - this.cfg.MIN_SPEED);
    this.vx[i] = Math.cos(a) * s;
    this.vy[i] = Math.sin(a) * s;
  }

  resize(w, h) {
    this.width = w;
    this.height = h;
    this.grid.resize(w, h);
  }

  /**
   * Advance the simulation by dt seconds.
   * mouse: { x, y, active, attract }
   */
  update(dt, mouse) {
    const { n, px, py, vx, vy, cfg, grid } = this;
    if (n === 0) return;

    // ---- Phase 1: rebuild spatial hash (O(n), zero alloc) ----
    grid.rebuild(n, px, py);

    const perc2 = cfg.PERCEPTION * cfg.PERCEPTION;
    const maxSpeed = cfg.MAX_SPEED;
    const maxForce = cfg.MAX_FORCE;
    const wSep = cfg.W_SEPARATION, wAli = cfg.W_ALIGNMENT, wCoh = cfg.W_COHESION;
    const maxN = cfg.MAX_NEIGHBORS;
    const noise = cfg.NOISE;
    const mR2 = cfg.MOUSE_RADIUS * cfg.MOUSE_RADIUS;
    const mForce = (mouse.attract ? 1 : -1) * cfg.MOUSE_FORCE;

    const { cols, rows, cellHead, next } = grid;
    const w = this.width, h = this.height;

    // ---- Phase 2: forces + integration (single pass, in place) ----
    for (let i = 0; i < n; i++) {
      const x = px[i], y = py[i];
      const cx = Math.min(cols - 1, Math.max(0, (x / grid.cellSize) | 0));
      const cy = Math.min(rows - 1, Math.max(0, (y / grid.cellSize) | 0));

      let sepX = 0, sepY = 0, aliX = 0, aliY = 0, cohX = 0, cohY = 0, count = 0;

      // 3x3 cell neighborhood scan
      const x0 = cx > 0 ? cx - 1 : 0, x1 = cx < cols - 1 ? cx + 1 : cols - 1;
      const y0 = cy > 0 ? cy - 1 : 0, y1 = cy < rows - 1 ? cy + 1 : rows - 1;
      outer:
      for (let gy = y0; gy <= y1; gy++) {
        for (let gx = x0; gx <= x1; gx++) {
          for (let j = cellHead[gy * cols + gx]; j !== -1; j = next[j]) {
            if (j === i) continue;
            const dx = px[j] - x, dy = py[j] - y;
            const d2 = dx * dx + dy * dy;
            if (d2 > perc2 || d2 < 1e-6) continue;
            const inv = 1 / Math.sqrt(d2);
            sepX -= dx * inv * inv;      // inverse-distance weight
            sepY -= dy * inv * inv;
            aliX += vx[j]; aliY += vy[j];
            cohX += dx;   cohY += dy;
            if (++count >= maxN) break outer;
          }
        }
      }

      let fx = 0, fy = 0;
      if (count > 0) {
        // Each rule: desired velocity − current velocity, capped at MAX_FORCE.
        let m, dx, dy, s;

        // Separation (fixed force clamp)
        m = Math.sqrt(sepX * sepX + sepY * sepY);
        if (m > 1e-6) {
          dx = sepX / m * maxSpeed - vx[i];
          dy = sepY / m * maxSpeed - vy[i];
          s = Math.sqrt(dx * dx + dy * dy);
          if (s > maxForce) { s = maxForce / s; } else s = 1;
          fx += dx * s * wSep; fy += dy * s * wSep;
        }
        // Alignment (mean neighbor velocity)
        dx = aliX / count; dy = aliY / count;
        m = Math.sqrt(dx * dx + dy * dy);
        if (m > 1e-6) {
          dx = dx / m * maxSpeed - vx[i]; dy = dy / m * maxSpeed - vy[i];
          s = Math.sqrt(dx * dx + dy * dy);
          if (s > maxForce) { s = maxForce / s; } else s = 1;
          fx += dx * s * wAli; fy += dy * s * wAli;
        }
        // Cohesion (mean offset toward center of mass)
        dx = cohX / count; dy = cohY / count;
        m = Math.sqrt(dx * dx + dy * dy);
        if (m > 1e-6) {
          dx = dx / m * maxSpeed - vx[i]; dy = dy / m * maxSpeed - vy[i];
          s = Math.sqrt(dx * dx + dy * dy);
          if (s > maxForce) { s = maxForce / s; } else s = 1;
          fx += dx * s * wCoh; fy += dy * s * wCoh;
        }
      }

      // Pointer force field (inverse-falloff within radius)
      if (mouse.active) {
        const dx = mouse.x - x, dy = mouse.y - y;
        const d2 = dx * dx + dy * dy;
        if (d2 < mR2 && d2 > 1e-4) {
          const d = Math.sqrt(d2);
          const f = mForce * (1 - d / cfg.MOUSE_RADIUS) / d;
          fx += dx * f; fy += dy * f;
        }
      }

      // Organic jitter
      fx += (Math.random() - 0.5) * noise;
      fy += (Math.random() - 0.5) * noise;

      // ---- Integrate (semi-implicit Euler) ----
      let nvx = vx[i] + fx * dt;
      let nvy = vy[i] + fy * dt;
      const sp2 = nvx * nvx + nvy * nvy;
      if (sp2 > maxSpeed * maxSpeed) {
        const k = maxSpeed / Math.sqrt(sp2); nvx *= k; nvy *= k;
      } else if (sp2 > 1e-6 && sp2 < cfg.MIN_SPEED * cfg.MIN_SPEED) {
        const k = cfg.MIN_SPEED / Math.sqrt(sp2); nvx *= k; nvy *= k;
      }
      vx[i] = nvx; vy[i] = nvy;

      let nx = x + nvx * dt, ny = y + nvy * dt;
      // Toroidal wrap
      if (nx < 0) nx += w; else if (nx >= w) nx -= w;
      if (ny < 0) ny += h; else if (ny >= h) ny -= h;
      px[i] = nx; py[i] = ny;
    }
  }
}
