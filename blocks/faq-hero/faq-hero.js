/**
 * faq-hero — Page hero for FAQ, with eyebrow, large heading, and subtext.
 *
 * Authoring rows (positional):
 *   1. Eyebrow text (e.g. "Help · FAQ")
 *   2. <h1> heading
 *   3. Subtext paragraph
 */

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const eyebrowCell = rows[0]?.firstElementChild;
  const headingCell = rows[1]?.firstElementChild;
  const subCell = rows[2]?.firstElementChild;

  const inner = document.createElement('div');
  inner.className = 'faq-hero-inner';

  if (eyebrowCell) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = eyebrowCell.textContent.trim();
    inner.append(eyebrow);
  }

  if (headingCell) {
    // Preserve authored heading tag (h1) or promote to h1
    const h = headingCell.querySelector('h1,h2,h3') || document.createElement('h1');
    if (!h.parentElement) h.textContent = headingCell.textContent.trim();
    h.tagName !== 'H1' && h.replaceWith(Object.assign(document.createElement('h1'), { innerHTML: h.innerHTML }));
    inner.append(headingCell.querySelector('h1') || h);
  }

  if (subCell) {
    const sub = document.createElement('p');
    sub.className = 'sub';
    sub.innerHTML = subCell.innerHTML;
    inner.append(sub);
  }

  block.replaceChildren(inner);
}
