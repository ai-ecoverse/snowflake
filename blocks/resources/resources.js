/**
 * resources — Resource cards (standard 3-up or cinematic asymmetric L4)
 *
 * Authoring rows (positional):
 *   1. eyebrow
 *   2. h2 headline
 *   3..N. Resource rows — col1=tag | col2=title | col3=excerpt | col4=href
 *         First card is featured (spans 2 rows in cinematic variant)
 */

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  function cell(row, idx = 0) { return row?.children[idx] || null; }

  const eyebrowRow = rows[0];
  const headlineRow = rows[1];
  const cardRows = rows.slice(2);

  const header = document.createElement('header');
  header.className = 'section-header';

  if (eyebrowRow) {
    const p = document.createElement('p');
    p.className = 't-eyebrow t-caption is-upper';
    p.textContent = cell(eyebrowRow)?.textContent.trim() || '';
    header.append(p);
  }

  if (headlineRow) {
    const h2 = document.createElement('h2');
    h2.className = 't-title-2 is-upper deck';
    h2.innerHTML = cell(headlineRow)?.innerHTML || '';
    header.append(h2);
  }

  const grid = document.createElement('div');
  grid.className = 'resources-row';

  cardRows.forEach((row, i) => {
    const tag = cell(row, 0)?.textContent.trim() || '';
    const title = cell(row, 1)?.textContent.trim() || '';
    const excerpt = cell(row, 2)?.textContent.trim() || '';
    const href = cell(row, 3)?.textContent.trim() || '#';

    const card = document.createElement('article');
    card.className = `resource-card${i === 0 ? ' is-featured' : ''}`;

    const img = document.createElement('div');
    img.className = 'resource-image';
    img.setAttribute('aria-hidden', 'true');

    const body = document.createElement('div');
    body.className = 'resource-body';

    if (tag) {
      const tagEl = document.createElement('span');
      tagEl.className = 'resource-tag';
      tagEl.textContent = tag;
      body.append(tagEl);
    }

    if (title) {
      const titleEl = document.createElement('h3');
      titleEl.className = 'resource-title';
      titleEl.textContent = title;
      body.append(titleEl);
    }

    if (excerpt) {
      const excerptEl = document.createElement('p');
      excerptEl.className = 'resource-excerpt';
      excerptEl.textContent = excerpt;
      body.append(excerptEl);
    }

    const arrow = document.createElement('a');
    arrow.className = 'arrow';
    arrow.href = href;
    arrow.setAttribute('aria-label', `Read ${title}`);
    arrow.textContent = '→';
    body.append(arrow);

    card.append(img, body);
    grid.append(card);
  });

  block.replaceChildren(header, grid);
}
