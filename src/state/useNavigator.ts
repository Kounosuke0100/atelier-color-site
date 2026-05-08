import { useCallback, useState } from "react";
import type { HSL } from "../lib/color";
import { computeNextLayer, rootLayer, type Layer } from "../lib/grid";

export function useNavigator() {
  const [stack, setStack] = useState<Layer[]>(() => [rootLayer()]);

  const current = stack[stack.length - 1];

  const drillDown = useCallback((clicked: HSL) => {
    setStack((prev) => {
      const parent = prev[prev.length - 1];
      return [...prev, computeNextLayer(parent, clicked)];
    });
  }, []);

  const back = useCallback(() => {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const jumpTo = useCallback((depth: number) => {
    setStack((prev) => prev.slice(0, depth + 1));
  }, []);

  const reset = useCallback(() => setStack([rootLayer()]), []);

  return { stack, current, drillDown, back, jumpTo, reset };
}
