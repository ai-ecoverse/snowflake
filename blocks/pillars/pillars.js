/**
 * Pillars block
 * Authoring rows (positional):
 *   1. eyebrow
 *   2. h2
 *   3. intro paragraph
 *   4+. pillar rows: 3 cells each [number | heading | description]
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const eyebrowText = rows[0]?.querySelector('p, div')?.textContent?.trim() ?? '';
  const headingText = rows[1]?.querySelector('p, div, h2')?.textContent?.trim() ?? '';
  const introText = rows[2]?.querySelector('p, div')?.textContent?.trim() ?? '';

  // Head section
  const head = document.createElement('div');
  head.className = 'pillars-head';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = eyebrowText;

  const h2 = document.createElement('h2');
  h2.textContent = headingText;

  const intro = document.createElement('p');
  intro.className = 'intro';
  intro.textContent = introText;

  head.append(eyebrow, h2, intro);

  // Pillar cards grid
  const grid = document.createElement('div');
  grid.className = 'pillars-grid';

  rows.slice(3).forEach((row) => {
    const cells = [...row.children];
    const numText = cells[0]?.textContent?.trim() ?? '';
    const titleText = cells[1]?.textContent?.trim() ?? '';
    const descText = cells[2]?.textContent?.trim() ?? '';

    const card = document.createElement('div');
    card.className = 'pillar';

    const num = document.createElement('p');
    num.className = 'num';
    num.textContent = numText;

    const h3 = document.createElement('h3');
    h3.textContent = titleText;

    const p = document.createElement('p');
    p.textContent = descText;

    card.append(num, h3, p);
    grid.append(card);
  });

  const wrapper = document.createElement('div');
  wrapper.className = 'pillars-inner';
  wrapper.append(head, grid);

  block.replaceChildren(wrapper);
}
