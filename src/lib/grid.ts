import { clamp, hslToHex, type HSL } from "./color";

export const GRID = 8;
export const INITIAL_STEP = 100 / GRID; // 6.25
export const STEP_DECAY = 4;

export type Layer = {
  depth: number;
  center: HSL;
  stepS: number;
  stepL: number;
};

export function rootLayer(): Layer {
  return {
    depth: 0,
    center: { h: 0, s: 100, l: 50 },
    stepS: INITIAL_STEP,
    stepL: INITIAL_STEP,
  };
}

export function generateGrid(layer: Layer): HSL[][] {
  const rows: HSL[][] = [];
  if (layer.depth === 0) {
    for (let r = 0; r < GRID; r++) {
      const row: HSL[] = [];
      for (let c = 0; c < GRID; c++) {
        row.push({
          h: c * (360 / GRID),
          s: 100,
          l: 5 + r * (90 / (GRID - 1)),
        });
      }
      rows.push(row);
    }
    return rows;
  }
  const { center, stepS, stepL } = layer;
  for (let r = 0; r < GRID; r++) {
    const row: HSL[] = [];
    for (let c = 0; c < GRID; c++) {
      row.push({
        h: center.h,
        s: clamp(center.s + (c - (GRID - 1) / 2) * stepS, 0, 100),
        l: clamp(center.l + (r - (GRID - 1) / 2) * stepL, 0, 100),
      });
    }
    rows.push(row);
  }
  return rows;
}

export function computeNextLayer(parent: Layer, clicked: HSL): Layer {
  const factor = parent.depth === 0 ? 1 : 1 / STEP_DECAY;
  return {
    depth: parent.depth + 1,
    center: clicked,
    stepS: parent.stepS * factor,
    stepL: parent.stepL * factor,
  };
}

export function isTerminal(layer: Layer): boolean {
  const grid = generateGrid(layer);
  const first = hslToHex(grid[0][0]);
  for (const row of grid) {
    for (const c of row) {
      if (hslToHex(c) !== first) return false;
    }
  }
  return true;
}

export function centerColor(layer: Layer): HSL {
  if (layer.depth === 0) {
    return { h: 180, s: 100, l: 50 };
  }
  return layer.center;
}
