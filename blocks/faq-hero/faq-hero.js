/**
 * faq-hero — Page hero for the FAQ / help section.
 *
 * Authoring rows (positional):
 *   1. Eyebrow text  (e.g. "Help · FAQ")
 *   2. <h1> headline
 *   3. Sub-headline paragraph
 */

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const eyebrow = rows[0]?.firstElementChild;
  const heading = rows[1]?.firstElementChild;
  const sub     = rows[2]?.firstElementChild;

  const inner = document.createElement('div');
  inner.className = 'faq-hero-inner';

  if (eyebrow) {
    const p = document.createElement('p');
    p.className = 'eyebrow';
    p.textContent = eyebrow.textContent.trim();
    inner.append(p);
  }

  if (heading) {
    [...heading.childNodes].forEach((n) => inner.append(n.cloneNode(true)));
  }

  if (sub) {
    const p = document.createElement('p');
    p.className = 'sub';
    p.textContent = sub.textContent.trim();
    inner.append(p);
  }

  block.replaceChildren(inner);
}
