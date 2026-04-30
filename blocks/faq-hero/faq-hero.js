/**
 * faq-hero — FAQ page hero with eyebrow, h1, and subtitle.
 *
 * Authoring rows (positional):
 *   1. eyebrow text (e.g. "Help · FAQ")
 *   2. <h1> headline
 *   3. subtitle paragraph
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
    const heading = headlineCell.querySelector('h1') || document.createElement('h1');
    if (!headlineCell.querySelector('h1')) {
      heading.textContent = headlineCell.textContent.trim();
    }
    inner.append(heading);
  }

  if (subCell) {
    const sub = document.createElement('p');
    sub.className = 'sub';
    [...subCell.childNodes].forEach((n) => sub.append(n.cloneNode(true)));
    inner.append(sub);
  }

  block.replaceChildren(inner);
}
