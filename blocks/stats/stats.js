/**
 * stats — 5-card stats row with photographic band overlay + section header
 *
 * Authoring rows (positional):
 *   1. Section eyebrow
 *   2. Section headline
 *   3..N-1: stat rows — cells: figure | label | sub
 *   Last row: CTA link (wrap in *em* for secondary outline)
 */

function row(rows, i) { return rows[i]?.firstElementChild; }
function rowCells(rowEl) { return rowEl ? [...rowEl.children] : []; }
function text(cell) { return cell ? cell.textContent.trim() : ''; }

function buildStat(cells) {
  const [figure, label, sub] = cells.map(text);
  const card = document.createElement('article');
  card.className = 'stat-card';
  card.innerHTML = `
    <p class="stat-figure">${figure}</p>
    <p class="stat-label">${label}</p>
    <p class="stat-sub">${sub}</p>
  `;
  return card;
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

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
  grid.className = 'stats-row';

  const middleRows = rows.slice(2);
  const lastRow = middleRows[middleRows.length - 1];
  const lastIsCta = lastRow && lastRow.querySelector('a') && rowCells(lastRow).length === 1;
  const statRows = lastIsCta ? middleRows.slice(0, -1) : middleRows;

  statRows.forEach((r) => {
    const cells = rowCells(r);
    if (cells.length >= 2) grid.append(buildStat(cells));
  });

  const out = [header, grid];

  if (lastIsCta) {
    const ctaWrap = document.createElement('div');
    ctaWrap.className = 'stats-cta-row';
    [...lastRow.firstElementChild.childNodes].forEach((n) => ctaWrap.append(n.cloneNode(true)));
    out.push(ctaWrap);
  }

  block.replaceChildren(...out);
}
