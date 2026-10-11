/**
 * hud.js — DOM stats updater.
 * FPS uses an exponential moving average; DOM writes are throttled
 * to 4 Hz so text updates never contend with the render loop.
 */
export class HUD {
  constructor(root, system) {
    this.system = system;
    this.fpsEl = document.getElementById('fps');
    this.countEl = document.getElementById('count');
    this.statusEl = document.getElementById('status');
    this.modeEl = document.getElementById('mode');
    this.fps = 60;
    this.acc = 0;
    this.countDirty = true;
  }

  /** dt in seconds; returns nothing. */
  tick(dt) {
    if (dt > 0) this.fps += (1 / dt - this.fps) * 0.08;   // EMA
    this.acc += dt;
    if (this.acc < 0.25) return;
    this.acc = 0;
    this.fpsEl.textContent = Math.round(this.fps);
    if (this.countDirty) {
      this.countEl.textContent = this.system.n;
      this.countDirty = false;
    }
  }

  setAgents() { this.countDirty = true; }
  setStatus(running) {
    this.statusEl.textContent = running ? 'RUNNING' : 'PAUSED';
    this.statusEl.classList.toggle('ok', running);
  }
  setMode(attract) {
    this.modeEl.textContent = attract ? 'ATTRACT' : 'REPEL';
  }
}
