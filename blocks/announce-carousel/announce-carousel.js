/**
 * announce-carousel — Paged 3-up text card carousel with prev/next arrows.
 *
 * Authoring rows (positional):
 *   1.   Section title
 *   2–N. Card rows, each with 3 cells: eyebrow | title | CTA link
 */

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const titleCell = rows[0]?.firstElementChild;
  const cardRows  = rows.slice(1);

  // ── Section header ─────────────────────────────────────────────────────────
  const header = document.createElement('div');
  header.className = 'announce-carousel__header';

  if (titleCell) {
    const h2 = document.createElement('h2');
    h2.className = 'announce-carousel__title';
    h2.textContent = titleCell.textContent.trim();
    header.append(h2);
  }

  // ── Viewport + track ───────────────────────────────────────────────────────
  const viewport = document.createElement('div');
  viewport.className = 'announce-carousel__viewport';

  const track = document.createElement('div');
  track.className = 'announce-carousel__track';

  cardRows.forEach((row) => {
    const cells   = [...row.children];
    const eyebrow = cells[0]?.textContent.trim() || '';
    const title   = cells[1]?.textContent.trim() || '';
    const ctaLink = cells[2]?.querySelector('a');

    const article = document.createElement('article');
    article.className = 'announce-card';

    const eyebrowEl = document.createElement('p');
    eyebrowEl.className = 'announce-card__eyebrow';
    eyebrowEl.textContent = eyebrow;

    const titleEl = document.createElement('p');
    titleEl.className = 'announce-card__title';
    titleEl.textContent = title;

    article.append(eyebrowEl, titleEl);

    if (ctaLink) {
      const a = ctaLink.cloneNode(true);
      a.className = 'announce-card__cta';
      article.append(a);
    }

    track.append(article);
  });

  viewport.append(track);

  // ── Controls ───────────────────────────────────────────────────────────────
  const controls = document.createElement('div');
  controls.className = 'announce-carousel__controls';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'announce-carousel__arrow';
  prevBtn.type = 'button';
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.innerHTML = `<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M7.5 2L3.5 6L7.5 10"/></svg>`;

  const nextBtn = document.createElement('button');
  nextBtn.className = 'announce-carousel__arrow';
  nextBtn.type = 'button';
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.innerHTML = `<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4.5 2L8.5 6L4.5 10"/></svg>`;

  controls.append(prevBtn, nextBtn);

  block.replaceChildren(header, viewport, controls);

  // ── Carousel logic ─────────────────────────────────────────────────────────
  const cards = [...track.querySelectorAll('.announce-card')];
  const total = cards.length;
  let page = 0;

  function getPerPage() {
    const w = window.innerWidth;
    if (w <= 767) return 1;
    if (w <= 1023) return 2;
    return 3;
  }

  function update() {
    const perPage = getPerPage();
    const pages = Math.ceil(total / perPage);
    const offset = page * (100 / perPage);
    track.style.transform = `translateX(-${offset}%)`;
    prevBtn.disabled = page === 0;
    nextBtn.disabled = page >= pages - 1;
  }

  prevBtn.addEventListener('click', () => { if (page > 0) { page -= 1; update(); } });
  nextBtn.addEventListener('click', () => {
    const perPage = getPerPage();
    const pages = Math.ceil(total / perPage);
    if (page < pages - 1) { page += 1; update(); }
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { page = 0; update(); }, 150);
  });

  update();
}
