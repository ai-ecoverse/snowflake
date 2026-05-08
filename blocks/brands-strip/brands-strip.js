/**
 * brands-strip — Customer logos strip (white background).
 *
 * Authoring rows (positional):
 *   1.   Headline
 *   2.   Logo name row — each cell is one brand name
 *   Last row: CTA link (if it contains an <a>)
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const headCell = rows[0]?.firstElementChild;

  // Last row is CTA if it has an anchor
  const lastRow = rows[rows.length - 1];
  const hasCta  = lastRow?.querySelector('a');
  const logoRows = hasCta ? rows.slice(1, -1) : rows.slice(1);
  const ctaRow   = hasCta ? lastRow : null;

  // ── Headline ───────────────────────────────────────────────────────────────
  const h2 = document.createElement('h2');
  h2.className = 'brands-strip__title';
  h2.textContent = headCell?.textContent.trim() || '';

  // ── Logo row ───────────────────────────────────────────────────────────────
  const row = document.createElement('div');
  row.className = 'brands-strip__row';

  logoRows.forEach((logoRow) => {
    [...logoRow.children].forEach((cell) => {
      const logo = document.createElement('span');
      logo.className = 'brands-strip__logo';
      logo.textContent = cell.textContent.trim();
      row.append(logo);
    });
  });

  // ── Footer CTA ─────────────────────────────────────────────────────────────
  block.replaceChildren(h2, row);

  if (ctaRow) {
    const foot = document.createElement('div');
    foot.className = 'brands-strip__foot';
    const a = ctaRow.querySelector('a');
    if (a) {
      const clone = a.cloneNode(true);
      if (!clone.className) clone.className = 'btn btn--outline';
      foot.append(clone);
    }
    block.append(foot);
  }
}
