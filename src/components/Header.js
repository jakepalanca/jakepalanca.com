
import { drawText } from './Grid';

export function Header(grid, y, gutter, contentWidth, DATA, color) {
  let currentY = y + 1;
  for (const line of DATA.name) {
    drawText(grid, gutter, currentY, line, color);
    currentY++;
  }
  // ensure at least a couple lines of space before Links block
  return currentY + 2;
}

