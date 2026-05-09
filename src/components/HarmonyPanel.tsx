import { useState } from "react";
import { hslToHex, type HSL } from "../lib/color";
import {
  HARMONY_ORDER,
  getHarmony,
  type HarmonyId,
} from "../lib/harmony";
import styles from "../styles/StatusPanel.module.css";

type Props = {
  base: HSL;
  onPick: (hsl: HSL) => void;
};

export function HarmonyPanel({ base, onPick }: Props) {
  const [active, setActive] = useState<HarmonyId>("complementary");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const swatches = getHarmony(base, active);
  const hasRatios = swatches.every((s) => typeof s.ratio === "number");

  const copy = async (key: string, hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 1200);
    } catch {
      // ignore
    }
  };

  return (
    <div className={styles.harmony}>
      <div className={styles.harmonyHead}>
        <span className={styles.rowLabel}>Harmony</span>
      </div>
      <div className={styles.harmonyTabs} role="tablist">
        {HARMONY_ORDER.map(({ id, label }) => (
          <button
            key={id}
            role="tab"
            aria-selected={active === id}
            className={`${styles.harmonyTab} ${
              active === id ? styles.harmonyTabActive : ""
            }`}
            onClick={() => setActive(id)}
          >
            {label}
          </button>
        ))}
      </div>
      {hasRatios && (
        <div
          className={styles.ratioBar}
          aria-label="面積比プレビュー (60-30-10)"
        >
          {swatches.map((s, i) => {
            const hex = hslToHex(s.hsl);
            const key = `${active}-bar-${i}`;
            return (
              <button
                key={key}
                type="button"
                className={styles.ratioSeg}
                style={{
                  background: hex,
                  flexGrow: s.ratio ?? 1,
                  flexBasis: 0,
                }}
                onClick={() => copy(key, hex)}
                title={`${hex} — クリックでコピー (${s.ratio}%)`}
              >
                <span className={styles.ratioSegLabel}>{s.ratio}%</span>
              </button>
            );
          })}
        </div>
      )}
      <div className={styles.harmonySwatches}>
        {swatches.map((s, i) => {
          const hex = hslToHex(s.hsl);
          const key = `${active}-${i}`;
          const ok = copiedKey === key;
          return (
            <button
              key={key}
              className={`${styles.swatch} ${
                s.role === "base" ? styles.swatchBase : ""
              }`}
              onClick={() => copy(key, hex)}
              onDoubleClick={() => onPick(s.hsl)}
              aria-label={`${s.role === "base" ? "Base" : "Derived"} ${hex}`}
              title={`${hex} — クリックでコピー / ダブルクリックで基準色に`}
            >
              <span
                className={styles.swatchChip}
                style={{ background: hex }}
                aria-hidden
              />
              <span className={styles.swatchHex}>{ok ? "Copied ✓" : hex}</span>
              {typeof s.ratio === "number" && (
                <span className={styles.swatchRatio}>{s.ratio}%</span>
              )}
              {s.role === "base" && (
                <span className={styles.swatchBadge}>Base</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
