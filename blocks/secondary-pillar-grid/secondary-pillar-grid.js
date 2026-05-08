/**
 * secondary-pillar-grid — 4-card perks grid (Local, Advertising, AI PR, Social)
 *
 * Authoring rows (positional):
 *   1. Eyebrow text
 *   2. h2 headline
 *   3..N Card rows — 3 cells: title | tagline | body
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Row 0: eyebrow
  const eyebrowText = rows[0]?.firstElementChild?.textContent?.trim() || '';

  // Row 1: headline
  const headlineEl = rows[1]?.firstElementChild;

  // Rows 2+: card rows
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

  // Perks row
  const perksRow = document.createElement('div');
  perksRow.className = 'perks-row';

  cardRows.forEach((row) => {
    const cells = [...row.children];
    const titleEl = cells[0];
    const taglineEl = cells[1];
    const bodyEl = cells[2];

    const card = document.createElement('article');
    card.className = 'perk-card';

    if (titleEl) {
      const h3 = document.createElement('h3');
      h3.className = 'perk-title t-title-4';
      h3.innerHTML = titleEl.innerHTML;
      card.appendChild(h3);
    }

    if (taglineEl) {
      const tagline = document.createElement('p');
      tagline.className = 'perk-body t-body-m';
      tagline.innerHTML = taglineEl.innerHTML;
      card.appendChild(tagline);
    }

    if (bodyEl) {
      const body = document.createElement('div');
      body.className = 'perk-body-detail';
      body.innerHTML = bodyEl.innerHTML;
      card.appendChild(body);
    }

    perksRow.appendChild(card);
  });

  block.replaceChildren(header, perksRow);
}
