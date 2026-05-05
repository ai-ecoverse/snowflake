/**
 * Departments block — "Three reads from each topic" — 3-col grid of 6 departments.
 *
 * Authoring: 6 rows, each row = one department.
 *   Cell A: label text, prefixed with variant hint:
 *           "ai:A · Artificial Intelligence"  or just "A · Artificial Intelligence"
 *           Variant prefix: "ai:", "workplace:", "neutral:", "default:"
 *           If no prefix, variant is inferred from label text.
 *   Cell B: <ul><li><a href="...">Article headline</a></li>…</ul>
 */

function detectVariant(text) {
  const t = text.toLowerCase();
  // Explicit prefix
  if (t.startsWith('ai:')) return { variant: 'ai', label: text.slice(3).trim() };
  if (t.startsWith('workplace:')) return { variant: 'workplace', label: text.slice(10).trim() };
  if (t.startsWith('neutral:')) return { variant: 'neutral', label: text.slice(8).trim() };
  // Infer
  if (t.includes('artificial intelligence') || t.includes(' ai ') || t.startsWith('ai')) return { variant: 'ai', label: text };
  if (t.includes('workplace') || t.includes('hybrid')) return { variant: 'workplace', label: text };
  if (t.includes('dell tech')) return { variant: 'neutral', label: text };
  return { variant: '', label: text };
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  block.innerHTML = '';

  const outer = document.createElement('div');
  outer.className = 'ds-container';

  // Section head
  const secHead = document.createElement('div');
  secHead.className = 'ds-section-head';
  const secHeadInner = document.createElement('div');
  const ew = document.createElement('span');
  ew.className = 'ds-eyebrow';
  ew.textContent = 'Inside each section';
  const h2 = document.createElement('h2');
  h2.textContent = 'Three reads from each topic';
  secHeadInner.append(ew, h2);
  secHead.append(secHeadInner);
  outer.append(secHead);

  const grid = document.createElement('div');
  grid.className = 'ds-dept-grid';

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (cells.length < 2) return;

    const labelCell = cells[0];
    const listCell = cells[1];

    // Parse label
    const rawLabel = labelCell.textContent.trim();
    const { variant, label } = detectVariant(rawLabel);

    const dept = document.createElement('div');
    dept.className = 'ds-department';

    // Label bar
    const labelEl = document.createElement('span');
    labelEl.className = `ds-dept-label${variant ? ` ds-dept-label--${variant}` : ''}`;

    // Extract num prefix (e.g. "A", "01") — first word before · or space
    const labelParts = label.split(/[·\s]/).map((s) => s.trim()).filter(Boolean);
    if (labelParts.length > 1) {
      const numSpan = document.createElement('span');
      numSpan.className = 'ds-dept-num';
      numSpan.textContent = labelParts[0];
      labelEl.append(numSpan);
      labelEl.append(document.createTextNode(' ' + labelParts.slice(1).join(' ')));
    } else {
      labelEl.textContent = label;
    }

    dept.append(labelEl);

    // Article list
    const srcList = listCell.querySelector('ul');
    const ul = document.createElement('ul');
    ul.className = 'ds-dept-list';

    const items = srcList
      ? [...srcList.querySelectorAll('li')]
      : [...listCell.querySelectorAll('a')].map((a) => {
          const li = document.createElement('li');
          li.append(a.cloneNode(true));
          return li;
        });

    items.forEach((srcLi) => {
      const li = document.createElement('li');
      li.className = 'ds-dept-item';

      const anchor = srcLi.querySelector('a');
      const h3 = document.createElement('h3');
      if (anchor) {
        const a = document.createElement('a');
        a.href = anchor.href;
        a.textContent = anchor.textContent.trim();
        h3.append(a);
      } else {
        h3.textContent = srcLi.textContent.trim();
      }
      li.append(h3);
      ul.append(li);
    });

    dept.append(ul);
    grid.append(dept);
  });

  outer.append(grid);
  block.append(outer);
}
