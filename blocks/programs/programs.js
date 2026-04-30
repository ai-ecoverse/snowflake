/**
 * Programs block
 * Authoring rows (positional):
 *   1. eyebrow
 *   2. h2 headline
 *   3. intro paragraph
 *   4+. Program card rows — 4 cells each: [link href | code | heading | description]
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const eyebrowText = rows[0]?.querySelector('p, div')?.textContent?.trim() ?? '';
  const headlineText = rows[1]?.querySelector('p, div, h1, h2')?.textContent?.trim() ?? '';
  const introText = rows[2]?.querySelector('p, div')?.textContent?.trim() ?? '';

  // Build head
  const head = document.createElement('div');
  head.className = 'p-head';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = eyebrowText;

  const h2 = document.createElement('h2');
  h2.textContent = headlineText;

  const intro = document.createElement('p');
  intro.className = 'intro';
  intro.textContent = introText;

  head.append(eyebrow, h2, intro);

  // Build card grid from rows 3+
  const grid = document.createElement('div');
  grid.className = 'p-grid';

  rows.slice(3).forEach((row) => {
    const cells = [...row.children];
    const href = cells[0]?.textContent?.trim() || '#';
    const code = cells[1]?.textContent?.trim() ?? '';
    const heading = cells[2]?.textContent?.trim() ?? '';
    const desc = cells[3]?.textContent?.trim() ?? '';

    const card = document.createElement('a');
    card.className = 'p-card';
    card.href = href;

    const codeSpan = document.createElement('span');
    codeSpan.className = 'code';
    codeSpan.textContent = code;

    const body = document.createElement('div');
    body.className = 'p-card-body';

    const h3 = document.createElement('h3');
    h3.textContent = heading;

    const p = document.createElement('p');
    p.textContent = desc;

    const arrow = document.createElement('span');
    arrow.className = 'arrow';
    arrow.textContent = 'Learn more →';

    body.append(h3, p, arrow);
    card.append(codeSpan, body);
    grid.append(card);
  });

  block.replaceChildren(head, grid);
}
