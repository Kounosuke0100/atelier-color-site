import { useEffect, useState } from "react";
import {
  formatHsl,
  formatRgb,
  hslToHex,
  hslToRgb,
  type HSL,
} from "../lib/color";
import { HarmonyPanel } from "./HarmonyPanel";
import styles from "../styles/DetailModal.module.css";

type Props = {
  color: HSL | null;
  onClose: () => void;
};

export function DetailModal({ color, onClose }: Props) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [base, setBase] = useState<HSL | null>(color);

  useEffect(() => {
    setBase(color);
  }, [color]);

  useEffect(() => {
    if (!color) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [color, onClose]);

  if (!color || !base) return null;

  const hex = hslToHex(base);
  const rgb = formatRgb(hslToRgb(base));
  const hsl = formatHsl(base);

  const copy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 1200);
    } catch {
      // ignore
    }
  };

  const rows: { key: string; label: string; value: string }[] = [
    { key: "hex", label: "HEX", value: hex },
    { key: "rgb", label: "RGB", value: rgb },
    { key: "hsl", label: "HSL", value: hsl },
  ];

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.head}>
          <span className={styles.title}>Color details</span>
          <button
            className={styles.close}
            onClick={onClose}
            aria-label="閉じる"
          >
            ×
          </button>
        </div>
        <div className={styles.preview} style={{ background: hex }} />
        <div className={styles.rows}>
          {rows.map(({ key, label, value }) => {
            const ok = copiedKey === key;
            return (
              <div key={key} className={styles.row}>
                <span className={styles.rowLabel}>{label}</span>
                <code className={styles.rowValue}>{value}</code>
                <button
                  className={`${styles.copyBtn} ${ok ? styles.copyBtnOk : ""}`}
                  onClick={() => copy(key, value)}
                >
                  {ok ? "Copied ✓" : "Copy"}
                </button>
              </div>
            );
          })}
        </div>
        <HarmonyPanel base={base} onPick={setBase} />
      </div>
    </div>
  );
}
