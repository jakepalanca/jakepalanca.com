
import React from 'react';
import tinycolor from 'tinycolor2';

// Helper to generate a random integer within a range
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to generate a random float within a range
const randFloat = (min, max) => Math.random() * (max - min) + min;

// Generates a set of particles for a firework effect
export function spawnFireworks(col, row) {
  const particles = [];
  const now = performance.now();
  const hue = rand(0, 360);
  const N = 25;

  for (let i = 0; i < N; i++) {
    const angle = (i / N) * Math.PI * 2;
    const speed = randFloat(0.6, 1.2);
    const color = tinycolor({ h: hue + rand(-15, 15), s: 0.9, l: 0.6 }).toHslString();

    particles.push({
      x: col + 0.0,
      y: row + 0.0,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      t0: now,
      life: rand(800, 1500),
      color,
    });
  }
  return particles;
}

// Generates a new ripple effect
export function spawnRipple(col, row) {
  return { col, row, t0: performance.now() };
}

// Generates a new rain particle
export function spawnRain(cols, rows) {
  const vy = randFloat(0.35, 0.9);
  // Life long enough to traverse entire grid, plus slack
  const distance = rows + 10;
  const frames = Math.max(60, Math.round(distance / vy));
  const life = Math.round(frames * (1000 / 60));
  return {
    x: rand(0, Math.max(0, cols - 1)),
    y: -1,
    vy,
    char: '│',
    color: `hsl(200, 80%, ${rand(45, 75)}%)`,
    life,
    t0: performance.now(),
  };
}

// Custom hook to manage all animated effects
export function useEffects(cols, rows, scrollRow, viewportRows, env = null) {
  const [effects, setEffects] = React.useState({ particles: [], ripples: [], rain: [] });
  const artRef = React.useRef({ sprite: null, col: 0, row: 0, until: 0 });

  const addEffect = React.useCallback((type, payload) => {
    setEffects(prev => {
      const newEffects = { ...prev };
      if (type === 'firework') {
        newEffects.particles = [...prev.particles, ...spawnFireworks(payload.col, payload.row)];
        if (newEffects.particles.length > 400) {
          newEffects.particles.splice(0, newEffects.particles.length - 400);
        }
      } else if (type === 'ripple') {
        newEffects.ripples = [...prev.ripples, spawnRipple(payload.col, payload.row)];
        if (newEffects.ripples.length > 10) {
          newEffects.ripples.shift();
        }
      } else if (type === 'rain') {
        newEffects.rain = [...prev.rain, spawnRain(cols, rows)];
        if (newEffects.rain.length > 300) {
          newEffects.rain.splice(0, newEffects.rain.length - 300);
        }
      }
      return newEffects;
    });
  }, [cols, rows]);

  React.useEffect(() => {
    const animate = () => {
      const now = performance.now();
      setEffects(prev => {
        const newParticles = prev.particles.filter(p => now - p.t0 < p.life).map(p => ({
          ...p,
          vx: p.vx * 0.98,
          vy: p.vy * 0.98 + 0.02,
          x: p.x + p.vx * 0.35,
          y: p.y + p.vy * 0.35,
        }));

        const newRipples = prev.ripples.filter(r => now - r.t0 < 1600);

        let newRain = [];
        for (const r of prev.rain) {
          if (now - r.t0 >= r.life) continue;
          const ix = Math.max(0, Math.min(cols - 1, Math.round(r.x)));
          const groundY = (env && env.groundYByX && env.groundYByX[ix] !== undefined)
            ? env.groundYByX[ix]
            : rows - 2;
          const yNext = r.y + r.vy;
          if (yNext >= groundY) {
            // Brief impact frame at ground, then drop disappears
            newRain.push({ ...r, y: groundY, vy: 0, char: '⠿', color: r.color, t0: now, life: 80 });
          } else if (yNext < rows + 2) {
            newRain.push({ ...r, y: yNext });
          }
        }
        // Spawn more rain for a denser effect
        if (Math.random() < 0.5) newRain.push(spawnRain(cols, rows));
      
        return { particles: newParticles, ripples: newRipples, rain: newRain };
      });

      // Ambient art slideshow logic (can be moved here if ARTS is imported)
      // For now, keeping it simple

      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [cols, rows, env]);

  return { effects, addEffect };
}
