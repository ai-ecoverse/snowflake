/**
 * Partner block
 * Authoring rows (positional):
 *   1. eyebrow
 *   2. h2
 *   3. paragraph 1
 *   4. paragraph 2 (may contain link)
 *   5. CTA — cell contains <strong><a> or plain <a>
 *   6+. stat rows: 2 cells each [number | label]
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const eyebrowText = rows[0]?.querySelector('p, div')?.textContent?.trim() ?? '';
  const headingText = rows[1]?.querySelector('p, div, h2')?.textContent?.trim() ?? '';
  const p1Text = rows[2]?.querySelector('p, div')?.textContent?.trim() ?? '';

  // Paragraph 2 — preserve inline link if present
  const p2Cell = rows[3]?.querySelector('p, div');
  const p2 = document.createElement('p');
  if (p2Cell) {
    p2.innerHTML = p2Cell.innerHTML;
  }

  // CTA — clone the anchor
  const ctaAnchor = rows[4]?.querySelector('a');
  let cta = null;
  if (ctaAnchor) {
    cta = ctaAnchor.cloneNode(true);
    cta.className = 'partner-cta';
  }

  // Left column
  const left = document.createElement('div');
  left.className = 'partner-left';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = eyebrowText;

  const h2 = document.createElement('h2');
  h2.textContent = headingText;

  const p1 = document.createElement('p');
  p1.textContent = p1Text;

  left.append(eyebrow, h2, p1, p2);
  if (cta) left.append(cta);

  // Right column: stats grid
  const stats = document.createElement('div');
  stats.className = 'stats';

  rows.slice(5).forEach((row) => {
    const cells = [...row.children];
    const num = cells[0]?.textContent?.trim() ?? '';
    const label = cells[1]?.textContent?.trim() ?? '';

    const cell = document.createElement('div');
    cell.className = 'stat';

    const n = document.createElement('p');
    n.className = 'n';
    n.textContent = num;

    const l = document.createElement('p');
    l.className = 'label';
    l.textContent = label;

    cell.append(n, l);
    stats.append(cell);
  });

  const inner = document.createElement('div');
  inner.className = 'partner-inner';
  inner.append(left, stats);

  block.replaceChildren(inner);
}
