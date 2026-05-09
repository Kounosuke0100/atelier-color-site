import { useEffect, useState } from "react";
import type { HSL } from "../lib/color";

export type ThemeMode = "auto" | "light" | "dark" | "gray";
export type ResolvedTheme = "light" | "dark" | "gray";

const STORAGE_KEY = "atelier-color-theme";

function isThemeMode(raw: string | null): raw is ThemeMode {
  return raw === "auto" || raw === "light" || raw === "dark" || raw === "gray";
}

function autoFromColor(color: HSL): ResolvedTheme {
  if (color.l >= 70) return "light";
  if (color.l <= 30) return "dark";
  return "gray";
}

export function useTheme(currentColor: HSL) {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [isLoaded, setIsLoaded] = useState(false);
  const resolved: ResolvedTheme =
    mode === "auto" ? autoFromColor(currentColor) : mode;

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!cancelled && isThemeMode(raw)) {
          setMode(raw);
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) {
          setIsLoaded(true);
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = resolved;
  }, [resolved]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  }, [isLoaded, mode]);

  return { mode, setMode, resolved };
}
