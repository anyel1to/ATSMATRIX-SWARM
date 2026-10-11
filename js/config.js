/**
 * config.js — central tuning parameters.
 * All spatial units are CSS pixels, forces are px/s^2.
 */
export const CONFIG = {
  // Population
  DEFAULT_COUNT: 500,
  MAX_AGENTS: 1200,

  // Flocking radii / dynamics
  PERCEPTION: 50,        // neighbor sensing radius (px)
  MAX_NEIGHBORS: 14,     // cap neighbors per agent (stability + perf)
  MAX_SPEED: 185,        // px/s
  MIN_SPEED: 50,         // px/s — keeps agents alive, no stalling
  MAX_FORCE: 450,        // steering acceleration cap (px/s^2)

  // Behavior weights
  W_SEPARATION: 1.70,
  W_ALIGNMENT: 1.05,
  W_COHESION: 0.80,
  NOISE: 28,             // small random jitter (px/s^2) for organic motion

  // Pointer force field
  MOUSE_RADIUS: 160,
  MOUSE_FORCE: 1000,

  // Rendering
  TRAIL_ALPHA: 0.25,     // lower = longer trails
  PALETTE_SIZE: 72,
  DPR_CAP: 1.5,          // cap devicePixelRatio for fill-rate headroom
};
