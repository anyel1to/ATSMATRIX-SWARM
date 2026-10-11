/**
 * spatialGrid.js
 *
 * Fixed-cell spatial hash using a head/next linked-list layout over
 * preallocated Int32Array buffers. Zero per-frame allocation:
 * rebuilding is a single fill() + O(n) insertion pass.
 *
 * This is the key to O(n) flocking: neighbor queries become
 * 3x3 cell lookups instead of O(n^2) pairwise scans.
 */
export class SpatialGrid {
  constructor(cellSize, maxAgents) {
    this.cellSize = cellSize;
    this.maxAgents = maxAgents;
    this.next = new Int32Array(maxAgents);
    this.cols = 1;
    this.rows = 1;
    this.cellHead = new Int32Array(1);
  }

  /** Recompute grid dimensions on canvas resize. */
  resize(width, height) {
    const cs = this.cellSize;
    this.cols = Math.max(1, Math.ceil(width / cs));
    this.rows = Math.max(1, Math.ceil(height / cs));
    const n = this.cols * this.rows;
    if (this.cellHead.length !== n) this.cellHead = new Int32Array(n);
  }

  /** Rebuild the hash in one pass. px/py are the SoA position arrays. */
  rebuild(n, px, py) {
    const { cols, rows, cellSize, cellHead, next } = this;
    cellHead.fill(-1);
    const inv = 1 / cellSize;
    for (let i = 0; i < n; i++) {
      let cx = (px[i] * inv) | 0;
      let cy = (py[i] * inv) | 0;
      if (cx < 0) cx = 0; else if (cx >= cols) cx = cols - 1;
      if (cy < 0) cy = 0; else if (cy >= rows) cy = rows - 1;
      const c = cy * cols + cx;
      next[i] = cellHead[c];
      cellHead[c] = i;
    }
  }
}
