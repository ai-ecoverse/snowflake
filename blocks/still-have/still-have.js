/**
 * still-have — "Still have questions?" contact CTA grid on dark shelter background
 *
 * Authoring rows (positional):
 *   1. Section heading (e.g. "Still have questions?")
 *   Then repeating card rows, each with two cells:
 *   - Cell 1: eyebrow label (e.g. "Call")
 *   - Cell 2: card heading + link(s)
 *
 * Each card row after the heading becomes one card in a 3-up grid.
 */

function text(cell) { return cell ? cell.textContent.trim() : ''; }

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const inner = document.createElement('div');
  inner.className = 'still-have-inner';

  // Row 0: section heading
  const headingText = text(rows[0]?.firstElementChild);
  if (headingText) {
    const h2 = document.createElement('h2');
    h2.textContent = headingText;
    inner.append(h2);
  }

  // Remaining rows: cards
  const grid = document.createElement('div');
  grid.className = 'still-grid';

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const eyebrowCell = row.firstElementChild;
    const contentCell = row.children[1];

    if (!eyebrowCell && !contentCell) continue;

    const card = document.createElement('div');
    card.className = 'still-card';

    const eyebrowText = text(eyebrowCell);
    if (eyebrowText) {
      const eyebrow = document.createElement('p');
      eyebrow.className = 'eyebrow';
      eyebrow.textContent = eyebrowText;
      card.append(eyebrow);
    }

    // Clone content from cell B (heading + links)
    if (contentCell) {
      [...contentCell.childNodes].forEach((n) => card.append(n.cloneNode(true)));
    }

    grid.append(card);
  }

  inner.append(grid);
  block.replaceChildren(inner);
}
