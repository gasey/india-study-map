// ============================================
// GAUNTLET RUN — canvas engine. Pure TS, no React.
//
// 3-lane dodge runner. The critical design rule: DODGING NEVER
// RAISES THE MULTIPLIER. Score = metres x multiplier, and the
// multiplier only moves when the page reports a correct gate
// answer via resolveGate(true). Knowledge is the progression.
//
// The engine owns physics/render; the page owns questions.
// Contract:
//   - every GATE_EVERY_M metres → state 'gate', onGate() fires,
//     the page overlays an MCQ and later calls resolveGate(ok)
//   - collisions eat shield charges; at 0 → state 'dead',
//     onDeath() fires; the page may call revive() or endRun()
// ============================================

export interface EngineCallbacks {
  onGate: (tier: number) => void;
  onDeath: () => void;
  onHud: (hud: Hud) => void;
}

export interface Hud {
  metres: number;
  score: number;
  multiplier: number;
  tier: number;
  shields: number;
  streak: number;
}

export interface EngineConfig {
  startShields: number;
  startMultiplier: number;
}

interface Obstacle {
  lane: number;
  y: number; // top edge, px in world space (0 = top of canvas)
  h: number;
  w: number; // fraction of lane width
  hue: number;
}

const LANES = 3;
const GATE_EVERY_M = 250;
const PX_PER_M = 7; // world px per metre travelled

export class GauntletEngine {
  private ctx: CanvasRenderingContext2D;
  private raf = 0;
  private last = 0;
  private running = false;

  state: 'run' | 'gate' | 'dead' | 'ended' = 'run';

  private lane = 1;
  private playerX = 0.5; // eased lane position 0..1 across track
  private obstacles: Obstacle[] = [];
  private spawnIn = 0;
  private lastSpawnLane = -1;

  private metres = 0;
  private nextGateAt = GATE_EVERY_M;
  tier = 1;
  multiplier: number;
  private shields: number;
  streak = 0;
  private invincibleUntil = 0;
  private hitFlashUntil = 0;
  private gateGlow = 0; // 1 right after a gate opens, decays

  private colors = {
    accent: '#9184d9',
    accentLight: '#b5abfc',
    border: '#3f424d',
    text: '#e9e9ed',
    muted: '#75798c',
    panel: '#1a1c2a',
    danger: '#e35d6a',
  };

  private detachInput: () => void = () => {};

  constructor(
    private canvas: HTMLCanvasElement,
    private cfg: EngineConfig,
    private cb: EngineCallbacks,
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas 2d unavailable');
    this.ctx = ctx;
    this.multiplier = cfg.startMultiplier;
    this.shields = cfg.startShields;
    this.refreshTheme();
    this.attachInput();
    this.resize();
  }

  // ---------- lifecycle ----------

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    const loop = (t: number) => {
      if (!this.running) return;
      const dt = Math.min((t - this.last) / 1000, 0.05);
      this.last = t;
      if (this.state === 'run') this.step(dt);
      this.draw(t);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  destroy() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.detachInput();
  }

  /** Pull palette from the app's CSS variables — call again on theme flip. */
  refreshTheme() {
    const s = getComputedStyle(this.canvas.parentElement ?? document.documentElement);
    const v = (name: string, fallback: string) => s.getPropertyValue(name).trim() || fallback;
    this.colors = {
      accent: v('--accent', this.colors.accent),
      accentLight: v('--accent-light', this.colors.accentLight),
      border: v('--border', this.colors.border),
      text: v('--text-primary', this.colors.text),
      muted: v('--text-muted', this.colors.muted),
      panel: v('--bg-panel', this.colors.panel),
      danger: '#e35d6a',
    };
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = Math.max(1, Math.round(rect.width * dpr));
    this.canvas.height = Math.max(1, Math.round(rect.height * dpr));
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // ---------- page-driven transitions ----------

  /** Correct answer → tier up + multiplier up; wrong → treated as a hit. */
  resolveGate(correct: boolean) {
    if (this.state !== 'gate') return;
    if (correct) {
      this.tier += 1;
      this.multiplier += 0.5;
      this.streak += 1;
      this.gateGlow = 1;
      this.state = 'run';
      this.grace(1.2);
    } else {
      this.streak = 0;
      this.state = 'run';
      this.grace(1.2);
      this.hit(true);
    }
    this.nextGateAt = this.metres + GATE_EVERY_M;
    this.pushHud();
  }

  /** Revive question answered correctly. */
  revive() {
    if (this.state !== 'dead') return;
    this.obstacles = this.obstacles.filter((o) => o.y < this.height() * 0.35);
    this.state = 'run';
    this.grace(2.0);
    this.pushHud();
  }

  endRun() {
    this.state = 'ended';
  }

  getResult() {
    return { metres: Math.round(this.metres), score: this.score() };
  }

  // ---------- internals ----------

  private width() { return this.canvas.getBoundingClientRect().width; }
  private height() { return this.canvas.getBoundingClientRect().height; }

  private score() { return Math.round(this.metres * this.multiplier); }

  private speed(): number {
    // px/s. Tier steps come only from answered gates; tiny in-tier creep for tension.
    const inTier = Math.min((this.metres + GATE_EVERY_M - this.nextGateAt) / GATE_EVERY_M, 1);
    return 300 * (1 + 0.24 * (this.tier - 1)) * (1 + inTier * 0.08);
  }

  private grace(seconds: number) {
    this.invincibleUntil = performance.now() + seconds * 1000;
  }

  private step(dt: number) {
    const spd = this.speed();
    this.metres += (spd * dt) / PX_PER_M;
    this.gateGlow = Math.max(0, this.gateGlow - dt * 0.8);

    // ease player toward lane centre
    const target = (this.lane + 0.5) / LANES;
    this.playerX += (target - this.playerX) * Math.min(1, dt * 14);

    // spawn obstacles — never the same lane 3x in a row, density scales with tier
    this.spawnIn -= dt;
    if (this.spawnIn <= 0) {
      const gapS = Math.max(0.42, 0.95 - this.tier * 0.07);
      this.spawnIn = gapS * (0.75 + Math.random() * 0.5);
      let lane = Math.floor(Math.random() * LANES);
      if (lane === this.lastSpawnLane && Math.random() < 0.6) lane = (lane + 1 + Math.floor(Math.random() * 2)) % LANES;
      this.lastSpawnLane = lane;
      this.obstacles.push({
        lane,
        y: -60,
        h: 26 + Math.random() * 26,
        w: 0.55 + Math.random() * 0.25,
        hue: Math.random(),
      });
    }

    // move + cull + collide
    const H = this.height();
    const playerY = H - 84;
    const laneW = this.width() / LANES;
    const now = performance.now();
    for (const o of this.obstacles) o.y += spd * dt;
    this.obstacles = this.obstacles.filter((o) => o.y < H + 80);

    if (now > this.invincibleUntil) {
      const px = this.playerX * this.width();
      for (const o of this.obstacles) {
        const ox = (o.lane + 0.5) * laneW;
        const halfW = (laneW * o.w) / 2;
        if (Math.abs(px - ox) < halfW + 14 && o.y + o.h > playerY - 16 && o.y < playerY + 16) {
          o.y = H + 999; // consume the obstacle
          this.hit(false);
          break;
        }
      }
    }

    // gate reached?
    if (this.metres >= this.nextGateAt && this.state === 'run') {
      this.state = 'gate';
      this.obstacles = [];
      this.cb.onGate(this.tier);
    }

    this.pushHud();
  }

  private hit(fromGate: boolean) {
    if (!fromGate && performance.now() < this.invincibleUntil) return;
    this.hitFlashUntil = performance.now() + 350;
    if (this.shields > 0) {
      this.shields -= 1;
      this.grace(1.5);
    } else {
      this.state = 'dead';
      this.cb.onDeath();
    }
    this.pushHud();
  }

  private pushHud() {
    this.cb.onHud({
      metres: Math.round(this.metres),
      score: this.score(),
      multiplier: this.multiplier,
      tier: this.tier,
      shields: this.shields,
      streak: this.streak,
    });
  }

  // ---------- input ----------

  private attachInput() {
    const key = (e: KeyboardEvent) => {
      if (this.state !== 'run') return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.lane = Math.max(0, this.lane - 1);
      else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.lane = Math.min(LANES - 1, this.lane + 1);
      else return;
      e.preventDefault();
    };
    const tap = (e: PointerEvent) => {
      if (this.state !== 'run') return;
      const rect = this.canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      if (x < 0.5) this.lane = Math.max(0, this.lane - 1);
      else this.lane = Math.min(LANES - 1, this.lane + 1);
    };
    window.addEventListener('keydown', key);
    this.canvas.addEventListener('pointerdown', tap);
    this.detachInput = () => {
      window.removeEventListener('keydown', key);
      this.canvas.removeEventListener('pointerdown', tap);
    };
  }

  // ---------- render ----------

  private draw(t: number) {
    const ctx = this.ctx;
    const W = this.width();
    const H = this.height();
    const laneW = W / LANES;
    const c = this.colors;
    ctx.clearRect(0, 0, W, H);

    // lane dividers — scroll with speed so motion reads even between obstacles
    ctx.strokeStyle = c.border;
    ctx.lineWidth = 1;
    ctx.setLineDash([14, 18]);
    const dashOffset = (this.metres * PX_PER_M) % 32;
    ctx.lineDashOffset = -dashOffset;
    for (let i = 1; i < LANES; i++) {
      ctx.beginPath();
      ctx.moveTo(i * laneW, 0);
      ctx.lineTo(i * laneW, H);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // gate glow sweep after a correct answer
    if (this.gateGlow > 0) {
      const g = ctx.createLinearGradient(0, 0, 0, H * 0.5);
      g.addColorStop(0, this.withAlpha(c.accentLight, 0.35 * this.gateGlow));
      g.addColorStop(1, this.withAlpha(c.accentLight, 0));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H * 0.5);
    }

    // obstacles
    for (const o of this.obstacles) {
      const ow = laneW * o.w;
      const ox = (o.lane + 0.5) * laneW - ow / 2;
      ctx.fillStyle = o.hue < 0.5 ? this.withAlpha(c.accent, 0.85) : this.withAlpha(c.muted, 0.9);
      this.rounded(ox, o.y, ow, o.h, 7);
      ctx.fill();
    }

    // player — capsule with shield ring + hit flash
    const px = this.playerX * W;
    const py = H - 84;
    const now = performance.now();
    const invincible = now < this.invincibleUntil;
    const flashing = now < this.hitFlashUntil;

    if (this.shields > 0 || invincible) {
      ctx.strokeStyle = this.withAlpha(c.accentLight, invincible ? 0.4 + 0.3 * Math.sin(t / 80) : 0.55);
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(px, py, 26, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = flashing ? c.danger : c.accentLight;
    this.rounded(px - 13, py - 17, 26, 34, 13);
    ctx.fill();
    // visor stripe
    ctx.fillStyle = this.withAlpha(c.panel, 0.85);
    this.rounded(px - 8, py - 8, 16, 5, 2.5);
    ctx.fill();

    // exhaust trail
    ctx.fillStyle = this.withAlpha(c.accent, 0.28);
    for (let i = 0; i < 3; i++) {
      const ty = py + 22 + i * 12 + (this.metres * PX_PER_M) % 12;
      const tw = 10 - i * 3;
      this.rounded(px - tw / 2, ty, tw, 7, 3);
      ctx.fill();
    }
  }

  private rounded(x: number, y: number, w: number, h: number, r: number) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  private withAlpha(color: string, a: number): string {
    // Accepts #rgb/#rrggbb or rgb(a) strings from CSS vars.
    if (color.startsWith('#')) {
      const hex = color.length === 4
        ? color.slice(1).split('').map((ch) => ch + ch).join('')
        : color.slice(1);
      const n = parseInt(hex, 16);
      return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
    }
    if (color.startsWith('rgb')) {
      const nums = color.replace(/rgba?\(|\)/g, '').split(',').slice(0, 3).join(',');
      return `rgba(${nums},${a})`;
    }
    return color;
  }
}
