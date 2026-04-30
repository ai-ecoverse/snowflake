/**
 * still-have — dark teal panel with headline and 3-column contact card grid
 *
 * Authoring rows (positional):
 *   1. Headline text (e.g. "Still have questions?")
 *   2. Eyebrow | Card heading | Contact link  ← card 1
 *   3. Eyebrow | Card heading | Contact link  ← card 2
 *   4. Eyebrow | Card heading | Contact link  ← card 3
 */

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // ── Row 1: headline
  const headlineText = rows[0]?.querySelector('div')?.textContent?.trim() ?? '';

  const inner = document.createElement('div');
  inner.className = 'still-have-inner';

  const h2 = document.createElement('h2');
  h2.textContent = headlineText;

  const grid = document.createElement('div');
  grid.className = 'still-grid';

  // ── Rows 2–4: cards
  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    const eyebrowText = cells[0]?.textContent?.trim() ?? '';
    const cardHeading = cells[1]?.textContent?.trim() ?? '';
    // Cell 2 may contain an anchor element — preserve it
    const linkEl = cells[2]?.querySelector('a');

    const card = document.createElement('div');
    card.className = 'still-card';

    const eyebrow = document.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = eyebrowText;

    const h3 = document.createElement('h3');
    h3.textContent = cardHeading;

    card.append(eyebrow, h3);

    if (linkEl) {
      card.append(linkEl.cloneNode(true));
    } else {
      // Fallback: render raw text as a span
      const span = document.createElement('span');
      span.textContent = cells[2]?.textContent?.trim() ?? '';
      card.append(span);
    }

    grid.append(card);
  });

  inner.append(h2, grid);
  block.replaceChildren(inner);
}
