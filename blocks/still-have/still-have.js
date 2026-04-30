/**
 * still-have — "Still have questions?" contact CTA band
 *
 * Authoring rows (positional):
 *   1. Section heading (e.g. "Still have questions?")
 *   2+ Contact card rows, each with two cells:
 *        Cell 1: eyebrow | card title (pipe-separated, or two paragraphs)
 *        Cell 2: contact link (<a href="tel:…"> or <a href="mailto:…"> or regular link)
 *
 * Example authoring:
 *   | Still have questions? |
 *   | Call | Main office | 801-359-4142 |
 *   | Email | General inquiries | info@theroadhome.org |
 *   | Visit | Resource centers | Addresses & hours → |
 *
 *   Each card row: 3 cells → eyebrow | title | link text/url
 *   OR 2 cells → "eyebrow\ntitle" | link
 */

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const headingCell = rows[0]?.firstElementChild;
  const cardRows = rows.slice(1);

  const inner = document.createElement('div');
  inner.className = 'still-have-inner';

  if (headingCell) {
    const h2 = headingCell.querySelector('h2') || document.createElement('h2');
    if (!headingCell.querySelector('h2')) h2.textContent = headingCell.textContent.trim();
    inner.append(h2.cloneNode ? h2.cloneNode(true) : h2);
  }

  const grid = document.createElement('div');
  grid.className = 'still-grid';

  cardRows.forEach((row) => {
    const cells = [...row.children];
    const card = document.createElement('div');
    card.className = 'still-card';

    if (cells.length >= 3) {
      // 3-cell: eyebrow | title | link
      const eyebrow = document.createElement('p');
      eyebrow.className = 'eyebrow';
      eyebrow.textContent = cells[0].textContent.trim();
      card.append(eyebrow);

      const h3 = document.createElement('h3');
      h3.textContent = cells[1].textContent.trim();
      card.append(h3);

      const linkEl = cells[2].querySelector('a');
      if (linkEl) {
        const a = linkEl.cloneNode(true);
        card.append(a);
      } else {
        const p = document.createElement('p');
        p.textContent = cells[2].textContent.trim();
        card.append(p);
      }
    } else if (cells.length === 2) {
      // 2-cell: eyebrow\ntitle | link
      const labelText = cells[0].textContent.trim();
      const lines = labelText.split('\n').map((l) => l.trim()).filter(Boolean);
      if (lines.length >= 1) {
        const eyebrow = document.createElement('p');
        eyebrow.className = 'eyebrow';
        eyebrow.textContent = lines[0];
        card.append(eyebrow);
      }
      if (lines.length >= 2) {
        const h3 = document.createElement('h3');
        h3.textContent = lines[1];
        card.append(h3);
      }
      const linkEl = cells[1].querySelector('a');
      if (linkEl) card.append(linkEl.cloneNode(true));
    }

    grid.append(card);
  });

  inner.append(grid);
  block.replaceChildren(inner);
}
