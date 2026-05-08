import { hslToHex } from "../lib/color";
import { centerColor, type Layer } from "../lib/grid";
import logoUrl from "../assets/logo.svg";
import styles from "../styles/Header.module.css";

type Props = {
  stack: Layer[];
  onBack: () => void;
  onJump: (depth: number) => void;
};

const MAX_DEPTH_DOTS = 5;

export function Header({ stack, onBack, onJump }: Props) {
  const canGoBack = stack.length > 1;
  const depth = stack[stack.length - 1].depth;

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
