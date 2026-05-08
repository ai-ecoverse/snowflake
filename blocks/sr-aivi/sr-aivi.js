export default async function decorate(block) {
  const rows = [...block.children];

  // Row 1 = picture, Row 2 = copy (eyebrow | h2 | body | CTA)
  const mediaRow = rows[0];
  const copyRow = rows[1];

  const inner = document.createElement('div');
  inner.className = 'sr-aivi__inner';

  // Media
  const media = document.createElement('div');
  media.className = 'sr-aivi__media';
  const img = mediaRow?.querySelector('img');
  if (img) media.appendChild(img.cloneNode(true));
  inner.appendChild(media);

  // Copy
  const copy = document.createElement('div');
  copy.className = 'sr-aivi__copy';

  if (copyRow) {
    const copyCell = copyRow.querySelector(':scope > div');
    if (copyCell) {
      const children = [...copyCell.children];
      children.forEach((child) => {
        if (child.tagName === 'H2') {
          const title = document.createElement('h2');
          title.className = 'sr-aivi__title';
          title.innerHTML = child.innerHTML;
          copy.appendChild(title);
        } else if (child.tagName === 'P') {
          const hasLink = child.querySelector('a');
          const hasStrong = child.querySelector('strong, em');
          if (hasLink && hasStrong) {
            const actions = document.createElement('div');
            actions.className = 'sr-aivi__actions';
            [...child.childNodes].forEach((node) => actions.appendChild(node.cloneNode(true)));
            copy.appendChild(actions);
          } else if (copy.querySelector('.sr-aivi__title')) {
            const body = document.createElement('p');
            body.className = 'sr-aivi__body';
            body.textContent = child.textContent.trim();
            copy.appendChild(body);
          } else {
            const eyebrow = document.createElement('span');
            eyebrow.className = 'sr-aivi__eyebrow';
            eyebrow.textContent = child.textContent.trim();
            copy.appendChild(eyebrow);
          }
        }
      });
    }
  }

  inner.appendChild(copy);
  block.innerHTML = '';
  block.appendChild(inner);
}
