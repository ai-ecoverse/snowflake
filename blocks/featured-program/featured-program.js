/**
 * featured-program — Split section with navy background
 *
 * Authoring rows (positional):
 *   1. eyebrow text
 *   2. <h2> headline
 *   3. body paragraph
 *   4. CTA links — wrap primary in <em><strong> (accent/gold), secondary in <em>
 *   5. <picture> program image
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
  content.className = 'program-content';

  if (eyebrowCell) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'program-eyebrow';
    eyebrow.textContent = eyebrowCell.textContent.trim();
    content.append(eyebrow);
  }

  if (headlineCell) {
    const h2 = headlineCell.querySelector('h2') || document.createElement('h2');
    if (!headlineCell.querySelector('h2')) {
      h2.textContent = headlineCell.textContent.trim();
    }
    h2.className = 'program-title';
    content.append(h2);
  }

  if (bodyCell) {
    const body = document.createElement('p');
    body.className = 'program-body';
    body.textContent = bodyCell.textContent.trim();
    content.append(body);
  }

  if (ctaCell && ctaCell.querySelector('a')) {
    const actions = document.createElement('div');
    actions.className = 'program-ctas';
    [...ctaCell.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
    content.append(actions);
  }

  // Build image side
  const imageWrap = document.createElement('div');
  imageWrap.className = 'program-image';

  if (imageCell) {
    const pic = imageCell.querySelector('picture') || imageCell.querySelector('img');
    if (pic) {
      imageWrap.append(pic.cloneNode(true));
    }
  }

  block.replaceChildren(content, imageWrap);
}
