/**
 * closing-cta — final ink-dark CTA section
 *
 * Authoring rows (positional):
 *   1. Eyebrow text
 *   2. h2 headline
 *   3. Body paragraph (trial terms)
 *   4. CTA — <strong><a> for primary
 *
 * Button convention: clone cell children into .actions — do NOT manufacture anchors.
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const cell = (row) => row?.firstElementChild;

  const eyebrowText = cell(rows[0])?.textContent?.trim() || '';
  const headlineEl  = cell(rows[1]);
  const bodyEl      = cell(rows[2]);
  const ctaCell     = cell(rows[3]);

  const inner = document.createElement('div');
  inner.className = 'closing-inner';

  if (eyebrowText) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 't-eyebrow';
    eyebrow.textContent = eyebrowText;
    inner.appendChild(eyebrow);
  }

  if (headlineEl) {
    const h2 = document.createElement('h2');
    h2.className = 't-title-1';
    h2.innerHTML = headlineEl.innerHTML;
    inner.appendChild(h2);
  }

  if (bodyEl) {
    const body = document.createElement('div');
    body.className = 'closing-body';
    body.innerHTML = bodyEl.innerHTML;
    inner.appendChild(body);
  }

  if (ctaCell && ctaCell.querySelector('a')) {
    const actions = document.createElement('div');
    actions.className = 'actions';
    [...ctaCell.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
    inner.appendChild(actions);
  }

  block.replaceChildren(inner);
}
