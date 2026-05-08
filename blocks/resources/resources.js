/**
 * resources — 3-col resource/blog cards
 *
 * Authoring rows (positional):
 *   1. Eyebrow text
 *   2. h2 headline
 *   3..N Card rows — 5 cells: image | date | title | excerpt | url
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const cell = (row, i) => [...row.children][i];

  // Header rows
  const eyebrowText = cell(rows[0], 0)?.textContent?.trim() || '';
  const headlineEl  = cell(rows[1], 0);

  // Card rows
  const cardRows = rows.slice(2);

  // Section header
  const header = document.createElement('header');
  header.className = 'section-header';

  if (eyebrowText) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 't-eyebrow';
    eyebrow.textContent = eyebrowText;
    header.appendChild(eyebrow);
  }

  if (headlineEl) {
    const h2 = document.createElement('h2');
    h2.className = 't-title-2';
    h2.innerHTML = headlineEl.innerHTML;
    header.appendChild(h2);
  }

  // Resources row
  const grid = document.createElement('div');
  grid.className = 'resources-row';

  cardRows.forEach((row) => {
    const imageEl   = cell(row, 0);
    const dateEl    = cell(row, 1);
    const titleEl   = cell(row, 2);
    const excerptEl = cell(row, 3);
    const urlEl     = cell(row, 4);

    // Determine href
    let href = '#';
    if (urlEl) {
      const anchor = urlEl.querySelector('a');
      href = anchor ? anchor.href : urlEl.textContent.trim() || '#';
    }

    const card = document.createElement('article');
    card.className = 'resource-card';

    // Image area
    const imageWrap = document.createElement('div');
    imageWrap.className = 'resource-image';
    if (imageEl) {
      const pic = imageEl.querySelector('picture, img');
      if (pic) {
        imageWrap.appendChild(pic.cloneNode(true));
      }
    }
    imageWrap.setAttribute('aria-hidden', 'true');
    card.appendChild(imageWrap);

    // Body
    const body = document.createElement('div');
    body.className = 'resource-body';

    if (dateEl) {
      const date = document.createElement('span');
      date.className = 'resource-date t-caption';
      date.innerHTML = dateEl.innerHTML;
      body.appendChild(date);
    }

    if (titleEl) {
      const title = document.createElement('h3');
      title.className = 'resource-title';
      title.innerHTML = titleEl.innerHTML;
      body.appendChild(title);
    }

    if (excerptEl) {
      const excerpt = document.createElement('div');
      excerpt.className = 'resource-excerpt t-body-s';
      excerpt.innerHTML = excerptEl.innerHTML;
      body.appendChild(excerpt);
    }

    // Arrow link
    const arrow = document.createElement('a');
    arrow.className = 'arrow';
    arrow.href = href;
    arrow.setAttribute('aria-hidden', 'true');
    arrow.tabIndex = -1;
    arrow.innerHTML = '&rarr;';
    body.appendChild(arrow);

    card.appendChild(body);

    // Wrap whole card as link
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => { window.location.href = href; });

    grid.appendChild(card);
  });

  block.replaceChildren(header, grid);
}
