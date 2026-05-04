/**
 * hero-product — 50/50 split product hero with eyebrow, headline, spec, price, CTAs, and photo.
 * Authoring rows:
 *   1: Eyebrow text
 *   2: h2 headline
 *   3: Price text
 *   4: Spec line text
 *   5: CTA row (primary + secondary links — clone child nodes)
 *   6: Product image (picture element)
 */
export default async function decorate(block) {
  const rows = [...block.children];

  // Left: content column
  const eyebrow = document.createElement('p');
  eyebrow.className = 'hero-product-eyebrow';
  eyebrow.textContent = rows[0]?.firstElementChild?.textContent.trim() ?? '';

  const headline = document.createElement('h2');
  headline.className = 'hero-product-headline';
  headline.textContent = rows[1]?.firstElementChild?.textContent.trim() ?? '';

  const price = document.createElement('p');
  price.className = 'hero-product-price';
  price.textContent = rows[2]?.firstElementChild?.textContent.trim() ?? '';

  const spec = document.createElement('p');
  spec.className = 'hero-product-spec';
  spec.textContent = rows[3]?.firstElementChild?.textContent.trim() ?? '';

  const ctaRow = document.createElement('div');
  ctaRow.className = 'hero-product-cta-row';
  const ctaCell = rows[4]?.firstElementChild;
  if (ctaCell) {
    [...ctaCell.childNodes].forEach((node) => ctaRow.append(node.cloneNode(true)));
  }

  const content = document.createElement('div');
  content.className = 'hero-product-content';
  content.append(eyebrow, headline, spec, price, ctaRow);

  // Right: photo column
  const photoWrap = document.createElement('div');
  photoWrap.className = 'hero-product-photo';
  const picture = rows[5]?.querySelector('picture, img');
  if (picture) photoWrap.append(picture);

  block.replaceChildren(content, photoWrap);
}
