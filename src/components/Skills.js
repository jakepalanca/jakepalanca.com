
import { drawText, wrapWords } from './Grid';

export function Skills(grid, y, gutter, contentWidth, DATA) {
  const width = Math.max(10, contentWidth);
  drawText(grid, gutter, y++, 'SKILLS', 'c12');
  drawText(grid, gutter, y++, '─'.repeat(Math.max(8, Math.min(width, 32))));
  const list = (DATA.skills || []).join(', ');
  const lines = wrapWords(list, Math.max(1, width - 2));
  for (const ln of lines) drawText(grid, gutter, y++, ln);
  y += 1;
  return y;
}
