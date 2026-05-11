/**
 * closing-cta — Full-bleed closing CTA section
 *
 * Authoring rows (positional):
 *   1. eyebrow (optional — standard variant only)
 *   2. h2 headline (use <em> to wrap accent word like "TODAY")
 *   3. body paragraph
 *   4. CTA link (wrap in <strong><a> for primary button)
 */

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  function cell(row) { return row?.firstElementChild || null; }

  // Detect if first row is an eyebrow (short text, no block elements)
  let eyebrowRow = null;
  let offset = 0;
  const firstCell = cell(rows[0]);
  if (firstCell && !firstCell.querySelector('h1,h2,h3,a') && firstCell.textContent.trim().length < 60) {
    eyebrowRow = rows[0];
    offset = 1;
  }

  const headlineRow = rows[offset];
  const bodyRow = rows[offset + 1];
  const ctaRow = rows[offset + 2];

  const inner = document.createElement('div');
  inner.className = 'closing-inner';

  if (eyebrowRow) {
    const p = document.createElement('p');
    p.className = 't-eyebrow';
    p.textContent = cell(eyebrowRow)?.textContent.trim() || '';
    inner.append(p);
  }

  if (headlineRow) {
    const h2 = document.createElement('h2');
    h2.className = 't-title-1 is-upper';
    h2.innerHTML = cell(headlineRow)?.innerHTML || '';
    // Convert <em> to .accent span
    h2.querySelectorAll('em').forEach((em) => {
      const span = document.createElement('span');
      span.className = 'accent';
      span.textContent = em.textContent;
      em.replaceWith(span);
    });
    inner.append(h2);
  }

  if (bodyRow) {
    const p = document.createElement('p');
    p.className = 'body t-body-m';
    p.innerHTML = cell(bodyRow)?.innerHTML || '';
    inner.append(p);
  }

  if (ctaRow) {
    const ctaCell = cell(ctaRow);
    if (ctaCell) {
      [...ctaCell.childNodes].forEach((n) => inner.append(n.cloneNode(true)));
    }
  }

  block.replaceChildren(inner);
}
