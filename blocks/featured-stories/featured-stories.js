/**
 * featured-stories — 3-column news card grid
 *
 * Authoring rows (positional):
 *   1. header row — cells: <h2> heading | link to "View All News"
 *   2..N: card rows — cells: <picture> image | badge text | headline | date | URL
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const container = document.createElement('div');
  container.className = 'container';

  // First row = header with heading + "View All" link
  const headerRow = rows[0];
  const headerCells = [...headerRow.children];
  const header = document.createElement('div');
  header.className = 'stories-header';

  const h2 = headerCells[0]?.querySelector('h2');
  if (h2) {
    header.append(h2.cloneNode(true));
  } else {
    const heading = document.createElement('h2');
    heading.textContent = headerCells[0]?.textContent.trim() || 'Featured Stories';
    header.append(heading);
  }

  const viewAllLink = headerCells[1]?.querySelector('a');
  if (viewAllLink) {
    const link = viewAllLink.cloneNode(true);
    header.append(link);
  }

  container.append(header);

  // Remaining rows = news cards
  const grid = document.createElement('div');
  grid.className = 'stories-grid';

  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    const imageCell = cells[0];
    const badgeCell = cells[1];
    const headlineCell = cells[2];
    const dateCell = cells[3];
    const urlCell = cells[4];

    const card = document.createElement('a');
    card.className = 'news-card';

    // URL from dedicated cell or any anchor found
    const urlSource = urlCell?.querySelector('a') || headlineCell?.querySelector('a') || imageCell?.querySelector('a');
    card.href = urlSource ? urlSource.href : '#';

    // Image
    const imgWrap = document.createElement('div');
    imgWrap.className = 'news-img-wrap';
    const pic = imageCell?.querySelector('picture') || imageCell?.querySelector('img');
    if (pic) {
      const cloned = pic.cloneNode(true);
      imgWrap.append(cloned);
    }
    card.append(imgWrap);

    // Body
    const body = document.createElement('div');
    body.className = 'news-body';

    if (badgeCell && badgeCell.textContent.trim()) {
      const badge = document.createElement('span');
      badge.className = 'badge-teal';
      badge.textContent = badgeCell.textContent.trim();
      body.append(badge);
    }

    if (headlineCell) {
      const headline = document.createElement('h4');
      headline.className = 'news-headline';
      headline.textContent = headlineCell.textContent.trim();
      body.append(headline);
    }

    if (dateCell && dateCell.textContent.trim()) {
      const date = document.createElement('p');
      date.className = 'news-date';
      date.textContent = dateCell.textContent.trim();
      body.append(date);
    }

    card.append(body);
    grid.append(card);
  });

  container.append(grid);
  block.replaceChildren(container);
}
