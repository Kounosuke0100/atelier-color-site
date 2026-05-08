import { useState } from "react";
import { ColorGrid } from "./components/ColorGrid";
import { SwatchBar, hueColors, grayColors } from "./components/SwatchBar";
import { Header } from "./components/Header";
import { StatusPanel } from "./components/StatusPanel";
import { DetailModal } from "./components/DetailModal";
import { useNavigator } from "./state/useNavigator";
import { centerColor } from "./lib/grid";
import type { HSL } from "./lib/color";
import styles from "./styles/App.module.css";

const MAX_DEPTH = 5;

export default function App() {
  const { stack, current, drillDown, back, jumpTo } = useNavigator();
  const [detail, setDetail] = useState<HSL | null>(null);

  const handleSingleClick = (color: HSL) => {
    if (current.depth >= MAX_DEPTH) {
      setDetail(color);
      return;
    }
    drillDown(color);
  };

  return (
    <div className={styles.app}>
      <Header stack={stack} onBack={back} onJump={jumpTo} />
      <div className={styles.shell}>
        <main className={styles.main}>
          <section className={styles.canvas}>
            <div className={styles.canvasInner}>
              <ColorGrid
                layer={current}
                onSingleClick={handleSingleClick}
                onDoubleClick={setDetail}
              />
              {current.depth === 0 && (
                <>
                  <SwatchBar
                    colors={hueColors(24)}
                    label="Hue"
                    variant="hue"
                    onSingleClick={handleSingleClick}
                    onDoubleClick={setDetail}
                  />
                  <SwatchBar
                    colors={grayColors(12)}
                    label="Grayscale"
                    variant="gray"
                    onSingleClick={handleSingleClick}
                    onDoubleClick={setDetail}
                  />
                </>
              )}
            </div>
          </section>
          <StatusPanel color={centerColor(current)} depth={current.depth} />
        </main>
      </div>
      <footer className={styles.footer}>
        <span>
          シングルクリックでズーム · ダブルクリックで詳細 ·{" "}
          <kbd>Esc</kbd> で閉じる
        </span>
        <span>Atelier Color — drill-down color picker</span>
      </footer>
      <DetailModal color={detail} onClose={() => setDetail(null)} />
    </div>
  );
}
