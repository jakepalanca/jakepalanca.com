
import { drawText, wrapWords } from './Grid';

export function Experience(grid, y, gutter, contentWidth, DATA) {
  const width = Math.max(10, contentWidth);
  drawText(grid, gutter, y++, 'EXPERIENCE', 'c12');
  drawText(grid, gutter, y++, '─'.repeat(Math.max(8, Math.min(width, 32))));
  for (const e of DATA.experience) {
    drawText(grid, gutter, y++, `${e.title}`, 'c7');
    for (const ln of e.lines) {
      const wrapped = wrapWords(ln.replace(/^•\s*/, '– '), Math.max(1, width - 4));
      for (const w of wrapped) drawText(grid, gutter + 2, y++, w);
    }
    y += 1;
  }
  return y;
}
