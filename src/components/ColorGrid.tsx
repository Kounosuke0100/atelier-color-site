import { useEffect, useMemo, useRef } from "react";
import { hslToHex, type HSL } from "../lib/color";
import { generateGrid, type Layer } from "../lib/grid";
import styles from "../styles/ColorGrid.module.css";

type Props = {
  layer: Layer;
  onSingleClick: (color: HSL) => void;
  onDoubleClick: (color: HSL) => void;
};

const DOUBLE_CLICK_MS = 250;

export function ColorGrid({ layer, onSingleClick, onDoubleClick }: Props) {
  const grid = useMemo(() => generateGrid(layer), [layer]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleClick = (color: HSL) => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
      onDoubleClick(color);
      return;
    }
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      onSingleClick(color);
    }, DOUBLE_CLICK_MS);
  };

  return (
    <div key={layer.depth} className={styles.grid}>
      {grid.flat().map((color, i) => {
        const hex = hslToHex(color);
        return (
          <button
            key={i}
            className={styles.cell}
            style={{ background: hex }}
            title={hex}
            onClick={() => handleClick(color)}
          />
        );
      })}
    </div>
  );
}
