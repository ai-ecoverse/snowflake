/**
 * pillar-router — Product pillar accordion / scroll-driven router
 *
 * Authoring rows (positional):
 *   1. eyebrow text (e.g. "SOLUTIONS ( 9 )")
 *   2. h2 section headline
 *   3..N. Pillar rows — each row: col1 = label | col2 = tagline
 *
 * Note: CTA links inside pillar cards are plain <a>; not buttons.
 */

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  function cell(row, idx = 0) { return row?.children[idx] || null; }

  const eyebrowRow = rows[0];
  const headlineRow = rows[1];
  const pillarRows = rows.slice(2);

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

  const router = document.createElement('div');
  router.className = 'hub-router';
  router.setAttribute('role', 'tablist');
  router.setAttribute('aria-label', 'Product pillars');

  pillarRows.forEach((row, i) => {
    const label = cell(row, 0)?.textContent.trim() || '';
    const tagline = cell(row, 1)?.textContent.trim() || '';
    const slug = label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const card = document.createElement('article');
    card.className = `hub-card${i === 0 ? ' is-active' : ''}`;
    card.dataset.pillar = slug;
    card.dataset.pillarIndex = i;
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'tab');
    card.setAttribute('aria-selected', i === 0 ? 'true' : 'false');

    const labelEl = document.createElement('p');
    labelEl.className = 'hub-label';
    labelEl.textContent = label;

    const taglineEl = document.createElement('h3');
    taglineEl.className = 'hub-tagline t-title-3';
    taglineEl.textContent = tagline;

    const cta = document.createElement('span');
    cta.className = 'hub-cta';
    cta.setAttribute('aria-hidden', 'true');
    cta.textContent = 'Expand';

    card.append(labelEl, taglineEl, cta);

    // Keyboard + click activation
    card.addEventListener('click', () => activate(card, router));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(card, router); }
    });

    router.append(card);
  });

  block.replaceChildren(header, router);
}

function activate(card, router) {
  [...router.querySelectorAll('.hub-card')].forEach((c) => {
    c.classList.toggle('is-active', c === card);
    c.setAttribute('aria-selected', c === card ? 'true' : 'false');
  });
}
