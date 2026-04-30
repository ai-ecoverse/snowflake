/**
 * Pillar Hero block
 * Authoring rows (positional):
 *   1. eyebrow text
 *   2. h1 headline
 *   3. sub paragraph
 *   4. background image (picture or img)
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const eyebrowText = rows[0]?.querySelector('p, div')?.textContent?.trim() ?? '';
  const headlineText = rows[1]?.querySelector('p, div, h1, h2')?.textContent?.trim() ?? '';
  const subText = rows[2]?.querySelector('p, div')?.textContent?.trim() ?? '';

  // Extract image src from row 4
  const imgEl = rows[3]?.querySelector('img');
  const imgSrc = imgEl?.src ?? imgEl?.getAttribute('src') ?? '';
  const imgAlt = imgEl?.alt ?? '';

  // Build DOM
  const inner = document.createElement('div');
  inner.className = 'inner';

  const textCol = document.createElement('div');
  textCol.className = 'text-col';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = eyebrowText;

  const h1 = document.createElement('h1');
  h1.textContent = headlineText;

  const sub = document.createElement('p');
  sub.className = 'sub';
  sub.textContent = subText;

  textCol.append(eyebrow, h1, sub);

  const art = document.createElement('div');
  art.className = 'art';
  if (imgSrc) {
    art.style.backgroundImage = `url('${imgSrc}')`;
    art.setAttribute('role', 'img');
    art.setAttribute('aria-label', imgAlt);
  }

  inner.append(textCol, art);
  block.replaceChildren(inner);
}
