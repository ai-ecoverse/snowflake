/**
 * testimonial — Ford quote with media card (white background).
 *
 * Authoring rows (positional):
 *   1. Company name (becomes the logo pill)
 *   2. Quote text
 *   3. Attribution text
 *   4. CTA link
 *   5. Media image
 *   6. Tag label
 *   7. Sticky note text
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const logoCell   = rows[0]?.firstElementChild;
  const quoteCell  = rows[1]?.firstElementChild;
  const attribCell = rows[2]?.firstElementChild;
  const ctaCell    = rows[3]?.firstElementChild;
  const mediaCell  = rows[4]?.firstElementChild;
  const tagCell    = rows[5]?.firstElementChild;
  const stickyCell = rows[6]?.firstElementChild;

  const grid = document.createElement('div');
  grid.className = 'testimonial__grid';

  // ── Left: copy ─────────────────────────────────────────────────────────────
  const left = document.createElement('div');

  if (logoCell) {
    const logo = document.createElement('span');
    logo.className = 'testimonial__logo';
    logo.textContent = logoCell.textContent.trim();
    left.append(logo);
  }

  if (quoteCell) {
    const q = document.createElement('p');
    q.className = 'testimonial__quote';
    q.textContent = quoteCell.textContent.trim();
    left.append(q);
  }

  if (attribCell) {
    const a = document.createElement('p');
    a.className = 'testimonial__attrib';
    a.textContent = attribCell.textContent.trim();
    left.append(a);
  }

  if (ctaCell?.querySelector('a')) {
    const a = ctaCell.querySelector('a').cloneNode(true);
    if (!a.className) a.className = 'btn btn--outline';
    left.append(a);
  }

  // ── Right: media ───────────────────────────────────────────────────────────
  const media = document.createElement('div');
  media.className = 'testimonial__media';

  if (mediaCell?.querySelector('img')) {
    const img = mediaCell.querySelector('img').cloneNode(true);
    media.append(img);
  }

  if (tagCell) {
    const tag = document.createElement('span');
    tag.className = 'testimonial__tag';
    tag.textContent = tagCell.textContent.trim();
    media.append(tag);
  }

  if (stickyCell) {
    const sticky = document.createElement('span');
    sticky.className = 'testimonial__sticky';
    sticky.textContent = stickyCell.textContent.trim();
    media.append(sticky);
  }

  grid.append(left, media);
  block.replaceChildren(grid);
}
