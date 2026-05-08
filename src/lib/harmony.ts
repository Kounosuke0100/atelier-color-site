import { clamp, type HSL } from "./color";

export type HarmonyId =
  | "complementary"
  | "analogous"
  | "triadic"
  | "split"
  | "tetradic"
  | "square"
  | "monochromatic";

export type HarmonySwatch = { hsl: HSL; role: "base" | "derived" };

export const HARMONY_ORDER: { id: HarmonyId; label: string }[] = [
  { id: "complementary", label: "Complementary" },
  { id: "analogous", label: "Analogous" },
  { id: "triadic", label: "Triadic" },
  { id: "split", label: "Split" },
  { id: "tetradic", label: "Tetradic" },
  { id: "square", label: "Square" },
  { id: "monochromatic", label: "Monochromatic" },
];

const normHue = (h: number) => ((h % 360) + 360) % 360;

const shift = (base: HSL, offsets: number[]): HarmonySwatch[] => [
  { hsl: base, role: "base" },
  ...offsets.map<HarmonySwatch>((d) => ({
    hsl: { h: normHue(base.h + d), s: base.s, l: base.l },
    role: "derived",
  })),
];

function monochromatic(base: HSL): HarmonySwatch[] {
  const min = Math.max(8, base.l - 30);
  const max = Math.min(92, base.l + 30);
  const steps = 5;
  const lights = Array.from({ length: steps }, (_, i) =>
    clamp(min + ((max - min) * i) / (steps - 1), 0, 100),
  );
  return lights.map<HarmonySwatch>((l) => ({
    hsl: { h: base.h, s: base.s, l },
    role: Math.abs(l - base.l) < 0.5 ? "base" : "derived",
  }));
}

export function getHarmony(base: HSL, id: HarmonyId): HarmonySwatch[] {
  switch (id) {
    case "complementary":
      return shift(base, [180]);
    case "analogous":
      return [
        { hsl: { h: normHue(base.h - 30), s: base.s, l: base.l }, role: "derived" },
        { hsl: base, role: "base" },
        { hsl: { h: normHue(base.h + 30), s: base.s, l: base.l }, role: "derived" },
      ];
    case "triadic":
      return shift(base, [120, 240]);
    case "split":
      return shift(base, [150, 210]);
    case "tetradic":
      return shift(base, [60, 180, 240]);
    case "square":
      return shift(base, [90, 180, 270]);
    case "monochromatic":
      return monochromatic(base);
  }
}
