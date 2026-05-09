import { useState } from "react";
import {
  formatHsl,
  formatHsv,
  formatRgb,
  hslToHex,
  hslToHsv,
  hslToRgb,
  type HSL,
} from "../lib/color";
import { nearestColorName } from "../lib/colorName";
import { HarmonyPanel } from "./HarmonyPanel";
import styles from "../styles/StatusPanel.module.css";

type Props = {
  color: HSL;
  depth: number;
  onPickBase: (hsl: HSL) => void;
};

const MAX_DOTS = 5;

export function StatusPanel({ color, depth, onPickBase }: Props) {
  const hex = hslToHex(color);
  const rgb = formatRgb(hslToRgb(color));
  const hsl = formatHsl(color);
  const hsv = formatHsv(hslToHsv(color));
  const name = nearestColorName(hex);
  const [hexCopied, setHexCopied] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyHex = async () => {
    try {
      await navigator.clipboard.writeText(hex);
      setHexCopied(true);
      window.setTimeout(() => setHexCopied(false), 1400);
    } catch {
      // ignore
    }
  };

  const copyValue = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 1200);
    } catch {
      // ignore
    }
  };

  const rows: { key: string; label: string; value: string }[] = [
    { key: "rgb", label: "RGB", value: rgb },
    { key: "hsl", label: "HSL", value: hsl },
    { key: "hsv", label: "HSV", value: hsv },
  ];

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
          onClick={copyHex}
          aria-label="HEX をコピー"
          title="クリックでコピー"
        >
          {hex}
        </button>
        <span className={styles.name} title={name}>
          {name}
        </span>
        <span
          className={`${styles.toast} ${hexCopied ? styles.toastShow : ""}`}
          aria-live="polite"
        >
          Copied
        </span>
      </div>
      <div className={styles.rows}>
        {rows.map(({ key, label, value }) => {
          const ok = copiedKey === key;
          return (
            <div key={key} className={styles.row}>
              <span className={styles.rowLabel}>{label}</span>
              <code className={styles.rowValue}>{value}</code>
              <button
                className={`${styles.copyBtn} ${ok ? styles.copyBtnOk : ""}`}
                onClick={() => copyValue(key, value)}
              >
                {ok ? "Copied ✓" : "Copy"}
              </button>
            </div>
          );
        })}
      </div>
      <HarmonyPanel base={color} onPick={onPickBase} />
    </aside>
  );
}
