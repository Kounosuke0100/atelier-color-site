import { useState } from "react";
import {
  formatHsl,
  formatRgb,
  hslToHex,
  hslToRgb,
  type HSL,
} from "../lib/color";
import { nearestColorName } from "../lib/colorName";
import styles from "../styles/StatusPanel.module.css";

type Props = {
  color: HSL;
  depth: number;
};

const MAX_DOTS = 5;

export function StatusPanel({ color, depth }: Props) {
  const hex = hslToHex(color);
  const rgb = formatRgb(hslToRgb(color));
  const hsl = formatHsl(color);
  const name = nearestColorName(hex);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // ignore
    }
  };

  return (
    <aside className={styles.panel}>
      <div className={styles.eyebrow}>
        <span>Inspector</span>
        <span className={styles.eyebrowDots} aria-label={`階層 ${depth}`}>
          {Array.from({ length: MAX_DOTS }).map((_, i) => (
            <span
              key={i}
              className={`${styles.eyebrowDot} ${
                i < depth ? styles.eyebrowDotOn : ""
              }`}
            />
          ))}
        </span>
      </div>
      <div className={styles.preview} style={{ background: hex }} />
      <div className={styles.hexWrap}>
        <button
          className={styles.hex}
          onClick={copy}
          aria-label="HEX をコピー"
          title="クリックでコピー"
        >
          {hex}
        </button>
        <span className={styles.name} title={name}>
          {name}
        </span>
        <span
          className={`${styles.toast} ${copied ? styles.toastShow : ""}`}
          aria-live="polite"
        >
          Copied
        </span>
      </div>
      <dl className={styles.meta}>
        <dt className={styles.metaLabel}>RGB</dt>
        <dd>{rgb.replace(/^rgb\(|\)$/g, "")}</dd>
        <dt className={styles.metaLabel}>HSL</dt>
        <dd>{hsl.replace(/^hsl\(|\)$/g, "")}</dd>
      </dl>
    </aside>
  );
}
