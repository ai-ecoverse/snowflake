/**
 * avi — ai visibility index (dark band with split layout + brand leaderboard)
 *
 * Authoring rows (positional):
 *   1. Headline
 *   2. Body
 *   3. CTA link (wrap in **strong**)
 *   4. Leaderboard caption (small cap)
 *   5. Leaderboard meta (subtle)
 *   6..N: leaderboard rows — cells: rank | brand | pct
 */

function row(rows, i) { return rows[i]?.firstElementChild; }
function rowCells(rowEl) { return rowEl ? [...rowEl.children] : []; }
function text(cell) { return cell ? cell.textContent.trim() : ''; }

export default async function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 5) return;

  const titleCell = row(rows, 0);
  const bodyText = text(row(rows, 1));
  const ctaCell = row(rows, 2);
  const captionText = text(row(rows, 3));
  const metaText = text(row(rows, 4));

  const heading = titleCell?.querySelector('h2, h3') || (() => {
    const h = document.createElement('h2');
    h.textContent = text(titleCell);
    return h;
  })();
  heading.classList.add('t-title-1', 'is-upper');

  const inner = document.createElement('div');
  inner.className = 'avi-inner';

  const copy = document.createElement('div');
  copy.className = 'avi-copy';
  copy.append(heading);

  const body = document.createElement('p');
  body.className = 'body t-body-m';
  body.textContent = bodyText;
  copy.append(body);

  if (ctaCell && ctaCell.querySelector('a')) {
    const actions = document.createElement('div');
    actions.className = 'actions';
    [...ctaCell.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
    copy.append(actions);
  }

  const table = document.createElement('aside');
  table.className = 'avi-table';
  table.setAttribute('aria-label', 'Brand share of voice');
  table.innerHTML = `
    <header class="avi-table-caption">
      <span class="small-cap">${captionText}</span>
      <span class="meta">${metaText}</span>
    </header>
  `;

  const list = document.createElement('ul');
  rows.slice(5).forEach((r) => {
    const cells = rowCells(r);
    if (cells.length < 3) return;
    const [rank, brand, pct] = cells.map(text);
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="rank">${rank}</span>
      <span class="brand">${brand}</span>
      <span class="pct">${pct}</span>
    `;
    list.append(li);
  });
  table.append(list);

  inner.append(copy, table);
  block.replaceChildren(inner);
}
