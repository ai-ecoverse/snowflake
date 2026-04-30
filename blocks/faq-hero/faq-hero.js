/**
 * FAQ Hero block
 * Authoring rows (positional):
 *   1. eyebrow
 *   2. h1
 *   3. sub paragraph
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const eyebrowText = rows[0]?.querySelector('p, div')?.textContent?.trim() ?? '';
  const headlineText = rows[1]?.querySelector('p, div, h1, h2')?.textContent?.trim() ?? '';
  const subText = rows[2]?.querySelector('p, div')?.textContent?.trim() ?? '';

  const inner = document.createElement('div');
  inner.className = 'faq-hero-inner';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = eyebrowText;

  const h1 = document.createElement('h1');
  h1.textContent = headlineText;

  const sub = document.createElement('p');
  sub.className = 'sub';
  sub.textContent = subText;

  inner.append(eyebrow, h1, sub);
  block.replaceChildren(inner);
}
