/**
 * hero-static — Full-bleed hero with right photo, left-aligned content and scrim.
 * Authoring rows:
 *   1: Background image (picture element)
 *   2: Eyebrow text
 *   3: h2 headline
 *   4: Description paragraph
 *   5: CTA links (primary — clone child nodes as-is)
 */
export default async function decorate(block) {
  const rows = [...block.children];

  // Row 1 — background photo
  const picture = rows[0]?.querySelector('picture, img');
  if (picture) {
    picture.classList.add('hero-photo');
  }

  // Row 2 — eyebrow
  const eyebrow = document.createElement('p');
  eyebrow.className = 'hero-eyebrow';
  eyebrow.textContent = rows[1]?.firstElementChild?.textContent.trim() ?? '';

  // Row 3 — headline
  const headline = document.createElement('h2');
  headline.className = 'hero-headline';
  headline.textContent = rows[2]?.firstElementChild?.textContent.trim() ?? '';

  // Row 4 — description
  const description = document.createElement('p');
  description.className = 'hero-description';
  description.textContent = rows[3]?.firstElementChild?.textContent.trim() ?? '';

  // Row 5 — CTA row: clone child nodes from the cell
  const ctaRow = document.createElement('div');
  ctaRow.className = 'hero-cta-row';
  const ctaCell = rows[4]?.firstElementChild;
  if (ctaCell) {
    [...ctaCell.childNodes].forEach((node) => ctaRow.append(node.cloneNode(true)));
  }

  // Build content
  const content = document.createElement('div');
  content.className = 'hero-content';
  content.append(eyebrow, headline, description, ctaRow);

  const inner = document.createElement('div');
  inner.className = 'hero-inner';
  inner.append(content);

  const scrim = document.createElement('div');
  scrim.className = 'hero-scrim';
  scrim.setAttribute('aria-hidden', 'true');

  // Assemble wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'hero-static';
  if (picture) wrapper.append(picture);
  wrapper.append(scrim, inner);

  block.replaceChildren(wrapper);
}
