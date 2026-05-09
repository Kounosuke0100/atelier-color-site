import { useEffect, useState } from "react";
import type { HSL } from "../lib/color";

export type ThemeMode = "auto" | "light" | "dark" | "gray";
export type ResolvedTheme = "light" | "dark" | "gray";

const STORAGE_KEY = "atelier-color-theme";

function autoFromColor(color: HSL): ResolvedTheme {
  if (color.l >= 70) return "light";
  if (color.l <= 30) return "dark";
  return "gray";
}

export function useTheme(currentColor: HSL) {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === "auto" || raw === "light" || raw === "dark" || raw === "gray") {
        setMode(raw);
      }
    } catch {
      // ignore
    }
  }, []);
  const resolved: ResolvedTheme =
    mode === "auto" ? autoFromColor(currentColor) : mode;

  useEffect(() => {
    document.documentElement.dataset.theme = resolved;
  }, [resolved]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  }, [mode]);

  return { mode, setMode, resolved };
}
