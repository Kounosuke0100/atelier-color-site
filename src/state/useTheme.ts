import { useEffect, useRef, useState } from "react";

export type ThemeMode = "light" | "dark" | "gray";

const STORAGE_KEY = "atelier-color-theme";

function isThemeMode(raw: string | null): raw is ThemeMode {
  return raw === "light" || raw === "dark" || raw === "gray";
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [isLoaded, setIsLoaded] = useState(false);
  const skipNextPersistRef = useRef(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (isThemeMode(raw)) {
          setMode(raw);
        }
      } catch {
        // ignore
      } finally {
        setIsLoaded(true);
      }
    }, 0);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  useEffect(() => {
    if (!isLoaded) return;
    if (skipNextPersistRef.current) {
      skipNextPersistRef.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  }, [isLoaded, mode]);

  return { mode, setMode };
}
