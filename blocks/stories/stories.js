/**
 * stories — testimonial carousel (scroll-snap on all viewports, no JS animation)
 *
 * Authoring rows (positional):
 *   1. Section eyebrow
 *   2. Section headline
 *   3..N: card rows — cells: logo-text | quote | name | role | stat-figure | stat-sub
 *         logo-text is rendered as text inside a placeholder box
 *         stat-figure + stat-sub are optional; if both empty, that section is skipped
 */

function row(rows, i) { return rows[i]?.firstElementChild; }
function rowCells(rowEl) { return rowEl ? [...rowEl.children] : []; }
function text(cell) { return cell ? cell.textContent.trim() : ''; }

function buildCard(cells) {
  const [logo, quote, name, role, figure, sub] = cells.map(text);
  const card = document.createElement('article');
  card.className = 'story-card';
  card.innerHTML = `
    <div class="company-logo"><span>${logo || ''}</span></div>
    <blockquote>${quote || ''}</blockquote>
    <div class="person-row">
      <span class="name">${name || ''}</span>
      <span class="role">${role || ''}</span>
    </div>
  `;
  if (figure || sub) {
    const stat = document.createElement('div');
    stat.className = 'flag-stat';
    stat.innerHTML = `
      <span class="figure">${figure || ''}</span>
      <span class="sub">${sub || ''}</span>
    `;
    card.append(stat);
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
  header.className = 'stories-section-header';
  header.innerHTML = `<p class="t-eyebrow t-caption is-upper">${eyebrow}</p>`;
  header.append(heading);

  const viewport = document.createElement('div');
  viewport.className = 'stories-viewport';

  const track = document.createElement('div');
  track.className = 'stories-track';

  rows.slice(2).forEach((r) => {
    const cells = rowCells(r);
    if (!cells.length) return;
    track.append(buildCard(cells));
  });

  viewport.append(track);
  block.replaceChildren(header, viewport);
}
