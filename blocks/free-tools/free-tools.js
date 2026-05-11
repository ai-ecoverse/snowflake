/**
 * free-tools — Scrollable free-tools strip
 *
 * Authoring rows (positional):
 *   1. eyebrow
 *   2. h2 headline
 *   3..N. Tool rows — col1 = tool name | col2 = href (optional)
 */

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  function cell(row, idx = 0) { return row?.children[idx] || null; }

  const eyebrowRow = rows[0];
  const headlineRow = rows[1];
  const toolRows = rows.slice(2);

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
    h2.className = 't-title-2';
    h2.innerHTML = cell(headlineRow)?.innerHTML || '';
    header.append(h2);
  }

  const track = document.createElement('div');
  track.className = 'tools-track';

  toolRows.forEach((row) => {
    const name = cell(row, 0)?.textContent.trim() || '';
    const href = cell(row, 1)?.textContent.trim() || '#';

    const card = document.createElement('article');
    card.className = 'tool-card';

    const nameEl = document.createElement('div');
    nameEl.className = 'tool-name';
    nameEl.textContent = name;

    const link = document.createElement('a');
    link.href = href;
    link.className = 'tool-link';
    link.setAttribute('aria-label', `Explore ${name}`);
    nameEl.append(link);

    const arrow = document.createElement('span');
    arrow.className = 'arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '→';

    card.append(nameEl, arrow);
    track.append(card);
  });

  block.replaceChildren(header, track);
}
