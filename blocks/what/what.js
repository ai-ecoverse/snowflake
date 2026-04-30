/**
 * What block
 * Authoring rows (positional):
 *   1. h2 heading
 *   2. paragraph 1
 *   3. paragraph 2
 *   4. paragraph 3
 *   5. sidebar eyebrow (single cell)
 *   6+. sidebar rows: 2 cells each [label (dt) | value (dd)]
 */
export default async function decorate(block) {
  const rows = [...block.children];

  // --- Main content (rows 0-3) ---
  const h2Text = rows[0]?.querySelector('p, div, h2')?.textContent?.trim() ?? '';
  const p1Text = rows[1]?.querySelector('p, div')?.textContent?.trim() ?? '';
  const p2Text = rows[2]?.querySelector('p, div')?.textContent?.trim() ?? '';
  const p3Text = rows[3]?.querySelector('p, div')?.textContent?.trim() ?? '';

  const main = document.createElement('div');
  main.className = 'what-main';

  const h2 = document.createElement('h2');
  h2.textContent = h2Text;

  [p1Text, p2Text, p3Text].forEach((text) => {
    const p = document.createElement('p');
    p.textContent = text;
    main.append(p);
  });
  main.prepend(h2);

  // --- Sidebar (rows 4+) ---
  const aside = document.createElement('aside');
  aside.className = 'what-side';

  // Row 4: eyebrow (single cell or first cell)
  const eyebrowText = rows[4]?.querySelector('p, div')?.textContent?.trim() ?? '';
  if (eyebrowText) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = eyebrowText;
    aside.append(eyebrow);
  }

  // Rows 5+: dl entries
  if (rows.length > 5) {
    const dl = document.createElement('dl');
    rows.slice(5).forEach((row) => {
      const cells = [...row.children];
      const labelText = cells[0]?.textContent?.trim() ?? '';
      const valueText = cells[1]?.textContent?.trim() ?? '';
      const dt = document.createElement('dt');
      dt.textContent = labelText;
      const dd = document.createElement('dd');
      dd.textContent = valueText;
      dl.append(dt, dd);
    });
    aside.append(dl);
  }

  // --- Assemble ---
  const inner = document.createElement('div');
  inner.className = 'what-inner';
  inner.append(main, aside);

  block.replaceChildren(inner);
}
