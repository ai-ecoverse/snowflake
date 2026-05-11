/**
 * stats-section — Trust stats grid (v3 cinematic, L2+S5 strata overlap)
 *
 * Authoring rows (positional):
 *   1. eyebrow text
 *   2. h2 headline
 *   3..N. Stat rows — col1 = figure | col2 = label | col3 = supporting text
 *   Last row: optional CTA link (if only one cell and contains an <a>)
 */

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  function cell(row, idx = 0) { return row?.children[idx] || null; }

  const eyebrowRow = rows[0];
  const headlineRow = rows[1];

  // Determine stat rows vs cta row
  const dataRows = rows.slice(2);
  let statRows = dataRows;
  let ctaRow = null;

  const last = dataRows[dataRows.length - 1];
  if (last && last.children.length === 1 && last.querySelector('a')) {
    ctaRow = last;
    statRows = dataRows.slice(0, -1);
  }

  const header = document.createElement('header');
  header.className = 'section-header';

  if (eyebrowRow) {
    const p = document.createElement('p');
    p.className = 't-eyebrow t-caption is-upper';
    p.textContent = cell(eyebrowRow)?.textContent.trim() || '';
    header.append(p);
  }

  if (headlineRow) {
    const h2 = document.createElement('h2');
    h2.className = 't-title-2 is-upper deck';
    h2.innerHTML = cell(headlineRow)?.innerHTML || '';
    header.append(h2);
  }

  const statsRow = document.createElement('div');
  statsRow.className = 'stats-row';

  statRows.forEach((row) => {
    const figure = cell(row, 0)?.textContent.trim() || '';
    const label = cell(row, 1)?.textContent.trim() || '';
    const sub = cell(row, 2)?.textContent.trim() || '';

    const card = document.createElement('article');
    card.className = 'stat-card';

    const figEl = document.createElement('p');
    figEl.className = 'stat-figure';
    figEl.textContent = figure;

    const labelEl = document.createElement('p');
    labelEl.className = 'stat-label';
    labelEl.textContent = label;

    const subEl = document.createElement('p');
    subEl.className = 'stat-sub';
    subEl.textContent = sub;

    card.append(figEl, labelEl, subEl);
    statsRow.append(card);
  });

  const children = [header, statsRow];

  if (ctaRow) {
    const ctaWrap = document.createElement('div');
    ctaWrap.className = 'stats-cta-row';
    [...cell(ctaRow)?.childNodes || []].forEach((n) => ctaWrap.append(n.cloneNode(true)));
    children.push(ctaWrap);
  }

  block.replaceChildren(...children);
}
