/**
 * bc-why — Why Adobe Brand Concierge. 4-col staggered cards.
 *
 * Authoring rows (positional):
 *   1. h2 section title
 *   2. Card: picture | h3 title | body text
 *   3. Card: picture | h3 title | body text
 *   4. Card: picture | h3 title | body text
 *   5. Card: picture | h3 title | body text
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const titleEl = rows[0]?.querySelector('h2, div');

  const header = document.createElement('div');
  header.className = 'bc-why__header';
  const heading = document.createElement('h2');
  heading.className = 'bc-why__title';
  heading.textContent = titleEl?.textContent?.trim() || '';
  header.appendChild(heading);

  const grid = document.createElement('div');
  grid.className = 'bc-why__grid';

  rows.slice(1).forEach((row, i) => {
    const cells = [...row.children];
    const card = document.createElement('div');
    card.className = `bc-why-card bc-why-card--${i + 1}`;

    const pic = cells[0]?.querySelector('picture, img');
    if (pic) {
      const media = document.createElement('div');
      media.className = 'bc-why-card__media';
      media.appendChild(pic.cloneNode(true));
      card.appendChild(media);
    }

    const cardTitle = document.createElement('h3');
    cardTitle.className = 'bc-why-card__title';
    const h3 = cells[1]?.querySelector('h3');
    cardTitle.textContent = h3 ? h3.textContent.trim() : (cells[1]?.textContent?.trim() || '');
    card.appendChild(cardTitle);

    const cardBody = document.createElement('p');
    cardBody.className = 'bc-why-card__body';
    cardBody.textContent = cells[2]?.textContent?.trim() || '';
    card.appendChild(cardBody);

    grid.appendChild(card);
  });

  block.innerHTML = '';
  block.appendChild(header);
  block.appendChild(grid);
}
