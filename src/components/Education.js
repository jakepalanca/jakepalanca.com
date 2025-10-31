
import { drawText, wrapWords } from './Grid';

export function Education(grid, y, gutter, contentWidth, DATA) {
  const width = Math.max(10, contentWidth);
  drawText(grid, gutter, y++, 'EDUCATION', 'c12');
  drawText(grid, gutter, y++, '─'.repeat(Math.max(8, Math.min(width, 32))));
  for (const ed of DATA.education) {
    const wrapped = wrapWords(ed, Math.max(1, width - 2));
    for (const w of wrapped) drawText(grid, gutter + 0, y++, `• ${w}`);
  }
  y += 1;
  return y;
}
