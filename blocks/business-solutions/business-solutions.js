/**
 * business-solutions — 3-up business solutions cards (white background).
 *
 * Authoring rows (positional):
 *   1. Section headline (h2)
 *   2. Section body paragraph
 *   3–N. Card rows, each with 4 cells: image | title | body | CTA link
 */

const ARROW_SVG = `<svg viewBox="0 0 6 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 1L5 6L1 11"/></svg>`;

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const titleCell = rows[0]?.firstElementChild;
  const bodyCell  = rows[1]?.firstElementChild;
  const cardRows  = rows.slice(2);

  // ── Section header ────────────────────────────────────────────────────────
  const header = document.createElement('div');
  header.className = 'acrobat-feature__header';

  if (titleCell) {
    const h2 = document.createElement('h2');
    h2.className = 'title-2 acrobat-feature__title';
    h2.textContent = titleCell.textContent.trim();
    header.append(h2);
  }

  if (bodyCell) {
    const p = document.createElement('p');
    p.className = 'body-md acrobat-feature__body';
    p.textContent = bodyCell.textContent.trim();
    header.append(p);
  }

  // ── Cards ─────────────────────────────────────────────────────────────────
  const cardsGrid = document.createElement('div');
  cardsGrid.className = 'acrobat-cards';

  cardRows.forEach((row) => {
    const cells = [...row.children];
    const imgCell   = cells[0];
    const titleText = cells[1]?.textContent.trim() || '';
    const bodyText  = cells[2]?.textContent.trim() || '';
    const ctaCell   = cells[3];

    const card = document.createElement('div');
    card.className = 'acrobat-card';

    // Asset
    const asset = document.createElement('div');
    asset.className = 'acrobat-card__asset';
    const img = imgCell?.querySelector('img');
    if (img) {
      const photo = img.cloneNode(true);
      photo.className = 'acrobat-card__photo';
      asset.append(photo);
    }
    card.append(asset);

    // Copy
    const copy = document.createElement('div');
    copy.className = 'acrobat-card__copy';

    const text = document.createElement('div');
    text.className = 'acrobat-card__text';

    const title = document.createElement('p');
    title.className = 'acrobat-card__title';
    title.textContent = titleText;

    const body = document.createElement('p');
    body.className = 'acrobat-card__body';
    body.textContent = bodyText;

    text.append(title, body);
    copy.append(text);

    if (ctaCell?.querySelector('a')) {
      const a = ctaCell.querySelector('a').cloneNode(true);
      a.className = 'acrobat-cta';
      a.innerHTML = `${a.textContent.trim()} ${ARROW_SVG}`;
      copy.append(a);
    }

    card.append(copy);
    cardsGrid.append(card);
  });

  block.replaceChildren(header, cardsGrid);
}
