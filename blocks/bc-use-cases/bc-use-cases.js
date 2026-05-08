export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Row 1 = h2 title, Rows 2-4 = cards (emoji icon | h3 | body)
  const titleEl = rows[0]?.querySelector('h2');
  const titleText = titleEl ? titleEl.innerHTML : (rows[0]?.querySelector('div')?.textContent?.trim() || '');

  const header = document.createElement('div');
  header.className = 'bc-use-cases__header';
  const heading = document.createElement('h2');
  heading.className = 'bc-use-cases__title';
  heading.innerHTML = titleText;
  header.appendChild(heading);

  const grid = document.createElement('div');
  grid.className = 'bc-use-cases__grid';

  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i];
    const cells = [...row.querySelectorAll(':scope > div')];

    const card = document.createElement('div');
    card.className = `bc-use-case bc-use-case--${i}`;

    const iconText = cells[0]?.textContent?.trim() || '';
    const icon = document.createElement('div');
    icon.className = 'bc-use-case__icon';
    icon.textContent = iconText;
    card.appendChild(icon);

    const h3El = cells[1]?.querySelector('h3');
    const cardTitle = document.createElement('h3');
    cardTitle.className = 'bc-use-case__title';
    cardTitle.innerHTML = h3El ? h3El.innerHTML : (cells[1]?.textContent?.trim() || '');
    card.appendChild(cardTitle);

    if (cells[2]) {
      const body = document.createElement('p');
      body.className = 'bc-use-case__body';
      body.textContent = cells[2].textContent.trim();
      card.appendChild(body);
    }

    grid.appendChild(card);
  }

  block.innerHTML = '';
  block.appendChild(header);
  block.appendChild(grid);
}
