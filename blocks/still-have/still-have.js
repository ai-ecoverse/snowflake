/**
 * still-have — contact CTA grid on dark shelter background.
 *
 * Authoring rows (positional):
 *   Row 1, 1 cell  — section heading (should be an <h2>)
 *   Row 2+, 3 cells — contact card: eyebrow | heading | link
 *
 * Example:
 *   | Still have questions?         |
 *   | Call    | Main office         | 801-359-4142 (tel: link)  |
 *   | Email   | General inquiries   | info@theroadhome.org      |
 *   | Visit   | Resource centers    | Addresses & hours →       |
 */

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Row 0: section heading
  const headingCell = rows[0]?.firstElementChild;
  const headingEl = headingCell?.querySelector('h2') || document.createElement('h2');
  if (!headingCell?.querySelector('h2')) {
    headingEl.textContent = headingCell?.textContent?.trim() || '';
  }

  // Inner wrapper
  const inner = document.createElement('div');
  inner.className = 'still-have-inner';
  inner.append(headingEl);

  // Contact cards grid
  const grid = document.createElement('div');
  grid.className = 'still-grid';

  for (let i = 1; i < rows.length; i++) {
    const cells = [...rows[i].children];
    if (cells.length < 3) continue;

    const card = document.createElement('div');
    card.className = 'still-card';

    const eyebrow = document.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = cells[0].textContent.trim();

    const h3 = cells[1].querySelector('h3') || document.createElement('h3');
    if (!cells[1].querySelector('h3')) {
      h3.textContent = cells[1].textContent.trim();
    }

    // Link cell — clone child nodes to preserve anchor href/text
    const linkCell = cells[2];
    const linkFrag = document.createDocumentFragment();
    [...linkCell.childNodes].forEach((n) => linkFrag.append(n.cloneNode(true)));

    card.append(eyebrow, h3, linkFrag);
    grid.append(card);
  }

  inner.append(grid);
  block.replaceChildren(inner);
}
