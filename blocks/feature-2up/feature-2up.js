/**
 * feature-2up — 2-up feature tile grid
 *
 * Authoring rows:
 *   1. Section heading (h2 or h3)
 *   2+ Each row = one tile:
 *      cell 1: image (optional picture/img)
 *      cell 2: h3 title
 *      cell 3: CTA label text
 *      cell 4: link URL
 */

function pic(cell) { return cell ? cell.querySelector('picture, img') : null; }

export default async function decorate(block) {
  const rows = [...block.children];
  const [headingRow, ...tileRows] = rows;
  const out = [];

  // Heading
  if (headingRow) {
    const wrap = document.createElement('div');
    wrap.className = 'theme-header';
    const h = document.createElement('h2');
    h.textContent = headingRow.firstElementChild?.textContent.trim() || '';
    wrap.append(h);
    out.push(wrap);
  }

  // Grid
  const grid = document.createElement('div');
  grid.className = 'feature-2up-grid';

  tileRows.forEach((row) => {
    const cells = [...row.children];
    const [imgCell, titleCell, ctaCell, urlCell] = cells;
    const url = urlCell?.textContent.trim() || '#';

    const a = document.createElement('a');
    a.className = 'feature-tile';
    a.href = url;

    // Photo
    const photoWrap = document.createElement('div');
    photoWrap.className = 'feature-tile-photo';
    const image = pic(imgCell);
    if (image) {
      photoWrap.append(image);
    } else {
      const empty = document.createElement('div');
      empty.className = 'feature-tile-photo-empty';
      empty.setAttribute('aria-hidden', 'true');
      photoWrap.append(empty);
    }
    a.append(photoWrap);

    // Body
    const body = document.createElement('div');
    body.className = 'feature-tile-body';
    if (titleCell) {
      const h3 = document.createElement('h3');
      h3.textContent = titleCell.textContent.trim();
      body.append(h3);
    }
    if (ctaCell) {
      const cta = document.createElement('span');
      cta.className = 'feature-tile-cta';
      cta.textContent = ctaCell.textContent.trim() || 'Learn more';
      body.append(cta);
    }
    a.append(body);
    grid.append(a);
  });

  out.push(grid);
  block.replaceChildren(...out);
}
