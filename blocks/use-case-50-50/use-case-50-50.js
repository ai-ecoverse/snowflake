/**
 * use-case-50-50 (L3) — 50/50 use-case feature
 *
 * Authoring rows (one row per use-case):
 *   cell 1: image (picture/img)
 *   cell 2: h2 title
 *   cell 3: description paragraph
 *   cell 4: CTA links — wrap primary in <strong>, secondary in <em>
 *   cell 5: (optional) "right" — if present, photo goes on the right
 */

function pic(cell) { return cell ? cell.querySelector('picture, img') : null; }

export default async function decorate(block) {
  const rows = [...block.children];
  const list = document.createElement('ol');
  list.className = 'use-cases-list';

  rows.forEach((row) => {
    const cells = [...row.children];
    const [imgCell, titleCell, descCell, ctaCell, variantCell] = cells;

    const li = document.createElement('li');
    const isRight = variantCell?.textContent.trim().toLowerCase() === 'right';
    li.className = `use-case${isRight ? ' use-case-right' : ' use-case-left'}`;

    // Photo
    const photo = document.createElement('div');
    photo.className = 'use-case-photo';
    const image = pic(imgCell);
    if (image) photo.append(image);
    li.append(photo);

    // Body
    const body = document.createElement('div');
    body.className = 'use-case-body';

    if (titleCell) {
      const h2 = document.createElement('h2');
      h2.textContent = titleCell.textContent.trim();
      body.append(h2);
    }
    if (descCell) {
      const p = document.createElement('p');
      p.className = 'use-case-description';
      p.textContent = descCell.textContent.trim();
      body.append(p);
    }
    if (ctaCell && ctaCell.querySelector('a')) {
      const actions = document.createElement('div');
      actions.className = 'actions';
      [...ctaCell.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
      body.append(actions);
    }

    li.append(body);
    list.append(li);
  });

  block.replaceChildren(list);
}
