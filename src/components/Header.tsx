import { useState } from "react";
import { hexToHsl, hslToHex, type HSL } from "../lib/color";
import { centerColor, type Layer } from "../lib/grid";
import type { ThemeMode } from "../state/useTheme";
import logoUrl from "../assets/logo.svg";
import styles from "../styles/Header.module.css";

type Props = {
  stack: Layer[];
  onBack: () => void;
  onJump: (depth: number) => void;
  onSetBase: (hsl: HSL) => void;
  themeMode: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
};

const MAX_DEPTH_DOTS = 5;

const THEME_OPTIONS: { id: ThemeMode; label: string }[] = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "gray", label: "Gray" },
];

export function Header({
  stack,
  onBack,
  onJump,
  onSetBase,
  themeMode,
  onThemeChange,
}: Props) {
  const canGoBack = stack.length > 1;
  const current = stack[stack.length - 1];
  const depth = current.depth;

  const [hexInput, setHexInput] = useState("");
  const [invalid, setInvalid] = useState(false);

  const placeholder =
    current.depth === 0 ? "#A1B2C3" : hslToHex(centerColor(current));

  const submit = () => {
    const value = hexInput.trim();
    if (!value) {
      setInvalid(false);
      return;
    }
    const hsl = hexToHsl(value);
    if (!hsl) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    setHexInput("");
    onSetBase(hsl);
  };

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <img className={styles.logo} src={logoUrl} alt="" aria-hidden="true" />
        <span className={styles.wordmark}>Atelier Color</span>
      </div>
      <div className={styles.divider} />
      <button
        className={styles.back}
        disabled={!canGoBack}
        onClick={onBack}
        aria-label="戻る"
        title="戻る"
      >
        ←
      </button>
      <nav className={styles.crumbs} aria-label="パンくず">
        {stack.map((layer, i) => {
          const isLast = i === stack.length - 1;
          const isBase = layer.depth === 0;
          const hex = isBase ? null : hslToHex(centerColor(layer));
          return (
            <span key={i} className={styles.crumb}>
              {i > 0 && <span className={styles.sep}>›</span>}
              <button
                className={`${styles.chip} ${isBase ? styles.chipBase : ""}`}
                disabled={isLast}
                onClick={() => onJump(i)}
              >
                {hex && (
                  <span
                    className={styles.swatch}
                    style={{ background: hex }}
                  />
                )}
                {isBase ? "基本色" : hex}
              </button>
            </span>
          );
        })}
      </nav>
      <div className={styles.tools}>
        <form
          className={`${styles.hexForm} ${invalid ? styles.hexFormInvalid : ""}`}
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <span className={styles.hexLabel}>HEX</span>
          <input
            className={styles.hexInput}
            type="text"
            inputMode="text"
            placeholder={placeholder}
            maxLength={7}
            value={hexInput}
            aria-invalid={invalid}
            aria-label="基本色を HEX で指定"
            onChange={(e) => {
              setHexInput(e.target.value);
              if (invalid) setInvalid(false);
            }}
            onBlur={submit}
          />
        </form>
        <div
          className={styles.themeGroup}
          role="group"
          aria-label="背景テーマ"
        >
          {THEME_OPTIONS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`${styles.themeBtn} ${
                themeMode === id ? styles.themeBtnActive : ""
              }`}
              onClick={() => onThemeChange(id)}
              aria-pressed={themeMode === id}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div
        className={styles.depth}
        aria-label={`階層 ${depth}`}
        title={`階層 ${depth}`}
      >
        {Array.from({ length: MAX_DEPTH_DOTS }).map((_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${i < depth ? styles.dotOn : ""}`}
          />
        ))}
      </div>
    </header>
  );
}
