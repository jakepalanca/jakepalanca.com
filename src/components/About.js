
import { drawText, wrapWords } from './Grid';

export function About(grid, y, gutter, contentWidth, DATA) {
  const width = Math.max(10, contentWidth);
  let yy = y;
  // Heading
  drawText(grid, gutter, yy++, 'ABOUT', 'c12');
  drawText(grid, gutter, yy++, '─'.repeat(Math.max(8, Math.min(width, 32))));

  // Body
  const body = wrapWords(DATA.about, width);
  for (const ln of body) drawText(grid, gutter, yy++, ln);

  // Quick highlights (derived from skills/tagline for readability)
  const skillsLine = wrapWords((DATA.skills || []).join(', '), width - 4);
  if (skillsLine.length) {
    yy += 1;
    drawText(grid, gutter, yy++, 'Focus', 'c7');
    for (const ln of skillsLine) drawText(grid, gutter + 2, yy++, `– ${ln}`);
  }

  return yy + 1;
}
