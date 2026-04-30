/**
 * faq-hero — Page hero for the FAQ page
 *
 * Authoring rows (positional):
 *   1. Eyebrow text (e.g. "Help · FAQ")
 *   2. H1 headline
 *   3. Subheading paragraph
 */

function text(cell) { return cell ? cell.textContent.trim() : ''; }

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const eyebrowText = text(rows[0]?.firstElementChild);
  const headlineEl = rows[1]?.firstElementChild;
  const subEl = rows[2]?.firstElementChild;

  const inner = document.createElement('div');
  inner.className = 'faq-hero-inner';

  if (eyebrowText) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = eyebrowText;
    inner.append(eyebrow);
  }

  if (headlineEl) {
    const h1 = headlineEl.querySelector('h1') || document.createElement('h1');
    if (!headlineEl.querySelector('h1')) h1.textContent = text(headlineEl);
    inner.append(h1);
  }

  if (subEl) {
    const sub = document.createElement('p');
    sub.className = 'sub';
    sub.textContent = text(subEl);
    inner.append(sub);
  }

  block.replaceChildren(inner);
}
