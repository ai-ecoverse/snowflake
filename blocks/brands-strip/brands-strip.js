/**
 * brands-strip — customer logos + CTA
 *
 * Authoring rows (positional):
 *   1. section title (h2)
 *   2. logos — one per cell in the row
 *   3. CTA link
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const wrap = document.createElement('div');
  wrap.className = 'container';

  const titleCell = rows[0]?.firstElementChild;
  if (titleCell) {
    const h = document.createElement('h2');
    h.className = 'brands-strip__title';
    h.textContent = titleCell.textContent.trim();
    wrap.append(h);
  }

  const logosRow = rows[1];
  if (logosRow) {
    const row = document.createElement('div');
    row.className = 'brands-strip__row';
    [...logosRow.children].forEach(cell => {
      const span = document.createElement('span');
      span.className = 'brands-strip__logo';
      span.textContent = cell.textContent.trim();
      row.append(span);
    });
    wrap.append(row);
  }

  const ctaCell = rows[2]?.firstElementChild;
  if (ctaCell && ctaCell.querySelector('a')) {
    const foot = document.createElement('div');
    foot.className = 'brands-strip__foot';
    [...ctaCell.childNodes].forEach(n => foot.append(n.cloneNode(true)));
    wrap.append(foot);
  }

  block.replaceChildren(wrap);
}
