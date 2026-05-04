/**
 * architecture-spec — 5/7 split: left photo, right h3 + spec list + ghost CTA.
 * Authoring rows:
 *   1: Section heading
 *   2: Architecture photo (picture element)
 *   3: h3 title
 *   4 to N-1: Spec rows — Cell 1=label, Cell 2=value
 *   Last row: CTA link (clone child nodes)
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const fragments = [];

  // Row 1 — section heading
  if (rows[0]) {
    const heading = document.createElement('h2');
    heading.textContent = rows[0].firstElementChild?.textContent.trim() ?? '';
    fragments.push(heading);
  }

  // Detect last row as CTA (single cell with an anchor inside, or just link text)
  // We'll consider the last row to be CTA if row count > 3
  const archBlock = document.createElement('div');
  archBlock.className = 'arch-block';

  // Left: photo
  const photoWrap = document.createElement('div');
  photoWrap.className = 'arch-block-photo';
  const picture = rows[1]?.querySelector('picture, img');
  if (picture) photoWrap.append(picture);

  // Right: body
  const body = document.createElement('div');
  body.className = 'arch-block-body';

  const h3 = document.createElement('h3');
  h3.textContent = rows[2]?.firstElementChild?.textContent.trim() ?? '';
  body.append(h3);

  // Rows 3 to len-2 are spec rows; last row is CTA
  const specRows = rows.slice(3, rows.length - 1);
  const ctaRow = rows[rows.length - 1];

  if (specRows.length > 0) {
    const specList = document.createElement('ul');
    specList.className = 'arch-block-specs';

    specRows.forEach((row) => {
      const cells = [...row.children];
      const labelText = cells[0]?.textContent.trim() ?? '';
      const valueText = cells[1]?.textContent.trim() ?? '';

      const li = document.createElement('li');

      const labelEl = document.createElement('span');
      labelEl.className = 'spec-label';
      labelEl.textContent = labelText;

      const valueEl = document.createElement('span');
      valueEl.className = 'spec-value';
      valueEl.textContent = valueText;

      li.append(labelEl, valueEl);
      specList.append(li);
    });

    body.append(specList);
  }

  // CTA row — clone child nodes
  if (ctaRow) {
    const ctaCell = ctaRow.firstElementChild;
    if (ctaCell) {
      const ctaWrap = document.createElement('div');
      ctaWrap.className = 'actions';
      [...ctaCell.childNodes].forEach((node) => ctaWrap.append(node.cloneNode(true)));
      body.append(ctaWrap);
    }
  }

  archBlock.append(photoWrap, body);
  fragments.push(archBlock);

  block.replaceChildren(...fragments);
}
