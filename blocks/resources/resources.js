/**
 * resources — asymmetric grid (1 featured card + 6 standard cards)
 *
 * Authoring rows (positional):
 *   1. Section eyebrow
 *   2. Section headline
 *   3..N: card rows — cells: tag | title | excerpt | (optional) link
 *         First card row becomes the featured card.
 */

function row(rows, i) { return rows[i]?.firstElementChild; }
function rowCells(rowEl) { return rowEl ? [...rowEl.children] : []; }
function text(cell) { return cell ? cell.textContent.trim() : ''; }

function buildCard(cells, isFeatured) {
  const [tag, title, excerpt, linkCell] = cells;
  const card = document.createElement('article');
  card.className = 'resource-card' + (isFeatured ? ' is-featured' : '');

  const link = linkCell?.querySelector('a');
  const titleText = text(title);

  card.innerHTML = `
    <div class="resource-image" aria-hidden="true"></div>
    <div class="resource-body">
      <span class="resource-tag">${text(tag)}</span>
      <h3 class="resource-title">${titleText}</h3>
      <p class="resource-excerpt">${text(excerpt)}</p>
      <span class="arrow" aria-hidden="true">&rarr;</span>
    </div>
  `;

  if (link) {
    const anchor = document.createElement('a');
    anchor.href = link.getAttribute('href');
    anchor.className = 'resource-link';
    anchor.setAttribute('aria-label', titleText);
    card.append(anchor);
  }
  return card;
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 3) return;

  const eyebrow = text(rows[0]);
  const titleCell = row(rows, 1);
  const heading = titleCell?.querySelector('h2, h3') || (() => {
    const h = document.createElement('h2');
    h.textContent = text(titleCell);
    return h;
  })();
  heading.classList.add('t-title-2', 'is-upper', 'deck');

  const header = document.createElement('header');
  header.className = 'section-header';
  header.innerHTML = `<p class="t-eyebrow t-caption is-upper">${eyebrow}</p>`;
  header.append(heading);

  const grid = document.createElement('div');
  grid.className = 'resources-row';

  rows.slice(2).forEach((r, idx) => {
    const cells = rowCells(r);
    if (cells.length < 3) return;
    grid.append(buildCard(cells, idx === 0));
  });

  block.replaceChildren(header, grid);
}
