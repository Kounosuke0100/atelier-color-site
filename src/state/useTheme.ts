import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "gray";

const STORAGE_KEY = "atelier-color-theme";

function readStoredMode(): ThemeMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "light" || raw === "dark" || raw === "gray") {
      return raw;
    }
  } catch {
    // ignore
  }
  return "light";
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(readStoredMode);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  }, [mode]);

  return { mode, setMode };
}
