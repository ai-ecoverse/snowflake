/**
 * acrobat-feature — business solutions 3-up cards
 *
 * Authoring rows (positional):
 *   1. title (h2)
 *   2. body paragraph
 *   3–5. card rows (each row: image | title | body | CTA link)
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const wrap = document.createElement('div');
  wrap.className = 'container';

  // Header
  const header = document.createElement('div');
  header.className = 'acrobat-feature__header';

  const titleCell = rows[0]?.firstElementChild;
  if (titleCell) {
    const h = titleCell.querySelector('h1,h2,h3') || document.createElement('h2');
    if (!h.parentNode) h.textContent = titleCell.textContent.trim();
    h.className = 'title-2 acrobat-feature__title';
    header.append(h.cloneNode(true));
  }

  const bodyCell = rows[1]?.firstElementChild;
  if (bodyCell) {
    const p = document.createElement('p');
    p.className = 'body-md acrobat-feature__body';
    p.textContent = bodyCell.textContent.trim();
    header.append(p);
  }
  wrap.append(header);

  // Cards
  const cards = document.createElement('div');
  cards.className = 'acrobat-cards';

  rows.slice(2).forEach(row => {
    const cells = [...row.children];
    const imgCell = cells[0];
    const cardTitle = cells[1]?.textContent.trim();
    const cardBody = cells[2]?.textContent.trim();
    const ctaLink = cells[3]?.querySelector('a');

    const card = document.createElement('div');
    card.className = 'acrobat-card';

    const asset = document.createElement('div');
    asset.className = 'acrobat-card__asset';
    const pic = imgCell?.querySelector('picture, img');
    if (pic) {
      const img = pic.cloneNode(true);
      if (img.tagName === 'IMG') img.className = 'acrobat-card__photo';
      asset.append(img);
    }
    card.append(asset);

    const copy = document.createElement('div');
    copy.className = 'acrobat-card__copy';
    const text = document.createElement('div');
    text.className = 'acrobat-card__text';
    const t = document.createElement('p');
    t.className = 'acrobat-card__title';
    t.textContent = cardTitle;
    const b = document.createElement('p');
    b.className = 'acrobat-card__body';
    b.textContent = cardBody;
    text.append(t, b);
    copy.append(text);

    if (ctaLink) {
      const a = ctaLink.cloneNode(true);
      a.className = 'acrobat-cta';
      a.innerHTML = `${ctaLink.textContent.trim()} <svg viewBox="0 0 6 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 1L5 6L1 11"/></svg>`;
      copy.append(a);
    }
    card.append(copy);
    cards.append(card);
  });

  wrap.append(cards);
  block.replaceChildren(wrap);
}
