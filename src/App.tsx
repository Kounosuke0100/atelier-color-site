import { ColorGrid } from "./components/ColorGrid";
import { SwatchBar, hueColors, grayColors } from "./components/SwatchBar";
import { Header } from "./components/Header";
import { StatusPanel } from "./components/StatusPanel";
import { useNavigator } from "./state/useNavigator";
import { useTheme } from "./state/useTheme";
import { centerColor } from "./lib/grid";
import type { HSL } from "./lib/color";
import styles from "./styles/App.module.css";

const MAX_DEPTH = 5;

export default function App() {
  const { stack, current, drillDown, back, jumpTo, setBaseFromHsl } =
    useNavigator();
  const theme = useTheme();

  const handleSingleClick = (color: HSL) => {
    if (current.depth >= MAX_DEPTH) {
      setBaseFromHsl(color);
      return;
    }
    drillDown(color);
  };

  return (
    <div className={styles.app}>
      <Header
        stack={stack}
        onBack={back}
        onJump={jumpTo}
        onSetBase={setBaseFromHsl}
        themeMode={theme.mode}
        onThemeChange={theme.setMode}
      />
      <div className={styles.shell}>
        <main className={styles.main}>
          <section className={styles.canvas}>
            <div className={styles.canvasInner}>
              <ColorGrid
                layer={current}
                onSingleClick={handleSingleClick}
                onDoubleClick={handleSingleClick}
              />
              {current.depth === 0 && (
                <>
                  <SwatchBar
                    colors={hueColors(24)}
                    label="Hue"
                    variant="hue"
                    onSingleClick={handleSingleClick}
                    onDoubleClick={handleSingleClick}
                  />
                  <SwatchBar
                    colors={grayColors(12)}
                    label="Grayscale"
                    variant="gray"
                    onSingleClick={handleSingleClick}
                    onDoubleClick={handleSingleClick}
                  />
                </>
              )}
            </div>
          </section>
          <StatusPanel
            color={centerColor(current)}
            depth={current.depth}
            onPickBase={setBaseFromHsl}
          />
        </main>
      </div>
      <footer className={styles.footer}>
        <span>
          クリックでズーム · Inspector で詳細を確認 · HEX 入力で基本色を直接指定
        </span>
        <span>Atelier Color — drill-down color picker</span>
      </footer>
    </div>
  );
}
