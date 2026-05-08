export default async function decorate(block) {
  const rows = [...block.children];
  const imageRight = block.classList.contains('image-right');

  const inner = document.createElement('div');
  inner.className = 'sr-promos__inner';

  // Process rows in pairs: even = media, odd = copy
  for (let i = 0; i < rows.length; i += 2) {
    const mediaRow = rows[i];
    const copyRow = rows[i + 1];
    if (!mediaRow || !copyRow) break;

    const promo = document.createElement('div');
    promo.className = 'sr-promo';

    // Determine if this specific promo pair should be image-right
    // First pair flips if block has image-right class, alternates after
    const isImageRight = imageRight ? (i / 2) % 2 === 0 : (i / 2) % 2 !== 0;
    if (isImageRight) promo.classList.add('sr-promo--image-right');

    // Media side
    const media = document.createElement('div');
    media.className = 'sr-promo__media';
    const mediaCell = mediaRow.querySelector('div');
    if (mediaCell) {
      const img = mediaCell.querySelector('img');
      const video = mediaCell.querySelector('video, source');
      if (img) media.appendChild(img.cloneNode(true));
      else if (video) media.appendChild(video.closest('video')?.cloneNode(true) || video.cloneNode(true));
    }

    // Copy side
    const copy = document.createElement('div');
    copy.className = 'sr-promo__copy';
    const copyCells = [...copyRow.querySelectorAll('div > div, div')].filter(
      (el) => el.parentElement === copyRow || el.parentElement?.parentElement === copyRow,
    );

    // Parse copy cells: first div = eyebrow, then look for h2, then p, then a
    const copyCell = copyRow.querySelector('div');
    if (copyCell) {
      // Walk through child nodes/elements
      const children = [...copyCell.children];
      children.forEach((child) => {
        if (child.tagName === 'H2') {
          const title = document.createElement('h2');
          title.className = 'sr-promo__title';
          title.innerHTML = child.innerHTML;
          copy.appendChild(title);
        } else if (child.tagName === 'P') {
          // Check if it's a CTA (contains strong/em > a) or eyebrow (plain text) or body
          const hasLink = child.querySelector('a');
          const hasStrong = child.querySelector('strong, em');
          if (hasLink && hasStrong) {
            const actions = document.createElement('div');
            actions.className = 'sr-promo__actions';
            [...child.childNodes].forEach((node) => actions.appendChild(node.cloneNode(true)));
            copy.appendChild(actions);
          } else if (!hasLink && copy.querySelector('.sr-promo__title')) {
            // Body text (after heading)
            const body = document.createElement('p');
            body.className = 'sr-promo__body';
            body.textContent = child.textContent.trim();
            copy.appendChild(body);
          } else if (!hasLink) {
            // Eyebrow (before heading)
            const eyebrow = document.createElement('span');
            eyebrow.className = 'sr-promo__eyebrow';
            eyebrow.textContent = child.textContent.trim();
            copy.appendChild(eyebrow);
          }
        }
      });
    }

    promo.appendChild(media);
    promo.appendChild(copy);
    inner.appendChild(promo);
  }

  block.innerHTML = '';
  block.appendChild(inner);
}
