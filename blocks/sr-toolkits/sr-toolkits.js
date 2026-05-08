export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Row 1 = eyebrow | h2 heading
  const headRow = rows[0];
  const headCells = [...headRow.querySelectorAll(':scope > div')];

  const head = document.createElement('div');
  head.className = 'sr-toolkits__head';

  const eyebrow = document.createElement('span');
  eyebrow.className = 'sr-toolkits__eyebrow';
  eyebrow.textContent = headCells[0]?.textContent?.trim() || '';
  head.appendChild(eyebrow);

  const heading = document.createElement('h2');
  heading.className = 'sr-toolkits__heading';
  const h2El = headCells[1]?.querySelector('h2');
  heading.innerHTML = h2El ? h2El.innerHTML : (headCells[1]?.textContent?.trim() || '');
  head.appendChild(heading);

  // Build grid
  const grid = document.createElement('div');
  grid.className = 'sr-toolkits__grid';

  let moreText = '';

  // Rows 2..N = toolkit cards or final "more" row
  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i];
    const cells = [...row.querySelectorAll(':scope > div')];

    // If single cell with no picture/h3, treat as "more" text
    const hasImg = row.querySelector('img');
    const hasH3 = row.querySelector('h3');
    if (!hasImg && !hasH3 && cells.length === 1) {
      moreText = cells[0].textContent.trim();
      continue;
    }

    const card = document.createElement('div');
    card.className = 'sr-toolkit';

    // Media
    const img = row.querySelector('img');
    if (img) {
      const media = document.createElement('div');
      media.className = 'sr-toolkit__media';
      media.appendChild(img.cloneNode(true));
      card.appendChild(media);
    }

    // Content: label | h3 title | body
    const content = document.createElement('div');
    content.className = 'sr-toolkit__content';

    // Find label cell (text only, no img/h3)
    let labelText = '';
    let titleEl = null;
    let bodyText = '';

    cells.forEach((cell) => {
      const cellImg = cell.querySelector('img');
      const cellH3 = cell.querySelector('h3');
      if (cellImg) return; // skip media cell
      if (cellH3) {
        titleEl = cellH3;
      } else if (!labelText && !titleEl) {
        labelText = cell.textContent.trim();
      } else {
        bodyText = cell.textContent.trim();
      }
    });

    if (labelText) {
      const label = document.createElement('span');
      label.className = 'sr-toolkit__label';
      label.textContent = labelText;
      content.appendChild(label);
    }

    if (titleEl) {
      const title = document.createElement('h3');
      title.className = 'sr-toolkit__title';
      title.innerHTML = titleEl.innerHTML;
      content.appendChild(title);
    }

    if (bodyText) {
      const body = document.createElement('p');
      body.className = 'sr-toolkit__body';
      body.textContent = bodyText;
      content.appendChild(body);
    }

    card.appendChild(content);
    grid.appendChild(card);
  }

  block.innerHTML = '';
  block.appendChild(head);
  block.appendChild(grid);

  if (moreText) {
    const more = document.createElement('p');
    more.className = 'sr-toolkits__more';
    more.textContent = moreText;
    block.appendChild(more);
  }
}
