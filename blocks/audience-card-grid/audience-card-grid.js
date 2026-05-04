/**
 * audience-card-grid — 5-up audience routing cards on dark surface (text only).
 * Authoring rows:
 *   1: Section heading (h3)
 *   2+: Card rows — Cell 1=h3 title, Cell 2=description, Cell 3=CTA label, Cell 4=link URL
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const fragments = [];

  // Row 1 — heading
  if (rows[0]) {
    const h3 = document.createElement('h3');
    h3.textContent = rows[0].firstElementChild?.textContent.trim() ?? '';
    fragments.push(h3);
  }

  const grid = document.createElement('div');
  grid.className = 'audience-grid';

  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    const titleText = cells[0]?.textContent.trim() ?? '';
    const descText = cells[1]?.textContent.trim() ?? '';
    const ctaLabel = cells[2]?.textContent.trim() ?? '';
    const url = cells[3]?.textContent.trim() ?? '#';

    const card = document.createElement('a');
    card.className = 'audience-card';
    card.href = url;

    const h3 = document.createElement('h3');
    h3.textContent = titleText;

    const p = document.createElement('p');
    p.textContent = descText;

    const cta = document.createElement('span');
    cta.className = 'audience-card-cta';
    cta.textContent = ctaLabel;

    card.append(h3, p, cta);
    grid.append(card);
  });

  fragments.push(grid);
  block.replaceChildren(...fragments);
}
