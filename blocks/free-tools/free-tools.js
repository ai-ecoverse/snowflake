/**
 * free-tools — horizontal scroll-snap carousel of tool cards with section header
 *
 * Authoring rows (positional):
 *   1. Section eyebrow
 *   2. Section headline
 *   3..N: tool rows — single cell with tool name (optionally a link)
 */

function row(rows, i) { return rows[i]?.firstElementChild; }
function text(cell) { return cell ? cell.textContent.trim() : ''; }

function buildCard(cell) {
  const link = cell?.querySelector('a');
  const name = text(cell);
  const card = document.createElement('article');
  card.className = 'tool-card';

  const wrap = link ? document.createElement('a') : document.createElement('div');
  wrap.className = 'tool-card-inner';
  if (link) wrap.href = link.getAttribute('href');

  wrap.innerHTML = `
    <p class="tool-name">${name}</p>
    <span class="arrow" aria-hidden="true">&rarr;</span>
  `;
  card.append(wrap);
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
  heading.classList.add('t-title-2');

  const header = document.createElement('header');
  header.className = 'section-header';
  header.setAttribute('data-ta-group', '');
  header.innerHTML = `<p class="t-eyebrow t-caption is-upper" data-ta>${eyebrow}</p>`;
  heading.setAttribute('data-ta', '');
  header.append(heading);

  const track = document.createElement('div');
  track.className = 'tools-track';

  rows.slice(2).forEach((r) => {
    const cell = r.firstElementChild;
    if (!cell) return;
    track.append(buildCard(cell));
  });

  block.replaceChildren(header, track);
}
