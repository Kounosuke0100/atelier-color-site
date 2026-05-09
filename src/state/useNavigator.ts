import { useCallback, useState } from "react";
import type { HSL } from "../lib/color";
import {
  INITIAL_STEP,
  computeNextLayer,
  rootLayer,
  type Layer,
} from "../lib/grid";

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

  const setBaseFromHsl = useCallback((hsl: HSL) => {
    setStack([
      rootLayer(),
      {
        depth: 1,
        center: hsl,
        stepS: INITIAL_STEP,
        stepL: INITIAL_STEP,
      },
    ]);
  }, []);

  return { stack, current, drillDown, back, jumpTo, reset, setBaseFromHsl };
}
