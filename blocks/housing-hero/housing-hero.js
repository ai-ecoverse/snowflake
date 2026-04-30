/**
 * Housing Hero block
 * Authoring rows (positional):
 *   1. eyebrow text
 *   2. h1 headline
 *   3. sub paragraph
 *   4. phone CTA — plain <a href="tel:..."> with number + label text
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const eyebrowText = rows[0]?.querySelector('p, div')?.textContent?.trim() ?? '';
  const headlineText = rows[1]?.querySelector('p, div, h1, h2')?.textContent?.trim() ?? '';
  const subText = rows[2]?.querySelector('p, div')?.textContent?.trim() ?? '';

  // Clone the anchor from the phone row — do NOT manufacture it
  const phoneAnchor = rows[3]?.querySelector('a');

  // Build DOM
  const inner = document.createElement('div');
  inner.className = 'inner';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = eyebrowText;

  const h1 = document.createElement('h1');
  h1.textContent = headlineText;

  const sub = document.createElement('p');
  sub.className = 'sub';
  sub.textContent = subText;

  inner.append(eyebrow, h1, sub);

  if (phoneAnchor) {
    const phoneLink = phoneAnchor.cloneNode(true);
    phoneLink.classList.add('phone-link');
    inner.append(phoneLink);
  }

  block.replaceChildren(inner);
}
