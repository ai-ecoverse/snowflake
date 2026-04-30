/**
 * Leadership block
 * Authoring rows (positional):
 *   1. eyebrow
 *   2. h2
 *   3+. Leader rows — 4 cells: [link href | tag | name | description + link text]
 *       Cell 4 may contain "description // link text" separated by " // "
 *       href of "#" means no external link (inline card only)
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const eyebrowText = rows[0]?.querySelector('p, div')?.textContent?.trim() ?? '';
  const headlineText = rows[1]?.querySelector('p, div, h2')?.textContent?.trim() ?? '';

  // Header
  const header = document.createElement('div');
  header.className = 'leadership-header';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = eyebrowText;

  const h2 = document.createElement('h2');
  h2.textContent = headlineText;

  header.append(eyebrow, h2);

  // Cards grid
  const grid = document.createElement('div');
  grid.className = 'leadership-grid';

  const leaderRows = rows.slice(2);
  leaderRows.forEach((row) => {
    const cells = [...row.children];
    const href = cells[0]?.textContent?.trim() ?? '#';
    const tagText = cells[1]?.textContent?.trim() ?? '';
    const nameText = cells[2]?.textContent?.trim() ?? '';
    const rawDesc = cells[3]?.textContent?.trim() ?? '';

    // Split description and link label on " // "
    let descText = rawDesc;
    let linkLabel = '';
    const splitIdx = rawDesc.indexOf(' // ');
    if (splitIdx !== -1) {
      descText = rawDesc.slice(0, splitIdx).trim();
      linkLabel = rawDesc.slice(splitIdx + 4).trim();
    }

    // Determine element type: <a> if real href, <div> if "#" or empty
    const isLink = href && href !== '#';
    const card = document.createElement(isLink ? 'a' : 'div');
    card.className = 'lead-card';
    if (isLink) {
      card.href = href;
    }

    const tagEl = document.createElement('span');
    tagEl.className = 'tag';
    tagEl.textContent = tagText;

    const h3 = document.createElement('h3');
    h3.textContent = nameText;

    const p = document.createElement('p');
    p.textContent = descText;

    card.append(tagEl, h3, p);

    if (linkLabel) {
      const linkSpan = document.createElement('span');
      linkSpan.className = 'link-text';
      linkSpan.textContent = linkLabel;
      card.append(linkSpan);
    }

    grid.append(card);
  });

  const inner = document.createElement('div');
  inner.className = 'leadership-inner';
  inner.append(header, grid);

  block.replaceChildren(inner);
}
