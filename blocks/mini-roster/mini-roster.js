/**
 * mini-roster — "What else partners are reading" 3-up mini card grid
 *
 * Authoring: section head row, then one row per card.
 *
 * Section head row (row 0):
 *   Cell 1: eyebrow text
 *   Cell 2: h2 heading text
 *
 * Card rows (rows 1…N), each row has cells:
 *   Cell 1: article URL
 *   Cell 2: <picture>/<img> thumbnail (96×96)
 *   Cell 3: chip class variant (datacenter | ai | workplace | neutral)
 *   Cell 4: chip label
 *   Cell 5: h3 title
 *   Cell 6: date
 *   Cell 7: read-time
 */

function text(cell) { return cell ? cell.textContent.trim() : ''; }

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'ds-container';

  // Section head (first row)
  const headRow = rows[0];
  const cells0 = [...(headRow?.children || [])];
  const eyebrow = text(cells0[0]);
  const heading = text(cells0[1]);

  const head = document.createElement('div');
  head.className = 'ds-section-head';
  head.innerHTML = `<div>
    <span class="ds-eyebrow">${eyebrow}</span>
    <h2>${heading}</h2>
  </div>`;
  wrapper.append(head);

  // Card grid
  const grid = document.createElement('div');
  grid.className = 'mini-roster-grid';

  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    const href = text(cells[0]) || '#';
    const thumbCell = cells[1];
    const chipVariant = text(cells[2]) || 'datacenter';
    const chipLabel = text(cells[3]);
    const titleText = text(cells[4]);
    const date = text(cells[5]);
    const readTime = text(cells[6]);

    const a = document.createElement('a');
    a.className = 'mini-roster-card';
    a.href = href;

    // Thumb
    const thumb = document.createElement('span');
    thumb.className = 'mini-thumb';
    if (thumbCell) {
      [...thumbCell.childNodes].forEach((n) => thumb.append(n.cloneNode(true)));
    }

    // Body
    const body = document.createElement('div');
    body.className = 'mini-body';

    if (chipLabel) {
      const chip = document.createElement('span');
      chip.className = `ds-chip ds-chip--${chipVariant}`;
      chip.textContent = chipLabel;
      body.append(chip);
    }

    const h3 = document.createElement('h3');
    h3.textContent = titleText;
    body.append(h3);

    if (date || readTime) {
      const meta = document.createElement('div');
      meta.className = 'mini-meta';
      if (date) { const s = document.createElement('span'); s.textContent = date; meta.append(s); }
      if (date && readTime) { const sep = document.createElement('span'); sep.setAttribute('aria-hidden', 'true'); sep.textContent = '·'; meta.append(sep); }
      if (readTime) { const s = document.createElement('span'); s.textContent = readTime; meta.append(s); }
      body.append(meta);
    }

    a.append(thumb, body);
    grid.append(a);
  });

  wrapper.append(grid);
  block.replaceChildren(wrapper);
}
