/**
 * avi — AI Visibility Index trust section (v3 strata overlap)
 *
 * Authoring rows (positional):
 *   1. h2 headline
 *   2. body paragraph
 *   3. CTA link (wrap in <strong><a> for primary button)
 *   4. Table caption — "Brand % Share of Voice"
 *   5. Table meta   — "AI Platform: ChatGPT, April 2026"
 *   6..N. Leaderboard rows — col1=rank | col2=brand | col3=percentage
 */

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  function cell(row, idx = 0) { return row?.children[idx] || null; }

  const headlineRow = rows[0];
  const bodyRow = rows[1];
  const ctaRow = rows[2];
  const tableCaptionRow = rows[3];
  const tableMetaRow = rows[4];
  const dataRows = rows.slice(5);

  // Copy section
  const copy = document.createElement('div');
  copy.className = 'avi-copy';

  if (headlineRow) {
    const h2 = document.createElement('h2');
    h2.className = 't-title-1 is-upper';
    h2.innerHTML = cell(headlineRow)?.innerHTML || '';
    copy.append(h2);
  }

  if (bodyRow) {
    const p = document.createElement('p');
    p.className = 'body t-body-m';
    p.innerHTML = cell(bodyRow)?.innerHTML || '';
    copy.append(p);
  }

  if (ctaRow) {
    const ctaCell = cell(ctaRow);
    if (ctaCell) {
      [...ctaCell.childNodes].forEach((n) => copy.append(n.cloneNode(true)));
    }
  }

  // Leaderboard table
  const table = document.createElement('aside');
  table.className = 'avi-table';
  table.setAttribute('aria-label', 'Brand share of voice');

  const caption = document.createElement('header');
  caption.className = 'avi-table-caption';

  const capSmall = document.createElement('span');
  capSmall.className = 'small-cap';
  capSmall.textContent = cell(tableCaptionRow)?.textContent.trim() || 'Brand % Share of Voice';

  const capMeta = document.createElement('span');
  capMeta.className = 'meta';
  capMeta.textContent = cell(tableMetaRow)?.textContent.trim() || '';

  caption.append(capSmall, capMeta);
  table.append(caption);

  const ul = document.createElement('ul');
  dataRows.forEach((row) => {
    const rank = cell(row, 0)?.textContent.trim() || '';
    const brand = cell(row, 1)?.textContent.trim() || '';
    const pct = cell(row, 2)?.textContent.trim() || '';
    const li = document.createElement('li');
    li.innerHTML = `<span class="rank">${rank}</span><span class="brand">${brand}</span><span class="pct">${pct}</span>`;
    ul.append(li);
  });
  table.append(ul);

  const inner = document.createElement('div');
  inner.className = 'avi-inner';
  inner.append(copy, table);

  block.replaceChildren(inner);
}
