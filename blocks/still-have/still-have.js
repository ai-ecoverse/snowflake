/**
 * still-have — Dark CTA section with heading + 3-column contact card grid.
 * Used at the bottom of the FAQ page as a "Still have questions?" panel.
 *
 * Authoring rows (positional):
 *   1. Section heading (e.g. "Still have questions?")
 *   Then repeating card rows, each with 3 cells:
 *     eyebrow | heading | link
 *
 *   OR each card as its own row with 3 cells:
 *     cell 0: eyebrow text
 *     cell 1: card heading
 *     cell 2: contact link (href + display text)
 */

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const innerWrapper = document.createElement('div');
  innerWrapper.className = 'still-have-inner';

  // First row = heading
  const headingCell = rows[0]?.firstElementChild;
  if (headingCell) {
    const h2 = headingCell.querySelector('h2') || document.createElement('h2');
    if (!headingCell.querySelector('h2')) {
      h2.textContent = headingCell.textContent.trim();
    }
    innerWrapper.append(h2);
  }

  // Remaining rows = contact cards (one per row, 3 cells each)
  const grid = document.createElement('div');
  grid.className = 'still-grid';

  for (let i = 1; i < rows.length; i++) {
    const cells = [...rows[i].children];
    const card = document.createElement('div');
    card.className = 'still-card';

    const eyebrowText = cells[0]?.textContent.trim();
    const titleText = cells[1]?.textContent.trim();
    const linkCell = cells[2];

    if (eyebrowText) {
      const eyebrow = document.createElement('p');
      eyebrow.className = 'eyebrow';
      eyebrow.textContent = eyebrowText;
      card.append(eyebrow);
    }

    if (titleText) {
      const h3 = document.createElement('h3');
      h3.textContent = titleText;
      card.append(h3);
    }

    if (linkCell) {
      const anchor = linkCell.querySelector('a');
      if (anchor) {
        const a = document.createElement('a');
        a.href = anchor.href;
        a.textContent = anchor.textContent.trim();
        card.append(a);
      } else {
        const p = document.createElement('p');
        [...linkCell.childNodes].forEach((n) => p.append(n.cloneNode(true)));
        card.append(p);
      }
    }

    grid.append(card);
  }

  innerWrapper.append(grid);
  block.replaceChildren(innerWrapper);
}
