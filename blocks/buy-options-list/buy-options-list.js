/**
 * buy-options-list — Retailer routing buy list.
 * Authoring rows:
 *   1: Section heading
 *   2+: Retailer rows — Cell 1=retailer name, Cell 2=price text, Cell 3=CTA link (clone child nodes)
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const fragments = [];

  // Row 1 — heading
  if (rows[0]) {
    const heading = document.createElement('h2');
    heading.textContent = rows[0].firstElementChild?.textContent.trim() ?? '';
    fragments.push(heading);
  }

  const ul = document.createElement('ul');
  ul.className = 'buy-options';

  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    const nameText = cells[0]?.textContent.trim() ?? '';
    const priceText = cells[1]?.textContent.trim() ?? '';
    const ctaCell = cells[2];

    const li = document.createElement('li');
    li.className = 'buy-option';

    const nameEl = document.createElement('span');
    nameEl.className = 'buy-option-name';
    nameEl.textContent = nameText;

    const priceEl = document.createElement('span');
    priceEl.className = 'buy-option-price';
    priceEl.textContent = priceText;

    const ctaWrap = document.createElement('div');
    if (ctaCell) {
      [...ctaCell.childNodes].forEach((node) => ctaWrap.append(node.cloneNode(true)));
    }

    li.append(nameEl, priceEl, ctaWrap);
    ul.append(li);
  });

  fragments.push(ul);
  block.replaceChildren(...fragments);
}
