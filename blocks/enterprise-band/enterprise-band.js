/**
 * enterprise-band — dark full-bleed CTA band
 *
 * Authoring rows (positional):
 *   1. Eyebrow text
 *   2. h2 headline
 *   3. Body paragraph (or placeholder)
 *   4. CTAs — <em><a> for ghost-white buttons
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
  inner.className = 'enterprise-inner';

  if (eyebrowText) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 't-eyebrow';
    eyebrow.textContent = eyebrowText;
    inner.appendChild(eyebrow);
  }

  if (headlineEl) {
    const h2 = document.createElement('h2');
    h2.className = 't-title-2';
    h2.innerHTML = headlineEl.innerHTML;
    inner.appendChild(h2);
  }

  if (bodyEl) {
    const body = document.createElement('div');
    body.className = 'body';
    body.innerHTML = bodyEl.innerHTML;
    inner.appendChild(body);
  }

  if (ctaCell && ctaCell.querySelector('a')) {
    const ctas = document.createElement('div');
    ctas.className = 'enterprise-ctas';
    [...ctaCell.childNodes].forEach((n) => ctas.append(n.cloneNode(true)));
    inner.appendChild(ctas);
  }

  block.replaceChildren(inner);
}
