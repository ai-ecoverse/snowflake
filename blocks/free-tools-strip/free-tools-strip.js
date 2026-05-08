/**
 * free-tools-strip — 5 tool cards in horizontal scroll
 *
 * Authoring rows (positional):
 *   1. Eyebrow text
 *   2. h2 headline
 *   3..N Card rows — 3 cells: tool-name | tool-body | tool-url
 *
 * The tool-url cell contains either a plain URL string or an <a> element.
 * The whole card becomes a link if a URL is present.
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

  // Tools track
  const track = document.createElement('div');
  track.className = 'tools-track';

  cardRows.forEach((row) => {
    const nameEl  = cell(row, 0);
    const bodyEl  = cell(row, 1);
    const urlEl   = cell(row, 2);

    // Determine href
    let href = '#';
    if (urlEl) {
      const anchor = urlEl.querySelector('a');
      href = anchor ? anchor.href : urlEl.textContent.trim() || '#';
    }

    const card = document.createElement('article');
    card.className = 'tool-card';

    if (nameEl) {
      const nameWrap = document.createElement('div');
      nameWrap.className = 'tool-name';
      const h3 = document.createElement('h3');
      h3.className = 't-title-4';
      h3.innerHTML = nameEl.innerHTML;
      nameWrap.appendChild(h3);
      card.appendChild(nameWrap);
    }

    if (bodyEl) {
      const body = document.createElement('p');
      body.className = 'tool-body t-body-s';
      body.innerHTML = bodyEl.innerHTML;
      card.appendChild(body);
    }

    // Arrow link
    const arrow = document.createElement('a');
    arrow.className = 'arrow';
    arrow.href = href;
    arrow.setAttribute('aria-hidden', 'true');
    arrow.tabIndex = -1;
    arrow.innerHTML = '&rarr;';
    card.appendChild(arrow);

    // Make the entire card clickable
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => { window.location.href = href; });

    track.appendChild(card);
  });

  block.replaceChildren(header, track);
}
