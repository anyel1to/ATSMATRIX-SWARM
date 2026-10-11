# ◈ ATSMATRIX // SWARM

## High-Performance Multi-Agent Flocking Engine

**Real-time visualization of emergent collective behavior.**  
Zero-dependency Canvas engine. Structure-of-Arrays core. Spatial-hash neighbor search.  
Designed for clarity, performance, and professional demonstration.

![Overview](screenshot-overview.jpg)

---

## Overview

ATSMATRIX // SWARM is a production-grade multi-agent simulation that models classical boids flocking (separation, alignment, cohesion) at interactive frame rates.  

It is built as a single-page, zero-dependency application using modern JavaScript modules, typed-array state, and a carefully tuned Canvas 2D rendering pipeline. The system is intentionally transparent: every major component is isolated, measurable, and free of external frameworks.

The engine is intended for:
- Real-time visualization of multi-agent systems
- Performance engineering demonstrations
- Educational and research contexts involving emergent behavior
- Integration into larger ATSMATRIX visualization suites

---

## Live Demonstration

**https://anyel1to.github.io/ATSMATRIX-SWARM/**

The live deployment runs entirely in the browser. No server-side computation is required.

---

## Core Capabilities

- **Classical flocking rules**  
  Separation (inverse-distance weighted), alignment to local mean velocity, and cohesion toward local center of mass. All forces are clamped and weighted independently.

- **Spatial hashing**  
  Fixed-cell grid with preallocated head/next linked lists. Neighbor queries are restricted to a 3×3 cell neighborhood and further capped per agent, converting an \(O(n^2)\) problem into approximately \(O(n)\).

- **Structure-of-Arrays state**  
  Position and velocity are stored in contiguous `Float32Array` buffers. The hot loop performs only index arithmetic and produces zero per-frame allocations.

- **Pointer force field**  
  Attract or repel mode with radial falloff. The interaction is rendered as a soft radial indicator and applied as an additional steering force.

- **Performance pipeline**  
  Device pixel ratio is capped, trail fading is performed with a single translucent composite, the color palette is precomputed, and DOM updates are throttled. The Canvas context is created with `alpha: false`.

- **Toroidal world**  
  Agents wrap at the boundaries, producing continuous flow without edge accumulation.

---

## Visual Results

![Force Field Interaction](screenshot-forcefield.jpg)
*Pointer force field interacting with the flock. Speed is mapped to the cyan–violet palette.*

![Wide View](screenshot-wide.jpg)
*Emergent flow patterns at higher density. Trails and spatial coherence remain stable.*

---

## Controls

| Input | Action |
|-------|--------|
| **Space** | Pause / Resume |
| **M** | Toggle Attract / Repel |
| **T** | Toggle motion trails |
| **R** | Reset swarm to default population |
| **1 / 2 / 3** | Set population (300 / 500 / 800) |
| **Pointer** | Apply force field |
| **HUD buttons** | Equivalent to keyboard controls |

---

## Architecture

```
index.html                 Shell and HUD markup
css/style.css              Design tokens and layout
js/config.js               Central parameter set
js/spatialGrid.js          Zero-allocation spatial hash
js/flocking.js             SoA boids core and integration
js/renderer.js             Canvas pipeline, palette, trails
js/hud.js                  Throttled DOM statistics
js/main.js                 Input handling and animation loop
server.js                  Minimal static development server
package.json
LICENSE
```

### Design Decisions

1. **Canvas 2D over WebGL**  
   At the target agent counts, fill rate dominates. A single-pass Canvas pipeline with a capped device pixel ratio and translucent trail composite delivers high frame rates with substantially less code and no shader complexity.

2. **Structure-of-Arrays**  
   Contiguous typed memory improves cache behavior and eliminates garbage collection pressure inside the simulation loop.

3. **Head/next spatial hash**  
   The grid is rebuilt each frame with a single `fill(-1)` and an \(O(n)\) insertion pass. Neighbor traversal is pure array chasing.

4. **Neighbor cap**  
   Each agent examines at most a fixed number of neighbors. This provides a hard performance ceiling and stabilizes flocking behavior in dense regions.

5. **Clamped timestep**  
   The integration step is limited so that tab switches or brief stalls cannot produce unstable trajectories.

---

## Performance Characteristics

The engine is engineered so that the dominant costs remain predictable:

- Spatial hash rebuild and neighbor search scale approximately linearly.
- Rendering cost is dominated by fill rate (one triangle per agent plus one full-screen trail composite).
- No per-frame object allocation occurs in the simulation or rendering hot paths.
- HUD updates are limited to a few times per second.

Typical observed behavior on mid-range hardware is sustained high frame rates at the default and medium population presets. Higher counts remain interactive; the neighbor cap and spatial structure prevent quadratic degradation.

---

## Local Execution

```bash
git clone https://github.com/anyel1to/ATSMATRIX-SWARM.git
cd ATSMATRIX-SWARM
npm start
```

The development server listens on port 3000. Any static file server may be used instead; no build step is required.

---

## License

MIT License. Copyright © 2026 ATSMATRIX Technologies.

See the `LICENSE` file for the full text.

---

## About ATSMATRIX

ATSMATRIX builds real-time multi-agent systems, visualization engines, and operational dashboards.  

SWARM is part of the broader ATSMATRIX visualization suite, which also includes:

- [ATSMATRIX-NEXUS](https://github.com/anyel1to/ATSMATRIX-NEXUS)
- [ATSMATRIX-AGENT-GRAPH](https://github.com/anyel1to/ATSMATRIX-AGENT-GRAPH)
- [atsmatrix-agent-visualizeR](https://github.com/anyel1to/atsmatrix-agent-visualizeR--ANYEL1TO)

For inquiries: [atsmatrix.com](https://atsmatrix.com)
