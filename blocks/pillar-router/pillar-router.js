/**
 * pillar-router — 5-card click-activated pillar grid with section header
 *
 * Authoring rows (positional):
 *   1. Section eyebrow (small caps)
 *   2. Section headline (h2)
 *   3..N: card rows — cells: label | tagline | cta-text
 *         Card rows must each have 3 cells. First card is rendered active by default.
 */

function row(rows, i) { return rows[i]?.firstElementChild; }
function rowCells(rowEl) { return rowEl ? [...rowEl.children] : []; }
function text(cell) { return cell ? cell.textContent.trim() : ''; }

function buildCard(cells, isActive) {
  const card = document.createElement('article');
  card.className = 'hub-card' + (isActive ? ' is-active' : '');
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');

  const [labelCell, taglineCell, ctaCell] = cells;
  const tagline = taglineCell?.querySelector('h3, h4') || (() => {
    const h = document.createElement('h3');
    h.textContent = text(taglineCell);
    return h;
  })();
  tagline.className = 'hub-tagline t-title-3';

  card.innerHTML = `<p class="hub-label">${text(labelCell)}</p>`;
  card.append(tagline);
  card.insertAdjacentHTML('beforeend', `<span class="hub-cta" aria-label="Expand">${text(ctaCell) || 'Expand'}</span>`);
  return card;
}

function activate(card, cards) {
  cards.forEach((c) => c.classList.remove('is-active'));
  card.classList.add('is-active');
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

  const router = document.createElement('div');
  router.className = 'hub-router';
  router.setAttribute('role', 'tablist');
  router.setAttribute('aria-label', 'Product pillars');

  const cards = [];
  rows.slice(2).forEach((r, idx) => {
    const cells = rowCells(r);
    if (!cells.length) return;
    const card = buildCard(cells, idx === 0);
    cards.push(card);
    router.append(card);
  });

  cards.forEach((card) => {
    card.addEventListener('click', () => activate(card, cards));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate(card, cards);
      }
    });
  });

  block.replaceChildren(header, router);
}
