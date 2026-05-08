import { colornames } from "color-name-list/bestof";

type Entry = { name: string; rgb: [number, number, number] };

const entries: Entry[] = (colornames as { name: string; hex: string }[]).map(
  (c) => {
    const n = parseInt(c.hex.slice(1), 16);
    return {
      name: c.name,
      rgb: [(n >> 16) & 255, (n >> 8) & 255, n & 255],
    };
  },
);

const cache = new Map<string, string>();

export function nearestColorName(hex: string): string {
  const key = hex.toUpperCase();
  const cached = cache.get(key);
  if (cached !== undefined) return cached;

  const n = parseInt(key.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;

  let bestName = "";
  let bestDist = Infinity;
  for (const e of entries) {
    const dr = e.rgb[0] - r;
    const dg = e.rgb[1] - g;
    const db = e.rgb[2] - b;
    const d = dr * dr + dg * dg + db * db;
    if (d < bestDist) {
      bestDist = d;
      bestName = e.name;
      if (d === 0) break;
    }
  }

  cache.set(key, bestName);
  return bestName;
}
