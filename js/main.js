/**
 * main.js — entry point.
 * Wires input, resize, and the requestAnimationFrame loop with a
 * clamped real-time delta (no fixed-step accumulator needed for
 * a continuous 60 Hz+ simulation).
 */
import { CONFIG } from './config.js';
import { FlockingSystem } from './flocking.js';
import { Renderer } from './renderer.js';
import { HUD } from './hud.js';

const canvas = document.getElementById('view');

const system = new FlockingSystem(CONFIG);
const renderer = new Renderer(canvas, CONFIG);
const hud = new HUD(document.getElementById('hud'), system);

// ---- Application state ----
const mouse = { x: 0, y: 0, active: false, attract: false };
let paused = false;

function syncSize() {
  renderer.resize();
  system.resize(renderer.w, renderer.h);
  renderer.paintBackground(1);
}
syncSize();
system.setCount(CONFIG.DEFAULT_COUNT);
window.addEventListener('resize', syncSize);

// ---- Pointer input ----
window.addEventListener('pointermove', (e) => {
  mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
});
window.addEventListener('pointerdown', (e) => {
  if (e.target.closest('#hud')) return;       // ignore clicks on UI
  mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
});
window.addEventListener('pointerleave', () => { mouse.active = false; });
document.addEventListener('mouseleave', () => { mouse.active = false; });

// ---- Controls ----
const countButtons = [...document.querySelectorAll('[data-count]')];

function setCount(n) {
  system.setCount(n);
  hud.setAgents();
  countButtons.forEach((b) => b.classList.toggle('active', +b.dataset.count === n));
}

countButtons.forEach((b) =>
  b.addEventListener('click', () => setCount(+b.dataset.count))
);

const btnPause = document.getElementById('btn-pause');
const btnMode = document.getElementById('btn-mode');
const btnTrails = document.getElementById('btn-trails');

function togglePause() {
  paused = !paused;
  btnPause.textContent = paused ? 'RESUME' : 'PAUSE';
  btnPause.classList.toggle('active', paused);
  hud.setStatus(!paused);
}

function toggleMode() {
  mouse.attract = !mouse.attract;
  btnMode.textContent = mouse.attract ? 'ATTRACT' : 'REPEL';
  btnMode.classList.toggle('active', mouse.attract);
  hud.setMode(mouse.attract);
}

function toggleTrails() {
  renderer.trails = !renderer.trails;
  btnTrails.classList.toggle('active', renderer.trails);
}

btnPause.addEventListener('click', togglePause);
btnMode.addEventListener('click', toggleMode);
btnTrails.addEventListener('click', toggleTrails);

// ---- Keyboard shortcuts ----
window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case ' ': e.preventDefault(); togglePause(); break;
    case 'm': case 'M': toggleMode(); break;
    case 't': case 'T': toggleTrails(); break;
    case 'r': case 'R': system.reset(CONFIG.DEFAULT_COUNT); setCount(CONFIG.DEFAULT_COUNT); break;
    case '1': setCount(300); break;
    case '2': setCount(500); break;
    case '3': setCount(800); break;
  }
});

// ---- Main loop ----
let last = performance.now();

function frame(now) {
  // Clamp dt: tab-switch / hiccups can't produce integration explosions.
  const dt = Math.min((now - last) / 1000, 1 / 30);
  last = now;

  if (!paused) system.update(dt, mouse);
  renderer.render(system, mouse);
  hud.tick(paused ? 0 : dt);

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
