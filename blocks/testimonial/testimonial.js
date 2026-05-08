/**
 * testimonial — customer quote (Ford) with media illustration
 *
 * Authoring rows (positional):
 *   1. customer logo text (e.g. "Ford")
 *   2. quote text
 *   3. attribution text
 *   4. CTA link
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const wrap = document.createElement('div');
  wrap.className = 'container';
  const grid = document.createElement('div');
  grid.className = 'testimonial__grid';

  // Left col
  const left = document.createElement('div');

  const logoCell = rows[0]?.firstElementChild;
  if (logoCell) {
    const logo = document.createElement('span');
    logo.className = 'testimonial__logo';
    logo.textContent = logoCell.textContent.trim();
    left.append(logo);
  }

  const quoteCell = rows[1]?.firstElementChild;
  if (quoteCell) {
    const q = document.createElement('p');
    q.className = 'testimonial__quote';
    q.textContent = quoteCell.textContent.trim();
    left.append(q);
  }

  const attribCell = rows[2]?.firstElementChild;
  if (attribCell) {
    const a = document.createElement('p');
    a.className = 'testimonial__attrib';
    a.textContent = attribCell.textContent.trim();
    left.append(a);
  }

  const ctaCell = rows[3]?.firstElementChild;
  if (ctaCell && ctaCell.querySelector('a')) {
    [...ctaCell.childNodes].forEach(n => left.append(n.cloneNode(true)));
  }

  // Right col — static decorative media
  const media = document.createElement('div');
  media.className = 'testimonial__media';
  media.innerHTML = `
    <div class="testimonial__frame"></div>
    <span class="testimonial__tag">Approved assets</span>
    <span class="testimonial__pill">From the Road</span>
    <span class="testimonial__react">127</span>
    <span class="testimonial__note">Use this hero for Q3 launch</span>
    <span class="testimonial__strip"><span></span><span></span><span></span><span></span></span>
  `;

  grid.append(left, media);
  wrap.append(grid);
  block.replaceChildren(wrap);
}
