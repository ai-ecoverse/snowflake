/**
 * hero — Two-column hero with image and CTA
 *
 * Authoring rows (positional):
 *   1. eyebrow text
 *   2. <h1> headline
 *   3. body paragraph
 *   4. CTA links — wrap primary in <strong>, secondary in <em>
 *   5. <picture> hero image
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const eyebrowCell = rows[0]?.firstElementChild;
  const headlineCell = rows[1]?.firstElementChild;
  const bodyCell = rows[2]?.firstElementChild;
  const ctaCell = rows[3]?.firstElementChild;
  const imageCell = rows[4]?.firstElementChild;

  // Build content side
  const content = document.createElement('div');
  content.className = 'hero-content';

  if (eyebrowCell) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'hero-eyebrow';
    eyebrow.textContent = eyebrowCell.textContent.trim();
    content.append(eyebrow);
  }

  if (headlineCell) {
    const h1 = headlineCell.querySelector('h1') || document.createElement('h1');
    if (!headlineCell.querySelector('h1')) {
      h1.textContent = headlineCell.textContent.trim();
    }
    h1.className = 'hero-title';
    content.append(h1);
  }

  if (bodyCell) {
    const body = document.createElement('p');
    body.className = 'hero-body';
    body.textContent = bodyCell.textContent.trim();
    content.append(body);
  }

  if (ctaCell && ctaCell.querySelector('a')) {
    const actions = document.createElement('div');
    actions.className = 'hero-ctas';
    [...ctaCell.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
    content.append(actions);
  }

  // Build image side
  const imageWrap = document.createElement('div');
  imageWrap.className = 'hero-image';

  if (imageCell) {
    const pic = imageCell.querySelector('picture') || imageCell.querySelector('img');
    if (pic) {
      imageWrap.append(pic.cloneNode(true));
    }
  }

  block.replaceChildren(content, imageWrap);
}
