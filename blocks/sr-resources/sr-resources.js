export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Row 1 = eyebrow | h2 | CTA link
  const headRow = rows[0];
  const headCells = [...headRow.querySelectorAll(':scope > div')];

  const head = document.createElement('div');
  head.className = 'sr-resources__head';

  const headLeft = document.createElement('div');
  const eyebrow = document.createElement('div');
  eyebrow.className = 'sr-resources__eyebrow';
  eyebrow.textContent = headCells[0]?.textContent?.trim() || '';
  headLeft.appendChild(eyebrow);

  const heading = document.createElement('h2');
  heading.className = 'sr-resources__heading';
  const h2El = headCells[1]?.querySelector('h2');
  heading.innerHTML = h2El ? h2El.innerHTML : (headCells[1]?.textContent?.trim() || '');
  headLeft.appendChild(heading);
  head.appendChild(headLeft);

  const ctaLink = headCells[2]?.querySelector('a');
  if (ctaLink) {
    const allLink = document.createElement('a');
    allLink.className = 'sr-resources__all';
    allLink.href = ctaLink.href;
    allLink.textContent = ctaLink.textContent.trim();
    head.appendChild(allLink);
  }

  // Build grid
  const grid = document.createElement('div');
  grid.className = 'sr-resources__grid';

  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i];
    const cells = [...row.querySelectorAll(':scope > div')];

    const card = document.createElement('div');
    card.className = 'sr-resource';
    if (i === 1) card.classList.add('sr-resource--feature');

    // Media
    const img = row.querySelector('img');
    if (img) {
      const media = document.createElement('div');
      media.className = 'sr-resource__media';
      media.appendChild(img.cloneNode(true));
      card.appendChild(media);
    }

    // Content
    const content = document.createElement('div');
    content.className = 'sr-resource__content';

    let catText = '';
    let titleEl = null;
    let bodyText = '';

    cells.forEach((cell) => {
      if (cell.querySelector('img')) return;
      const h3 = cell.querySelector('h3');
      if (h3) {
        titleEl = h3;
      } else if (!catText && !titleEl) {
        catText = cell.textContent.trim();
      } else if (titleEl) {
        bodyText = cell.textContent.trim();
      } else {
        catText = cell.textContent.trim();
      }
    });

    if (catText) {
      const cat = document.createElement('span');
      cat.className = 'sr-resource__cat';
      cat.textContent = catText;
      content.appendChild(cat);
    }

    if (titleEl) {
      const title = document.createElement('h3');
      title.className = 'sr-resource__title';
      title.innerHTML = titleEl.innerHTML;
      content.appendChild(title);
    }

    if (bodyText) {
      const body = document.createElement('p');
      body.className = 'sr-resource__body';
      body.textContent = bodyText;
      content.appendChild(body);
    }

    card.appendChild(content);
    grid.appendChild(card);
  }

  block.innerHTML = '';
  block.appendChild(head);
  block.appendChild(grid);
}
