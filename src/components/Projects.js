
import { drawText, wrapWords } from './Grid';

export function Projects(grid, y, gutter, contentWidth, DATA) {
  const width = Math.max(10, contentWidth);
  drawText(grid, gutter, y++, 'PROJECTS', 'c12');
  drawText(grid, gutter, y++, '─'.repeat(Math.max(8, Math.min(width, 32))));
  for (let i = 0; i < DATA.projects.length; i++) {
    const p = DATA.projects[i];
    drawText(grid, gutter, y++, `${i + 1}. ${p.title}`, 'c7');
    const innerWidth = Math.max(1, width - 4);
    const desc = [];
    for (const ln of (p.lines || [])) {
      const wrapped = wrapWords(ln.replace(/^•\s*/, '– '), innerWidth);
      for (const w of wrapped) desc.push(w);
    }
    for (const ln of desc) drawText(grid, gutter + 2, y++, ln);
    y += 1;
  }
  return y;
}
