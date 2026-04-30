/**
 * contact-strip — Dark (shelter-teal) band with heading and 3-column contact cards.
 *
 * Authoring rows (positional):
 *   Row 1: Section heading (e.g. "Still have questions?")
 *   Row 2+: Contact cards, each with three cells:
 *     Cell 1: Card eyebrow (e.g. "Call")
 *     Cell 2: Card heading (e.g. "Main office")
 *     Cell 3: Contact link (phone, email, or page link)
 */

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const headingCell = rows[0]?.firstElementChild;
  const cardRows = rows.slice(1);

  const inner = document.createElement('div');
  inner.className = 'contact-strip-inner';

  if (headingCell) {
    const h2 = document.createElement('h2');
    const src = headingCell.querySelector('h1,h2,h3');
    h2.innerHTML = src ? src.innerHTML : headingCell.textContent.trim();
    inner.append(h2);
  }

  const grid = document.createElement('div');
  grid.className = 'contact-grid';

  cardRows.forEach((row) => {
    const cells = [...row.children];
    const eyebrowText = cells[0]?.textContent.trim();
    const cardHeadingText = cells[1]?.textContent.trim();
    const linkCell = cells[2];

    const card = document.createElement('div');
    card.className = 'contact-card';

    if (eyebrowText) {
      const eyebrow = document.createElement('p');
      eyebrow.className = 'eyebrow';
      eyebrow.textContent = eyebrowText;
      card.append(eyebrow);
    }

    if (cardHeadingText) {
      const h3 = document.createElement('h3');
      h3.textContent = cardHeadingText;
      card.append(h3);
    }

    if (linkCell) {
      // Clone all child nodes (preserves <a> tags with href intact)
      [...linkCell.childNodes].forEach((n) => card.append(n.cloneNode(true)));
    }

    grid.append(card);
  });

  inner.append(grid);
  block.replaceChildren(inner);
}
