# ◈ ATSMATRIX // SWARM — High-Performance Multi-Agent Flocking Engine

> Agents form. Forces emerge. Intelligence moves.
>
> **ATSMATRIX // SWARM** is a zero-dependency, high-FPS multi-agent flocking simulation built for real-time visualization of emergent swarm behavior.

Watch 300–800+ autonomous agents form dynamic flocks, respond to pointer forces, and maintain smooth 60–120 FPS — pure Canvas, ES modules, no build step, no npm packages.

---

## 🌐 Live Demo

👉 **https://anyel1to.github.io/ATSMATRIX-SWARM/**

Open `index.html` locally (or run `npm start`) for offline use.

---

## ✨ Features

- **Boids core** — Separation, alignment, and cohesion with inverse-distance weighting, speed clamping, and organic noise
- **O(n) neighbor search** — Fixed-cell spatial hash on preallocated `Int32Array` head/next buffers; zero per-frame allocation
- **Pointer force field** — Repel or attract any flock with the cursor
- **Performance pipeline** — SoA `Float32Array` state, DPR cap, trail fade via translucent composite, precomputed HSL palette, throttled DOM HUD
- **Clean dark UI** — Minimal HUD with live FPS, agent count, status, population presets (300 / 500 / 800), pause, trails toggle
- **Keyboard control** — `Space` pause · `M` mode · `T` trails · `R` reset · `1/2/3` population
- **Toroidal world** — Seamless wrap-around flow, no edge pile-up

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

## 🏗️ Project Structure

```
├── index.html          # markup + HUD shell
├── css/style.css       # dark theme design tokens
├── js/
│   ├── config.js       # all tunable parameters
│   ├── spatialGrid.js  # zero-alloc spatial hashing
│   ├── flocking.js     # SoA boids core (typed arrays)
│   ├── renderer.js     # Canvas 2D pipeline, trails, palette
│   ├── hud.js          # throttled DOM stats
│   └── main.js         # entry point, input, RAF loop
├── server.js           # tiny static dev server
└── package.json
```

---

## 💾 How to Run

```bash
# Option 1 — built-in zero-dependency server
npm start            # → http://localhost:3000

# Option 2 — any static server
npx serve .          # or: python3 -m http.server 8000
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
