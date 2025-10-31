
import { drawText } from './Grid';

export function Links(grid, y, gutter, contentWidth, DATA, zones, hoveredZone) {
  const linkDefs = [
    { id: 'resume', label: 'Resume', href: DATA.links.resume, color: 'c12' },
    { id: 'github', label: 'GitHub', href: DATA.links.github, color: 'c10' },
    { id: 'linkedin', label: 'LinkedIn', href: DATA.links.linkedin, color: 'c12' },
    { id: 'email', label: 'Email', href: DATA.links.email, color: 'c6' }
  ];
  let x = gutter;
  for (const l of linkDefs) {
    const label = ` ${l.label} `; // padding inside the button
    const inner = label.length;
    const hovered = hoveredZone === l.id;
    const TL = hovered ? '╔' : '╭';
    const TR = hovered ? '╗' : '╮';
    const BL = hovered ? '╚' : '╰';
    const BR = hovered ? '╝' : '╯';
    const H  = hovered ? '═' : '─';
    const V  = hovered ? '║' : '│';

    const top = `${TL}${H.repeat(inner)}${TR}`;
    const mid = `${V}${label}${V}`;
    const bot = `${BL}${H.repeat(inner)}${BR}`;

    drawText(grid, x, y + 0, top, l.color);
    drawText(grid, x, y + 1, mid, l.color);
    drawText(grid, x, y + 2, bot, l.color);

    zones.push({ id: l.id, href: l.href, x, y, w: top.length, h: 3, color: l.color });
    x += top.length + 2; // tighter spacing between buttons
  }
  return y + 4; // leave one blank line under buttons
}
