/**
 * calendar — Horizontal event card strip (4-column grid)
 *
 * Authoring rows (positional):
 *   1. header row — cells: <h2> heading | link to "View Full Calendar"
 *   2..N: event rows — cells: date text | event title | link URL
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const container = document.createElement('div');
  container.className = 'container';

  // First row = header
  const headerRow = rows[0];
  const headerCells = [...headerRow.children];
  const header = document.createElement('div');
  header.className = 'calendar-header';

  const h2 = headerCells[0]?.querySelector('h2');
  if (h2) {
    header.append(h2.cloneNode(true));
  } else {
    const heading = document.createElement('h2');
    heading.textContent = headerCells[0]?.textContent.trim() || 'Calendar';
    header.append(heading);
  }

  const viewAllLink = headerCells[1]?.querySelector('a');
  if (viewAllLink) {
    const link = viewAllLink.cloneNode(true);
    header.append(link);
  }

  container.append(header);

  // Remaining rows = event cards
  const grid = document.createElement('div');
  grid.className = 'calendar-grid';

  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    const dateCell = cells[0];
    const titleCell = cells[1];
    const urlCell = cells[2];

    const card = document.createElement('div');
    card.className = 'event-card';

    // Date
    const dateBlock = document.createElement('div');
    dateBlock.className = 'event-date-block';
    const dateSpan = document.createElement('span');
    dateSpan.className = 'event-date';
    dateSpan.textContent = dateCell ? dateCell.textContent.trim() : '';
    dateBlock.append(dateSpan);
    card.append(dateBlock);

    // Title
    if (titleCell) {
      const title = document.createElement('p');
      title.className = 'event-title';
      title.textContent = titleCell.textContent.trim();
      card.append(title);
    }

    // Link
    const linkSource = urlCell?.querySelector('a') || titleCell?.querySelector('a');
    const eventLink = document.createElement('a');
    eventLink.className = 'event-link';
    eventLink.href = linkSource ? linkSource.href : '#';
    eventLink.innerHTML = `View Event <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>`;
    card.append(eventLink);

    grid.append(card);
  });

  container.append(grid);
  block.replaceChildren(container);
}
