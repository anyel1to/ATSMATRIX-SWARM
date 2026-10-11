# ◈ ATSMATRIX // SWARM — High-Performance Multi-Agent Flocking Engine

> Agents form. Forces emerge. Intelligence moves.
>
> **ATSMATRIX // SWARM** is a zero-dependency, high-FPS multi-agent flocking simulation built for real-time visualization of emergent swarm behavior.

Watch 500–1500+ autonomous agents form dynamic flocks, respond to pointer forces, and maintain smooth 60–120 FPS on modern hardware — pure Canvas, no frameworks, no build step.

---

## 🌐 Live Demo

👉 **https://anyel1to.github.io/ATSMATRIX-SWARM/**

Open `index.html` locally for offline use.

---

## ✨ Features

- **High-performance engine** — Structure-of-Arrays + spatial grid hash. Zero per-frame allocations in the hot path.
- **Classic flocking** — Separation, alignment, and cohesion with tunable weights.
- **Pointer force field** — Attract or repel the swarm with your mouse.
- **Speed-based coloring** — Agents shift hue based on velocity.
- **Trails** — Configurable motion trails with alpha fade.
- **Live HUD** — FPS, agent count, status, and mode.
- **Keyboard + UI controls** — Instant switching between 500 / 1000 / 1500 agents.

---

## 🎮 Controls

| Key / Action          | Function              |
|-----------------------|-----------------------|
| **Space**             | Pause / Resume        |
| **M**                 | Toggle Attract / Repel|
| **T**                 | Toggle Trails         |
| **R**                 | Reset swarm           |
| **1 / 2 / 3**         | Set agent count       |
| **Mouse / Pointer**   | Force field           |
| **HUD buttons**       | Same controls         |

---

## 🏗️ Architecture

- **Spatial Grid** — Fixed-cell hash with linked lists for O(1) neighbor lookup.
- **SoA layout** — Separate typed arrays for position and velocity.
- **Semi-implicit Euler** — Stable integration with speed clamping.
- **Canvas 2D** — Optimized rendering path, DPR capped for consistency.
- **Single file** — Everything inlined for zero-dependency deployment.

---

## 💾 Local Setup

```bash
git clone https://github.com/anyel1to/ATSMATRIX-SWARM.git
cd ATSMATRIX-SWARM
# Open in any modern browser
open index.html
```

No build tools. No dependencies. Pure frontend.

---

## 📜 License & Credits

**MIT License** © 2026 ATSMATRIX Technologies

Built by **ANYELO · ATSMATRIX**

Part of the ATSMATRIX agent visualization suite alongside:

- [ATSMATRIX-NEXUS](https://github.com/anyel1to/ATSMATRIX-NEXUS)
- [ATSMATRIX-AGENT-GRAPH](https://github.com/anyel1to/ATSMATRIX-AGENT-GRAPH)
- [atsmatrix-agent-visualizeR](https://github.com/anyel1to/atsmatrix-agent-visualizeR--ANYEL1TO)

📧 DM for inquiries · [atsmatrix.com](https://atsmatrix.com)

---

## Screenshots

The live demo shows the full high-FPS swarm with force fields and trails.

Open the live link above or run `index.html` locally to see it in action.
