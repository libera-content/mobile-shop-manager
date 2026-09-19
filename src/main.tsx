import { render } from 'preact';
import Phaser from 'phaser';
import './styles.css';

const COLS = 20;
const ROWS = 32;

class StoreScene extends Phaser.Scene {
  constructor() {
    super('StoreScene');
  }

  create(): void {
    const width = this.scale.width;
    const height = this.scale.height;
    const cellW = width / COLS;
    const cellH = height / ROWS;
    const g = this.add.graphics();

    g.fillStyle(0x172033, 1);
    g.fillRect(0, 0, width, height);

    const zones = [
      { y: 0, h: 6, color: 0x26324d, label: '事務所' },
      { y: 7, h: 6, color: 0x233b4d, label: 'カウンター' },
      { y: 13, h: 6, color: 0x2c3f35, label: '待合・展示' },
      { y: 19, h: 5, color: 0x3d3448, label: '受付' },
      { y: 24, h: 4, color: 0x4a3d2a, label: '入口' },
      { y: 28, h: 4, color: 0x27313b, label: '店外' }
    ];

    for (const z of zones) {
      g.fillStyle(z.color, 1);
      g.fillRect(0, z.y * cellH, width, z.h * cellH);
      this.add.text(8, z.y * cellH + 6, z.label, {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '12px',
        color: '#dbeafe'
      });
    }

    g.lineStyle(1, 0xffffff, 0.08);
    for (let x = 0; x <= COLS; x++) g.lineBetween(x * cellW, 0, x * cellW, height);
    for (let y = 0; y <= ROWS; y++) g.lineBetween(0, y * cellH, width, y * cellH);

    const tokens = [
      { x: 10, y: 4, t: '店長', c: 0xfbbf24 },
      { x: 5, y: 10, t: 'A', c: 0x60a5fa },
      { x: 9, y: 10, t: 'B', c: 0x34d399 },
      { x: 13, y: 10, t: 'C', c: 0xf472b6 },
      { x: 16, y: 10, t: 'D', c: 0xa78bfa },
      { x: 10, y: 21, t: '客', c: 0xffffff }
    ];

    for (const p of tokens) {
      const px = (p.x + 0.5) * cellW;
      const py = (p.y + 0.5) * cellH;
      g.fillStyle(p.c, 1);
      g.fillCircle(px, py, Math.max(6, Math.min(cellW, cellH) * 0.35));
      this.add.text(px, py, p.t, {
        fontFamily: 'system-ui, sans-serif',
        fontSize: p.t === '店長' ? '9px' : '10px',
        color: '#0b1020',
        fontStyle: 'bold'
      }).setOrigin(0.5);
    }
  }
}

function App() {
  return (
    <main class="shell">
      <header class="hud">
        <div class="topline"><strong>開店前 10:00</strong><span class="speed">⏸ 1x 2x 4x</span></div>
        <div class="metrics">
          <div><span>機種変更</span><strong>0/10</strong></div>
          <div><span>成約率</span><strong>—</strong></div>
          <div><span>来店</span><strong>0</strong></div>
          <div><span>接客</span><strong>0</strong></div>
          <div><span>待ち</span><strong>0分</strong></div>
        </div>
      </header>
      <section id="game-root" class="game-wrap" aria-label="店舗マップ" />
      <footer class="manager">
        <div>
          <span class="eyebrow">店長</span>
          <strong>待機中</strong>
        </div>
        <div class="actions">
          <button disabled>移動</button>
          <button disabled>受付応援</button>
          <button disabled>進捗確認</button>
        </div>
      </footer>
    </main>
  );
}

render(<App />, document.getElementById('app')!);

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-root',
  backgroundColor: '#111827',
  width: 360,
  height: 480,
  scene: [StoreScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 360,
    height: 480
  }
});
