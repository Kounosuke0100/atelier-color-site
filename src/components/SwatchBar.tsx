import { useEffect, useRef } from "react";
import { hslToHex, type HSL } from "../lib/color";
import styles from "../styles/SwatchBar.module.css";

type Props = {
  colors: HSL[];
  label: string;
  variant?: "hue" | "gray";
  onSingleClick: (color: HSL) => void;
  onDoubleClick: (color: HSL) => void;
};

const DOUBLE_CLICK_MS = 250;

export function SwatchBar({
  colors,
  label,
  variant = "hue",
  onSingleClick,
  onDoubleClick,
}: Props) {
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

  const barClass = variant === "gray" ? styles.barGray : styles.barHue;

  return (
    <div className={styles.wrap}>
      <span className={styles.label}>{label}</span>
      <div className={`${styles.bar} ${barClass}`} aria-label={label}>
        {colors.map((color, i) => {
          const hex = hslToHex(color);
          return (
            <button
              key={i}
              className={styles.swatch}
              style={{ background: hex }}
              title={hex}
              onClick={() => handleClick(color)}
            />
          );
        })}
      </div>
    </div>
  );
}

export function hueColors(count = 24): HSL[] {
  return Array.from({ length: count }, (_, i) => ({
    h: (i * 360) / count,
    s: 100,
    l: 50,
  }));
}

export function grayColors(count = 12): HSL[] {
  return Array.from({ length: count }, (_, i) => ({
    h: 0,
    s: 0,
    l: (i * 100) / (count - 1),
  }));
}
