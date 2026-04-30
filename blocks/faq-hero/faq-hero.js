/**
 * faq-hero — Page hero for the FAQ page
 *
 * Authoring rows (positional):
 *   1. Eyebrow text (e.g. "Help · FAQ")
 *   2. <h1> headline
 *   3. Subheading paragraph
 */

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const eyebrowCell = rows[0]?.firstElementChild;
  const headlineCell = rows[1]?.firstElementChild;
  const subCell = rows[2]?.firstElementChild;

  const inner = document.createElement('div');
  inner.className = 'faq-hero-inner';

  if (eyebrowCell) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = eyebrowCell.textContent.trim();
    inner.append(eyebrow);
  }

  if (headlineCell) {
    const h1 = headlineCell.querySelector('h1') || document.createElement('h1');
    if (!headlineCell.querySelector('h1')) h1.textContent = headlineCell.textContent.trim();
    inner.append(h1.cloneNode ? h1.cloneNode(true) : h1);
  }

  if (subCell) {
    const sub = document.createElement('p');
    sub.className = 'sub';
    sub.textContent = subCell.textContent.trim();
    inner.append(sub);
  }

  block.replaceChildren(inner);
}
