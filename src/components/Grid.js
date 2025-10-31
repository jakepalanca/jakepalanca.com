
import React from 'react';
import { DATA } from '../data';
import { useEffects } from './Effects';
import { Header } from './Header';
import { About } from './About';
import { Links } from './Links';
import { Projects } from './Projects';
import { Experience } from './Experience';
import { Education } from './Education';
import { Skills } from './Skills';

// Grid utility functions
export function makeGrid(cols, rows, fill = ' ') {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => fill));
}

export function drawText(grid, x, y, text, color = null) {
  if (y < 0 || y >= grid.length) return;
  for (let i = 0; i < text.length && x + i < grid[0].length; i++) {
    if (x + i >= 0) {
      grid[y][x + i] = { ch: text[i], color, content: true };
    }
  }
}

export function drawH(grid, y, x0, x1, ch = '─') {
  for (let x = x0; x <= x1 && x < grid[0].length; x++) grid[y][x] = ch;
}

export function drawV(grid, x, y0, y1, ch = '│') {
  for (let y = y0; y <= y1 && y < grid.length; y++) grid[y][x] = ch;
}

export function drawBox(grid, x, y, w, h) {
  const x1 = x + w - 1, y1 = y + h - 1;
  drawH(grid, y, x, x1, '─');
  drawH(grid, y1, x, x1, '─');
  drawV(grid, x, y, y1, '│');
  drawV(grid, x1, y, y1, '│');
  grid[y][x] = '┌';
  grid[y][x1] = '┐';
  grid[y1][x] = '└';
  grid[y1][x1] = '┘';
}

export function wrapWords(text, width) {
  if (width <= 4) return [text.slice(0, width)];
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    if (line.length === 0) {
      if (w.length <= width) line = w; else lines.push(w.slice(0, width));
    } else if (line.length + 1 + w.length <= width) {
      line += ' ' + w;
    } else {
      lines.push(line);
      line = w.length <= width ? w : w.slice(0, width);
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Utility: blit a sprite as dim background
function isContentCell(cell) {
  return !!(cell && typeof cell === 'object' && cell.content);
}

function setBgCell(grid, x, y, payload) {
  const current = grid[y]?.[x];
  if (isContentCell(current)) return; // don't overwrite foreground content
  grid[y][x] = payload;
}

function blitSprite(grid, x0, y0, lines, colorFn) {
  const rows = grid.length;
  const cols = grid[0]?.length || 0;
  for (let r = 0; r < lines.length; r++) {
    const y = y0 + r;
    if (y < 0 || y >= rows) continue;
    const line = lines[r];
    for (let c = 0; c < line.length; c++) {
      const x = x0 + c;
      if (x < 0 || x >= cols) continue;
      const ch = line[c];
      if (ch === ' ') continue;
      const color = colorFn ? colorFn(ch, x, y) : 'c15';
      setBgCell(grid, x, y, { ch, color, bg: true });
    }
  }
}

// Draw a wide ASCII moon at the top-right corner (3/4 in frame)
function drawTopRightMoon(grid, cols) {
  const sprite = [
    "                     .--------------.",
    "                .---'  o        .    `---.",
    "             .-'    .    O  .         .   `-.",
    "          .-'     @@@@@@       .             `-.",
    "        .'@@   @@@@@@@@@@@       @@@@@@@   .    `.",
    "      .'@@@  @@@@@@@@@@@@@@     @@@@@@@@@         `.",
    "     /@@@  o @@@@@@@@@@@@@@     @@@@@@@@@     O     \\",
    "    /        @@@@@@@@@@@@@@  @   @@@@@@@@@ @@     .  \\",
    "   /@  o      @@@@@@@@@@@   .  @@  @@@@@@@@@@@     @@ \\",
    "  /@@@      .   @@@@@@ o       @  @@@@@@@@@@@@@ o @@@@ \\",
    " /@@@@@                  @ .      @@@@@@@@@@@@@@  @@@@@ \\",
    " |@@@@@    O    `.-./  .        .  @@@@@@@@@@@@@   @@@  |",
    " / @@@@@        --`-'       o        @@@@@@@@@@@ @@@    . \\",
    "|@ @@@@ .  @  @    `    @            @@      . @@@@@@    |",
    "|   @@                         o    @@   .     @@@@@@    |",
    "|  .     @   @ @       o              @@   o   @@@@@@.   |",
    "\\     @    @       @       .-.       @@@@       @@@      /",
    " |  @    @  @              `-'     . @@@@     .    .    |",
    " \\ .  o       @  @@@@  .              @@  .           . /",
    "  \\      @@@    @@@@@@       .                   o     /",
    "   \\    @@@@@   @@\\@@    /        O          .        /",
    "    \\ o  @@@       \\ \\  /  __        .   .     .--.  /",
    "     \\      .     . \\.-.---                   `--'  /",
    "      `.             `-'      .                   .'",
    "        `.    o     / | `           O     .     .'",
    "          `-.      /  |        o             .-'",
    "             `-.          .         .     .-'",
    "                `---.        .       .---'",
    "                     `--------------'",
  ];
  const moonWidth = sprite.reduce((m, l) => Math.max(m, l.length), 0);
  const x0 = Math.max(0, cols - Math.floor(moonWidth * 0.85)); // push further right
  const y0 = 0; // move a bit higher
  const colorFn = (ch) => {
    if (ch === '@') return 'c15'; // bright
    if ("`.-'_/|\\".includes(ch)) return 'c7'; // mid
    if (ch === 'o' || ch === 'O') return 'c11'; // warm accents
    return 'c11';
  };
  blitSprite(grid, x0, y0, sprite, colorFn);
}

// Draw ambient scenery near the bottom and return an env map for effects
function drawBottomScenery(grid, cols, startY) {
  const rows = grid.length;
  if (rows === 0 || cols === 0) return { env: { groundYByX: [], skyTopY: 0, skyBottomY: 0 }, bottomY: startY };

  // Scenery region anchored below content
  const pad = 2;
  const topY = Math.min(rows - 20, Math.max(10, startY + pad));
  // Move water band up by 4 rows while keeping overall composition consistent
  const waterTopY = Math.max(1, topY - 4);
  // Limit water height explicitly so it never grows too deep
  const maxWaterHeight = 24; // stricter cap per request
  const bottomY = Math.min(rows - 1, topY + maxWaterHeight - 1);

  // 1) Night sky just above scenery
  const skyTopY = Math.max(1, waterTopY - 18);
  // Bring hill band right up to the water start to avoid a hard gap
  const skyBottomY = Math.max(1, waterTopY - 1);
  for (let y = skyTopY; y <= skyBottomY; y++) {
    for (let x = 0; x < cols; x++) {
      const seed = ((x + 13) * 73856093) ^ ((y + 7) * 19349663);
      const r = Math.abs(seed % 101);
      if (r === 0) setBgCell(grid, x, y, { ch: '✦', color: 'c15', bg: true });
      else if (r < 3) setBgCell(grid, x, y, { ch: '·', color: 'c7', bg: true });
    }
  }

  // 2) No rainbow per latest request

  // 4) Water across entire width (capped to 50 rows)
  const groundYByX = new Array(cols).fill(waterTopY);
  for (let x = 0; x < cols; x++) {
    // Static undulation so the horizon isn't a flat cutoff
    const und = Math.round(Math.sin(x * 0.08) * 3 + Math.sin(x * 0.23) * 2);
    const waveBase = Math.min(bottomY, Math.max(waterTopY, waterTopY + und));
    for (let y = waveBase; y <= bottomY; y++) {
      const depth = y - waterTopY;
      // Prefer wavy/quirky glyphs; no block/dot shading
      const waveChars = ['≋','≈','∽','﹌','﹏','~','〰','↝','↭','ᵿ','⟿'];
      const idx = Math.abs(((x + y * 31) * 1103515245) >>> 0) % waveChars.length;
      const ch = waveChars[idx];
      // Blue palette only (no greens)
      const color = depth % 4 < 2 ? (x % 3 < 2 ? 'c12' : 'c14') : 'c11';
      setBgCell(grid, x, y, { ch, color, bg: true, bgType: 'water', solid: true });
    }
    groundYByX[x] = waveBase; // local surface for rain impacts
  }

  // 5) Green rolling hills behind the water in the sky band
  const ridgeBase = Math.max(skyTopY + 2, skyBottomY - 1);
  const amp = Math.max(3, Math.min(9, Math.floor(cols * 0.05)));
  const ridgeYByX = new Array(cols).fill(ridgeBase);
  for (let x = 0; x < cols; x++) {
    // Soft noise for gentle hills
    const noise = Math.sin(x * 0.045) * 0.6 + Math.sin(x * 0.013) * 0.4;
    const yR = ridgeBase - Math.floor(amp * (0.5 + 0.5 * noise));
    ridgeYByX[x] = Math.max(skyTopY, Math.min(skyBottomY, yR));
    for (let y = ridgeYByX[x]; y <= skyBottomY; y++) {
      const d = y - ridgeYByX[x];
      // Turf texture with variety
      const seed = ((x + 101) * 1103515245) ^ ((y + 97) * 12345);
      const m = Math.abs(seed % 7);
      const ch = d === 0
        ? (m < 3 ? '‾' : '﹎')
        : (m === 0 ? '·' : m === 1 ? '﹋' : m === 2 ? '﹌' : m === 3 ? '˘' : '░');
      // Smooth green gradient (using inline colors, not limited to 16)
      const l = 58 - Math.min(22, d * 6); // lighten towards crest
      const s = 35 + Math.min(20, d * 3);
      const hue = 110 + Math.min(6, d); // slightly warmer deeper down
      const color = `hsl(${hue}, ${s}%, ${Math.max(22, l)}%)`;
      setBgCell(grid, x, y, { ch, color, bg: true });
    }
  }

  // 6) Village on the mountain slope (anchored to local ridge)
  const village = [
    "~         ~~          __",
    "       _T      .,,.    ~--~ ^^",
    " ^^   // \\                    ~",
    "      ][O]    ^^      ,-~ ~",
    "   /''-I_I         _II____",
    "__/_  /   \\ ______/ ''   /'\\_,__",
    "  | II--'''' \\,--:--..,_/,.-{ },",
    "; '/__\\,.--';|   |[] .-.| O{ _ }",
    ":' |  | []  -|   ''--:.;[,.'\\, /",
    "'  |[]|,.--'' '',   ''-,.    |",
    "  ..    ..-''    ;       ''. '"
  ];
  const villW = village.reduce((m, l) => Math.max(m, l.length), 0);
  const villH = village.length;
  // Move village left slightly
  const villX = Math.max(2, Math.floor(cols * 0.10));
  let ridgeMin = skyBottomY;
  for (let i = 0; i < villW; i++) {
    const gx = villX + i;
    if (gx >= 0 && gx < cols) ridgeMin = Math.min(ridgeMin, ridgeYByX[gx] || skyBottomY);
  }
  const villY = Math.max(skyTopY, ridgeMin - villH - 1);
  const villageColor = (ch) => {
    // Trees and foliage
    if (ch === 'T') return 'hsl(120, 45%, 38%)';
    // Windows / lights
    if ('[]'.includes(ch)) return 'hsl(50, 95%, 84%)';
    // Walls / stone
    if ('{}'.includes(ch)) return 'hsl(40, 26%, 82%)';
    // Timber / outlines
    if ('/~\\|'.includes(ch)) return 'hsl(30, 25%, 55%)';
    // Roof accents
    if ('^'.includes(ch)) return 'hsl(12, 70%, 54%)';
    // Punctuation / shading
    if (',.;:_-'.includes(ch)) return 'hsl(30, 10%, 45%)';
    // Round ornaments / windows
    if ('O'.includes(ch)) return 'hsl(200, 85%, 70%)';
    // Default wood/stucco
    return 'hsl(32, 30%, 60%)';
  };
  // Draw village without overwriting foreground content
  blitSprite(grid, villX, villY, village, villageColor);

  // Boat moved to animated overlay during render; remove static sprite

  return { env: { groundYByX, skyTopY, skyBottomY, water: { startX: 0, topY: waterTopY, bottomY, height: Math.max(0, bottomY - waterTopY + 1) } }, bottomY };
}

// Main Grid component
export function Grid() {
  const containerRef = React.useRef(null);
  const { ref: measureRef, ch, lh } = useCharMetrics();
  const [cols, setCols] = React.useState(0);
  const [doc, setDoc] = React.useState({ lines: [], zones: [], trackX: 0, rows: 0 });
  const [hoverZone, setHoverZone] = React.useState(null);
  const [scrollRow, setScrollRow] = React.useState(0);
  const [viewportRows, setViewportRows] = React.useState(0);
  const [mousePos, setMousePos] = React.useState({ col: 0, row: 0, left: 0, top: 0, visible: false });
  const snapTimerRef = React.useRef(0);

  const { effects, addEffect } = useEffects(cols, doc.rows, scrollRow, viewportRows, (doc && doc.env) || null);

  // Compose document layout
  const composeDocument = React.useCallback((cols, hoveredZone) => {
    const trackX = Math.max(0, cols - 2);
    const grid = makeGrid(cols, 280, ' ');
    const zones = [];
    let y = 2;

    // Draw top-right moon art (keep header position intact)
    drawTopRightMoon(grid, cols);

    // Scenery drawn later at bottom to anchor to page end

    if (cols > 120) {
      // Draw header full-width above both panes
      y = Header(grid, y, 3, Math.max(10, cols - 6), DATA, 'c1');

      // Two-pane layout for desktop
      const leftGutter = 3;
      // With header full-width, left pane can be slimmer to favor content on right
      const desiredLeft = Math.floor(cols * 0.35);
      const leftWidth = Math.max(10, desiredLeft - leftGutter);
      const rightGutter = desiredLeft + 2;
      // Reserve a blank third pane on the far right equal to the left pane's width
      const thirdPaneWidth = Math.max(0, leftWidth);
      const rightWidth = Math.max(10, cols - rightGutter - thirdPaneWidth - 2);

      let leftY = y;
      let rightY = y;

      // Left pane: tagline first, aligned to top of right pane
      let afterTaglineY = leftY;
      if (Array.isArray(DATA.tagline) && DATA.tagline.length > 0) {
        const taglineStart = Math.max(rightY, leftY);
        let ty = taglineStart;
        DATA.tagline.forEach((t, idx) => {
          const color = idx === 0 ? 'c12' : 'c7'; // first line bold/accent
          drawText(grid, leftGutter, ty, t, color);
          ty++;
        });
        afterTaglineY = ty + 1; // spacer after tagline
      }

      // Left pane: buttons below tagline
      leftY = Links(grid, afterTaglineY, leftGutter, leftWidth, DATA, zones, hoveredZone);

      // Right pane: main content sections
      rightY = About(grid, rightY, rightGutter, rightWidth, DATA);
      rightY = Projects(grid, rightY, rightGutter, rightWidth, DATA);
      rightY = Experience(grid, rightY, rightGutter, rightWidth, DATA);
      rightY = Education(grid, rightY, rightGutter, rightWidth, DATA);
      rightY = Skills(grid, rightY, rightGutter, rightWidth, DATA);

      y = Math.max(leftY, rightY);

      // Leave the third pane area blank to visually center the content

    } else {
      // Single-column layout for mobile
      const gutter = 3;
      const contentWidth = Math.max(10, cols - gutter * 2 - 2);
      y = Header(grid, y, gutter, contentWidth, DATA, 'c1');
      y = About(grid, y, gutter, contentWidth, DATA);
      y = Links(grid, y, gutter, contentWidth, DATA, zones, hoveredZone);
      y = Projects(grid, y, gutter, contentWidth, DATA);
      y = Experience(grid, y, gutter, contentWidth, DATA);
      y = Education(grid, y, gutter, contentWidth, DATA);
      y = Skills(grid, y, gutter, contentWidth, DATA);
    }


    const { env, bottomY } = drawBottomScenery(grid, cols, y);

    const usedRows = Math.min(280, Math.max(y + 1, bottomY + 1));
    return { lines: grid, zones, trackX, rows: usedRows, env };
  }, []);

  React.useEffect(() => {
    addEffect('rain');
  }, [addEffect]);

  // Recalculate layout on resize
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || !ch) return;
    const recalc = () => {
      // Use clientWidth to exclude vertical scrollbar from the measurement.
      const width = el.clientWidth;
      // Fit as many full columns as possible within the visible width.
      const calculatedCols = Math.max(24, Math.floor(width / ch));
      setCols(calculatedCols);
    };
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [ch]);

  // Re-compose document when layout changes
  React.useEffect(() => {
    if (cols > 0) {
      setDoc(composeDocument(cols, hoverZone));
    }
  }, [cols, hoverZone, composeDocument]);

  // Calculate how many rows fit in the viewport
  React.useEffect(() => {
    if (!lh) return;
    const recalcViewport = () => {
      const rowsInView = Math.max(1, Math.ceil(window.innerHeight / lh));
      setViewportRows(rowsInView);
    };
    recalcViewport();
    window.addEventListener('resize', recalcViewport);
    return () => window.removeEventListener('resize', recalcViewport);
  }, [lh]);

  // Native scrolling: keep scrollRow in sync with container scrollTop
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || !lh) return;
    const onScroll = () => {
      const r = Math.max(0, Math.floor(el.scrollTop / Math.max(1, lh)));
      setScrollRow((prev) => (prev !== r ? r : prev));
      // Debounced snap-to-grid behavior
      if (snapTimerRef.current) window.clearTimeout(snapTimerRef.current);
      snapTimerRef.current = window.setTimeout(() => {
        const desired = Math.round(el.scrollTop / Math.max(1, lh)) * lh;
        el.scrollTo({ top: desired, behavior: 'smooth' });
      }, 120);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [lh]);

  // Handle mouse movement
  React.useEffect(() => {
    if (!ch || !lh) return;
    const onMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const col = Math.max(0, Math.min(cols - 1, Math.floor(x / ch)));
      const row = Math.max(0, Math.min(doc.rows - 1, Math.floor(y / lh) + scrollRow));
      const left = rect.left + col * ch;
      const top = rect.top + ((row - scrollRow) * lh);
      setMousePos({ col, row, left, top, visible: true });
    };
    const onLeave = () => setMousePos((p) => ({ ...p, visible: false }));
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, [ch, lh, cols, doc.rows, scrollRow]);

  const onPointerDown = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || !ch || !lh) return;
    const touch = 'touches' in e && e.touches && e.touches[0];
    const clientX = touch ? touch.clientX : e.clientX;
    const clientY = touch ? touch.clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const col = Math.max(0, Math.min(cols - 1, Math.floor(x / ch)));
    const row = Math.max(0, Math.min(doc.rows - 1, Math.floor(y / lh) + scrollRow));

    // Otherwise: trigger effects
    addEffect('firework', { col, row });
    addEffect('ripple', { col, row });
    addEffect('rain');
  };

  // Keyboard controls
  const onKeyDown = (e) => {
    if (!doc.rows) return;
    const el = containerRef.current;
    const maxR = Math.max(0, doc.rows - viewportRows);
    const by = (n) => {
      const next = Math.max(0, Math.min(maxR, scrollRow + n));
      if (el) el.scrollTo({ top: next * Math.max(1, lh), behavior: 'smooth' });
    };
    switch (e.key) {
      case 'ArrowDown': by(1); e.preventDefault(); break;
      case 'ArrowUp': by(-1); e.preventDefault(); break;
      case 'PageDown': by(Math.max(1, viewportRows - 1)); e.preventDefault(); break;
      case 'PageUp': by(-Math.max(1, viewportRows - 1)); e.preventDefault(); break;
      case 'Home': if (el) el.scrollTo({ top: 0, behavior: 'smooth' }); e.preventDefault(); break;
      case 'End': if (el) el.scrollTo({ top: maxR * Math.max(1, lh), behavior: 'smooth' }); e.preventDefault(); break;
      default: break;
    }
  };

  // Keep scrollTop within bounds when content/layout changes
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || !lh) return;
    const maxR = Math.max(0, doc.rows - viewportRows);
    const r = Math.max(0, Math.min(maxR, Math.round(el.scrollTop / Math.max(1, lh))));
    if (r !== scrollRow) setScrollRow(r);
  }, [doc.rows, viewportRows, scrollRow, lh]);

  // Auto-focus the container so keyboard scrolling works immediately
  React.useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.focus({ preventScroll: true });
    }
  }, []);

  // Render the grid
  return (
    <div className="gridwrap" ref={containerRef} onKeyDown={onKeyDown} tabIndex={0}>
      <div
        className="grid"
        style={{
          height: doc.rows * lh,
          width: cols * ch,
          ['--ch']: `${ch}px`,
          ['--lh']: `${lh}px`
        }}
        onPointerDown={onPointerDown}
        onTouchStart={onPointerDown}
      >
        <span ref={measureRef} className="measure">0</span>
        <GridContent doc={doc} scrollRow={scrollRow} viewportRows={viewportRows} effects={effects} mousePos={mousePos} lh={lh} />
      </div>
      <div className="overlays" style={{ width: cols * ch, height: doc.rows * lh }}>
        {doc.zones.map(z => (
          <a
            key={z.id}
            href={z.href}
            className={`linkzone ${z.color || 'c12'}`}
            style={{ left: z.x * ch, top: z.y * lh, width: z.w * ch, height: z.h * lh }}
            onMouseEnter={() => setHoverZone(z.id)}
            onMouseLeave={() => setHoverZone(null)}
            onTouchStart={() => setHoverZone(z.id)}
            onTouchEnd={() => setHoverZone(null)}><span className="sr-only">link</span></a>
        ))}
      </div>
      {/* custom cursor removed */}
    </div>
  );
}

// Helper component to render the grid content
function GridContent({ doc, scrollRow, viewportRows, effects, mousePos, lh }) {
  const { rows } = doc;
  if (!rows) return null;

  const buffer = 6;
  const start = Math.max(0, Math.min(rows - 1, scrollRow - buffer));
  const end = Math.max(start, Math.min(rows - 1, scrollRow + viewportRows + buffer));

  // Unicode scrollbar removed entirely

  const partsMap = new Map();
  const now = performance.now();
  const cols = (doc.lines[0]?.length) || 0;
  for (const p of (effects.particles || [])) {
    const age = now - p.t0;
    if (age > p.life) continue;
    const ix = Math.round(p.x);
    const iy = Math.round(p.y);
    if (iy < start || iy > end) continue;
    const key = `${ix},${iy}`;
    const t = age / p.life;
    const chars = ['✸','✷','✺','✹','✻','✶','•','·'];
    const chIdx = Math.min(chars.length - 1, Math.floor(t * chars.length));
    partsMap.set(key, { ch: chars[chIdx], color: p.color });
  }

  // Rain: render falling streaks that reach the ground, plus a small splash at impact
  const rainMap = new Map();
  for (const r of (effects.rain || [])) {
    const ix = Math.round(r.x);
    const iy = Math.round(r.y);
    if (iy < start || iy > end) continue;
    // Draw a short tail above the head for motion
    const tailLen = 3;
    for (let k = 0; k <= tailLen; k++) {
      const yk = iy - k;
      if (yk < start) break;
      const key = `${ix},${yk}`;
      if (!rainMap.has(key)) rainMap.set(key, { ch: k === 0 ? (r.char || '│') : '│', color: r.color });
    }
    // Impact splash: when char indicates impact, add side ripples
    if (r.char === '⠿') {
      const leftKey = `${ix - 1},${iy}`;
      const rightKey = `${ix + 1},${iy}`;
      if (!rainMap.has(leftKey)) rainMap.set(leftKey, { ch: '﹋', color: r.color });
      if (!rainMap.has(rightKey)) rainMap.set(rightKey, { ch: '﹋', color: r.color });
    }
  }

  // Star twinkle overlay at top of page and above bottom scenery
  const starMap = new Map();
  const phase = now * 0.002; // speed
  const addStars = (y0, y1) => {
    const yStart = Math.max(start, y0);
    const yEnd = Math.min(end, y1);
    // Mostly static: preselect extremely rare twinkles per frame
    const rareBucket = Math.max(1, Math.floor((now % 100000) / 1200));
    for (let y = yStart; y <= yEnd; y++) {
      for (let x = 0; x < (doc.lines[y]?.length || 0); x++) {
        const seed = ((x + 17) * 1103515245) ^ ((y + 31) * 12345);
        const base = Math.abs(seed % 95);
        if (base > 2) continue; // keep sparse base stars
        // Default static appearance
        let ch = base === 0 ? '✦' : base === 1 ? '•' : '·';
        let color = ch === '✦' ? 'c15' : ch === '•' ? 'c7' : 'c8';
        // Rarely twinkle 1-2 stars: hash selects very few per frame
        const pick = Math.abs((((x + 101) * 2654435761) ^ ((y + 29) * 374761393) ^ rareBucket) % 4000);
        if (pick === 0 || pick === 1) {
          const tw = Math.sin(phase + (seed % 628) / 100) * 0.5 + 0.5;
          const idx = Math.min(3, Math.floor(tw * 4));
          const chars = ['·', '•', '✧', '✦'];
          ch = chars[idx];
          color = idx >= 3 ? 'c15' : idx === 2 ? 'c7' : 'c8';
        }
        starMap.set(`${x},${y}`, { ch, color });
      }
    }
  };
  // Top-of-page star band
  addStars(1, 18);
  // Above bottom scenery horizon
  const skyTop = doc.env?.skyTopY ?? 1;
  const skyBottom = doc.env?.skyBottomY ?? Math.min(rows - 1, 18);
  addStars(skyTop, skyBottom);

  // Animated water overlay (shading + foam)
  const waterEnv = doc.env?.water || null;
  const rippleList = effects.ripples || [];
  // Shoreline softening overlay right at the water top edge
  const shorelineMap = new Map();
  if (false && waterEnv) {
    // Animated shoreline that follows the same wave model as waterChar
    const segW = 6;
    const phaseTick = Math.floor(now / 160);
    const k1 = 0.22, k2 = 0.07, a1 = 2.4, a2 = 1.2;
    const surfAt = (x) => {
      const group = Math.floor((x - waterEnv.startX) / segW);
      const t = (phaseTick + group) * 0.18;
      const wave = Math.sin(x * k1 + t * 1.3) * a1 + Math.sin(x * k2 - t * 0.7) * a2;
      return waterEnv.topY + 1 + Math.round(wave * 0.5);
    };
    for (let x = 0; x < cols; x++) {
      const y0 = surfAt(x);
      const candidates = [y0, y0 - 1, y0 + 1];
      for (const y of candidates) {
        if (y < start || y > end) continue;
        const cellHere = (doc.lines[y] && doc.lines[y][x]) || null;
        const isWaterBand = !!(cellHere && typeof cellHere === 'object' && cellHere.bg && cellHere.bgType === 'water');
        const seed = ((x + 401) * 2654435761) ^ ((y + 17) * 1597334677) ^ phaseTick;
        const r = Math.abs(seed % 100);
        // Vary probability by row for a soft blend
        let place = false;
        if (y === y0) place = r < 85; // dominant crest
        else if (y === y0 - 1) place = r < 35; // spray into hills
        else place = r < 25; // subsurface foam
        if (!place) continue;
        const ch = (r % 3 === 0) ? '≈' : (r % 3 === 1) ? '∽' : '﹌';
        const color = isWaterBand
          ? (r % 2 === 0 ? 'hsl(195, 80%, 78%)' : 'hsl(195, 70%, 68%)')
          : (r % 2 === 0 ? 'hsl(170, 40%, 64%)' : 'hsl(160, 30%, 56%)');
        shorelineMap.set(`${x},${y}`, { ch, color });
      }
    }
  }
  const rippleOverlay = (x, y) => {
    if (!waterEnv || rippleList.length === 0) return null;
    // Only ripple on water rows
    if (y < waterEnv.topY || y > waterEnv.bottomY) return null;
    for (const r of rippleList) {
      const age = Math.max(0, now - (r.t0 || 0));
      if (age > 1600) continue;
      const radius = age * 0.03; // chars per ms
      const thickness = 0.7;
      const dx = x - (r.col || 0);
      const dy = y - (r.row || 0);
      const dist = Math.hypot(dx, dy);
      if (Math.abs(dist - radius) < thickness) {
        // Ripple highlight with slight cyan-white tint
        const color = age % 180 < 90 ? 'hsl(195, 85%, 86%)' : 'hsl(195, 70%, 74%)';
        const ch = dist % 1.2 < 0.6 ? '≈' : '∽';
        return { ch, color };
      }
    }
    return null;
  };
  const waterChar = (x, y) => {
    if (!waterEnv) return null;
    if (x < waterEnv.startX || y < waterEnv.topY || y > waterEnv.bottomY) return null;
    // Update water in column groups (tiles) so it doesn't change all at once
    const segW = 6;
    const group = Math.floor((x - waterEnv.startX) / segW);
    const phaseTick = Math.floor(now / 160); // ~6 fps changes
    const t = (phaseTick + group) * 0.18;
    const k1 = 0.22;
    const k2 = 0.07;
    const a1 = 2.4;
    const a2 = 1.2;
    const wave = Math.sin(x * k1 + t * 1.3) * a1 + Math.sin(x * k2 - t * 0.7) * a2;
    // Local neighborhood for slope/curvature to vary foam thickness
    const wL = Math.sin((x - 1) * k1 + t * 1.3) * a1 + Math.sin((x - 1) * k2 - t * 0.7) * a2;
    const wR = Math.sin((x + 1) * k1 + t * 1.3) * a1 + Math.sin((x + 1) * k2 - t * 0.7) * a2;
    const slope = (wR - wL) * 0.5;
    const curv = wR - 2 * wave + wL;
    const surf = waterEnv.topY + 1 + Math.round(wave * 0.5); // moving surface
    const d = y - surf; // depth from moving surface
    // Time-varying seed for speckle animation (pseudo-stable noise)
    const seed = ((x + 37) * 1103515245) ^ ((y + 53) * 12345) ^ ((phaseTick + group) * 2654435761);
    // Async gating so not all tiles update every tick
    const gate = Math.abs((((x + 101) * 2654435761) ^ ((phaseTick + group) * 374761393)) % 5);
    if (gate > 2) return null; // fall back to static bg cell for many tiles
    const r = Math.abs(seed % 1000);
    // Foam probability & thickness based on curvature (crests/troughs) and mild randomness
    const crest = Math.max(0, Math.min(1, Math.abs(curv) * 0.18 + (0.5 - Math.abs(slope) * 0.08)));
    const foamThickness = 1 + (crest > 0.65 ? 2 : crest > 0.35 ? 1 : 0); // up to 3 rows
    const foamChance = Math.min(0.95, 0.35 + crest * 0.55); // dynamic, not a solid line

    // Helper to pick a blue/white palette only (no green)
    const deepBlue = 'hsl(210, 70%, 45%)';
    const lightBlue = 'hsl(195, 80%, 70%)';
    const white = '#f6fbff';

    if (d <= foamThickness - 1) {
      if ((r % 1000) / 1000 < foamChance) {
        const chs = ['≋', '≈', '∽', '﹌'];
        const ch = chs[(r >> 3) % chs.length];
        const color = (r % 5 < 3) ? white : lightBlue;
        return { ch, color };
      }
      // If not foamy this frame at the crest row, fall through to near-surface color
    }

    if (d === foamThickness) {
      const ch = (r % 2 === 0) ? '≈' : '﹌';
      const color = (r % 4 < 2) ? lightBlue : deepBlue;
      return { ch, color };
    } else if (d === foamThickness + 1) {
      const ch = (r % 3 === 0) ? '∽' : '﹌';
      const color = (r % 4 < 2) ? deepBlue : lightBlue;
      return { ch, color };
    } else {
      // Wavy/quirky glyphs for body water (no block/dot)
      const bodyChars = ['~','〰','﹏','↝','↭','≈','∽','〜','⟿','ᵿ'];
      const ch = bodyChars[(r >> 2) % bodyChars.length];
      const color = (r % 6 < 3) ? deepBlue : lightBlue;
      return { ch, color };
    }
  };

  // Moving, gently tilting boats overlay (multiple sprites)
  const boatMap = new Map();
  if (waterEnv) {
    // Large ship (from provided ASCII)
    const bigBoat = [
      "          /|\\",
      "       /__| )",
      "     /____| ))",
      "   /______| )))",
      " /________|  )))",
      "         _|____))",
      " \\======| o o / ",
      "     I\\",
      "      I \\",
      "      I  \\",
      "      I*--\\",
      "      I    \\",
      "      I     \\",
      "      I______\\",
      " _____I__O______",
      "  \\     ( )     b ",
    ];

    // Replace with variants inspired by provided ASCII boats
    const medBoat = [
      "              |",
      "           )___(",
      "              |",
      "        ---------------",
      "       /               \\",
      "      /___________________\\",
      "  ____________|______________________|__________",
      "   \\_                                        _/",
      "     \\______________________________________/",
    ];

    const smallBoat = [
      "      |",
      "     )_)",
      "    )___)",
      "   )_____)",
      " _____|____|____",
      "\\                   /",
      " ^^^^  ^^^   ^^^^ ",
    ];

    const boats = [
      { id: 'big',   sprite: bigBoat,   speed: 0.0000016, phase: 0.00, yOffset: 8,  tickOffset: 0,  maxVisibleRows: 9 },
      { id: 'med',   sprite: medBoat,   speed: 0.0000026, phase: 0.37, yOffset: 10, tickOffset: 11, maxVisibleRows: 7 },
      { id: 'small', sprite: smallBoat, speed: 0.0000032, phase: 0.71, yOffset: 12, tickOffset: 23, maxVisibleRows: 6 },
    ];

    const margin = 2;
    const minXGlobal = Math.max(waterEnv.startX + margin, 0);
    const maxXGlobal = Math.max(minXGlobal, cols - 1 - margin);
    const k1 = 0.22, k2 = 0.07, a1 = 2.4, a2 = 1.2;
    const surfaceAt = (sx) => {
      const w = Math.sin(sx * k1 + (now * 0.004) * 1.3) * a1 + Math.sin(sx * k2 - (now * 0.004) * 0.7) * a2;
      return waterEnv.topY + 1 + Math.round(w * 0.5);
    };

    for (let bi = 0; bi < boats.length; bi++) {
      const B = boats[bi];
      const boatW = B.sprite.reduce((m, l) => Math.max(m, l.length), 0);
      if (boatW <= 0) continue;
      const span = Math.max(0, (maxXGlobal - boatW) - minXGlobal);
      // Update boats in staggered ticks so they don't all update at once
      const boatTickMs = 360; // discrete update cadence
      const tick = Math.floor(now / boatTickMs) + (B.tickOffset || 0);
      // Add slight per-boat speed jitter; the 'small' boat moves more
      const jitterAmp = (B.id === 'small') ? 0.0000012 : 0.0000005;
      const jitter = Math.sin((now * 0.0008) + bi * 1.37) * jitterAmp;
      const t = tick * (B.speed + jitter) + B.phase;
      const u = Math.sin(t * Math.PI * 2) * 0.5 + 0.5; // 0..1
      const baseX = Math.round(minXGlobal + span * u);
      const sampleX = Math.min(cols - 1, Math.max(0, baseX + Math.floor(boatW / 2)));
      const surfY = surfaceAt(sampleX);
      const bob = Math.round(Math.sin((tick + bi) * 0.08 + sampleX * 0.05));
      // Ensure the sprite's waterline aligns with or just below the surface so it sits in water
      const waterline = B.sprite.length - 1;
      let baseY = surfY - waterline + (B.yOffset || 0) + bob;
      // Enforce that the waterline is never above the water surface row + 1
      if (baseY + waterline < waterEnv.topY + 1) {
        baseY = waterEnv.topY + 1 - waterline;
      }
      // Clamp within vertical bounds (allow mast to extend into sky, hull stays in water window)
      baseY = Math.min(baseY, waterEnv.bottomY - B.sprite.length + 1);
      baseY = Math.max(baseY, waterEnv.topY - Math.floor(B.sprite.length * 0.75));

      const surfLeft = surfaceAt(Math.max(0, sampleX - 2));
      const surfRight = surfaceAt(Math.min(cols - 1, sampleX + 2));
      const slope = Math.max(-2, Math.min(2, surfRight - surfLeft));

      const renderStartRow = Math.max(0, B.sprite.length - (B.maxVisibleRows || B.sprite.length));
      for (let r = renderStartRow; r < B.sprite.length; r++) {
        const y = baseY + r;
        // Clip to viewport only; allow masts to extend into the sky band
        if (y < start || y > end) continue;
        const line = B.sprite[r];
        const rowOffset = Math.round(((r - (B.sprite.length / 2)) / B.sprite.length) * slope * 2);
        for (let c = 0; c < line.length; c++) {
          const x = baseX + c + rowOffset;
          if (x < 0 || x >= cols) continue;
          const ch = line[c];
          if (ch === ' ') continue;
          // Avoid drawing hull pixels over non-water background but allow masts/sails above horizon
          const bgCell = (doc.lines[y] && doc.lines[y][x]) || null;
          const isBottomRows = r >= (B.sprite.length - 2); // hull vicinity
          if (isBottomRows && bgCell && typeof bgCell === 'object' && bgCell.bg && bgCell.bgType !== 'water') continue;
          // Per-boat color mapping with rich palette: ensure med boat hull parentheses aren't white
          let color = 'hsl(28, 55%, 38%)'; // base warm brown
          const isHullChar = '_/=I-'.includes(ch) || (B.id === 'med' && '()'.includes(ch));
          const isSailChar = '|*'.includes(ch) || (B.id !== 'med' && '()'.includes(ch));
          if (isSailChar) color = '#f6f8fb'; // sails, flags, mast tops
          else if (isHullChar) color = 'hsl(28, 45%, 34%)'; // darker timber/structure
          else if ('\\/'.includes(ch)) color = 'hsl(210, 12%, 60%)'; // rails/edges
          else if ('oO'.includes(ch)) color = 'hsl(195, 80%, 70%)'; // portholes/windows
          boatMap.set(`${x},${y}`, { ch, color });
        }
      }
    }
  }

  const out = [];
  for (let rowIndex = start; rowIndex <= end; rowIndex++) {
    const cells = [];
    const row = doc.lines[rowIndex] || [];
    const colCount = row.length;
    for (let x = 0; x < colCount; x++) {
      const cell = row[x];
      let chOut = ' ';
      let colorToken = '';
      let isFg = false;
      let bgCh = ' ';
      let bgColor = '';
      let dimClass = '';

      if (typeof cell === 'string') {
        // keep blank
      } else if (cell && typeof cell === 'object') {
        if (cell.content) {
          chOut = cell.ch ?? ' ';
          colorToken = cell.color || 'c15'; // preserve provided color
          isFg = chOut !== ' ';
        } else if (cell.bg) {
          // Dynamic water shading for water background cells
          if (cell.bgType === 'water') {
            const w = waterChar(x, rowIndex);
            const ro = rippleOverlay(x, rowIndex);
            if (ro) { bgCh = ro.ch; bgColor = ro.color; }
            else if (w) { bgCh = w.ch; bgColor = w.color; }
            else { bgCh = cell.ch ?? ' '; bgColor = cell.color || ''; }
          } else {
            bgCh = cell.ch ?? ' ';
            bgColor = cell.color || '';
          }
          dimClass = ' dim';
        } else {
          // fallback
          chOut = cell.ch ?? ' ';
          colorToken = cell.color || '';
          isFg = chOut !== ' ';
        }
      }

      // Unicode scrollbar removed; no track rendering

      const key = `${x},${rowIndex}`;
      // Overlay moving boat before other effects, but never over content
      const boat = boatMap.get(key);
      if (boat && !isFg) { chOut = boat.ch; isFg = true; colorToken = boat.color; }

      // Shoreline overlay at water top edge; goes under text but above background
      const shore = shorelineMap.get(key);
      if (shore && !isFg) { chOut = shore.ch; isFg = true; colorToken = shore.color; dimClass = ' dim'; }

      // Firework particles: do not cover content
      const part = partsMap.get(key);
      if (part && !isFg) { chOut = part.ch; isFg = true; colorToken = part.color; }

      const rain = rainMap.get(key);
      // Render rain under content by default; if you want rain to overlay text,
      // replace condition with: if (rain) { ... }
      if (rain && !isFg) { chOut = rain.ch; isFg = true; colorToken = rain.color; dimClass = ' dim'; }

      // Stars twinkle only when background (do not replace content)
      const star = starMap.get(key);
      // Stars only in empty sky cells (not over any ASCII art)
      if (star && !isFg && bgCh === ' ') { chOut = star.ch; isFg = true; colorToken = star.color; dimClass = ' dim'; }

      // If still nothing, render any background art with dimming
      if (!isFg && bgCh !== ' ') {
        chOut = bgCh;
        colorToken = bgColor;
      }

      // Keep link zones clickable without recoloring text; all text stays white

      const cls = `${isFg ? 'fg' : 'bg'}${dimClass}`;
      const isClassToken = typeof colorToken === 'string' && /^c\d+$/i.test(colorToken);
      const extraClass = isClassToken ? ` ${colorToken}` : '';
      const styleColor = !isClassToken && colorToken ? { color: colorToken } : undefined;
      cells.push(
        <span key={x} className={`cell ${cls}${extraClass}`} style={styleColor}>
          {chOut}
        </span>
      );
    }
    out.push(<div className="row" key={rowIndex} aria-hidden>{cells}</div>);
  }
  return (
    <div style={{ transform: `translateY(${start * lh}px)` }}>
      {out}
    </div>
  );
}

// Custom hook for character metrics
function useCharMetrics() {
  const ref = React.useRef(null);
  const [metrics, setMetrics] = React.useState({ ch: 8, lh: 16 });
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setMetrics({ ch: r.width, lh: r.height });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  return { ref, ...metrics };
}
