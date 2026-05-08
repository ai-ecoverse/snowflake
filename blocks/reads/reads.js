/**
 * reads — "This week's reads" 2×2 magazine roster
 *
 * Section head row (row 0):
 *   Cell 1: eyebrow
 *   Cell 2: h2
 *   Cell 3: "All articles" link URL (optional)
 *
 * Card rows (rows 1…N):
 *   Cell 1: article URL
 *   Cell 2: <picture>/<img> (200×200)
 *   Cell 3: chip variant (datacenter | ai | workplace | neutral)
 *   Cell 4: chip label
 *   Cell 5: h3 title
 *   Cell 6: deck text
 *   Cell 7: date
 *   Cell 8: read-time
 *   Cell 9: author
 */

function text(cell) { return cell ? cell.textContent.trim() : ''; }

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'ds-container';

  // Head row
  const headRow = rows[0];
  const cells0 = [...(headRow?.children || [])];
  const eyebrow = text(cells0[0]);
  const heading = text(cells0[1]);
  const allHref = text(cells0[2]);

  const head = document.createElement('div');
  head.className = 'ds-section-head';
  const headLeft = document.createElement('div');
  headLeft.innerHTML = `<span class="ds-eyebrow">${eyebrow}</span><h2>${heading}</h2>`;
  head.append(headLeft);
  if (allHref) {
    const link = document.createElement('a');
    link.className = 'ds-link-arrow';
    link.href = allHref;
    link.textContent = 'All articles →';
    head.append(link);
  }
  wrapper.append(head);

  // Card grid
  const roster = document.createElement('div');
  roster.className = 'reads-roster';

  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    const href = text(cells[0]) || '#';
    const thumbCell = cells[1];
    const chipVariant = text(cells[2]) || 'datacenter';
    const chipLabel = text(cells[3]);
    const titleText = text(cells[4]);
    const deckText = text(cells[5]);
    const date = text(cells[6]);
    const readTime = text(cells[7]);
    const author = text(cells[8]);

    const a = document.createElement('a');
    a.className = 'reads-card';
    a.href = href;

    const thumb = document.createElement('span');
    thumb.className = 'reads-thumb';
    if (thumbCell) {
      [...thumbCell.childNodes].forEach((n) => thumb.append(n.cloneNode(true)));
    }

    const body = document.createElement('div');
    body.className = 'reads-body';

    if (chipLabel) {
      const chip = document.createElement('span');
      chip.className = `ds-chip ds-chip--${chipVariant}`;
      chip.textContent = chipLabel;
      body.append(chip);
    }

    const h3 = document.createElement('h3');
    h3.textContent = titleText;
    body.append(h3);

    if (deckText) {
      const deck = document.createElement('p');
      deck.className = 'reads-deck';
      deck.textContent = deckText;
      body.append(deck);
    }

    const parts = [date, readTime, author].filter(Boolean);
    if (parts.length) {
      const meta = document.createElement('div');
      meta.className = 'reads-meta';
      parts.forEach((p, i) => {
        const s = document.createElement('span');
        s.textContent = p;
        meta.append(s);
        if (i < parts.length - 1) {
          const sep = document.createElement('span');
          sep.setAttribute('aria-hidden', 'true');
          sep.textContent = '·';
          meta.append(sep);
        }
      });
      body.append(meta);
    }

    a.append(thumb, body);
    roster.append(a);
  });

  wrapper.append(roster);
  block.replaceChildren(wrapper);
}
