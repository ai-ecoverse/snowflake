/**
 * enterprise-band — Dark full-bleed enterprise CTA section
 *
 * Authoring rows (positional):
 *   1. eyebrow text (e.g. "Enterprise")
 *   2. h2 headline
 *   3. body paragraph
 *   4. CTA link (plain <a> — styled as ghost-white by block CSS)
 */

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  function cell(row) { return row?.firstElementChild || null; }

  const inner = document.createElement('div');
  inner.className = 'enterprise-inner';

  const [eyebrowRow, headlineRow, bodyRow, ctaRow] = rows;

  if (eyebrowRow) {
    const p = document.createElement('p');
    p.className = 't-eyebrow';
    p.textContent = cell(eyebrowRow)?.textContent.trim() || '';
    inner.append(p);
  }

  if (headlineRow) {
    const h2 = document.createElement('h2');
    h2.className = 't-title-2';
    h2.innerHTML = cell(headlineRow)?.innerHTML || '';
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
