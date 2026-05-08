/**
 * announce-carousel — paged 3-up text card carousel
 *
 * Authoring rows (positional):
 *   1. section title (h2)
 *   2–N. card rows: eyebrow | title | CTA link
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const titleCell = rows[0]?.firstElementChild;
  const cardRows = rows.slice(1);

  const headerEl = document.createElement('div');
  headerEl.className = 'announce-carousel__header';
  const h = document.createElement('h2');
  h.className = 'announce-carousel__title';
  h.textContent = titleCell?.textContent.trim() || '';
  headerEl.append(h);

  const viewport = document.createElement('div');
  viewport.className = 'announce-carousel__viewport';
  const track = document.createElement('div');
  track.className = 'announce-carousel__track';
  track.id = 'announceTrack';

  cardRows.forEach(row => {
    const cells = [...row.children];
    const eyebrow = cells[0]?.textContent.trim();
    const title = cells[1]?.textContent.trim();
    const link = cells[2]?.querySelector('a');

    const article = document.createElement('article');
    article.className = 'announce-card';

    const e = document.createElement('p');
    e.className = 'announce-card__eyebrow';
    e.textContent = eyebrow;

    const t = document.createElement('p');
    t.className = 'announce-card__title';
    t.textContent = title;

    article.append(e, t);
    if (link) {
      const a = link.cloneNode(true);
      a.className = 'announce-card__cta';
      article.append(a);
    }
    track.append(article);
  });
  viewport.append(track);

  // Controls
  const controls = document.createElement('div');
  controls.className = 'announce-carousel__controls';
  const prev = document.createElement('button');
  prev.id = 'announcePrev';
  prev.className = 'announce-carousel__arrow';
  prev.type = 'button';
  prev.setAttribute('aria-label', 'Previous');
  prev.innerHTML = `<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M7.5 2L3.5 6L7.5 10"/></svg>`;
  const next = document.createElement('button');
  next.id = 'announceNext';
  next.className = 'announce-carousel__arrow';
  next.type = 'button';
  next.setAttribute('aria-label', 'Next');
  next.innerHTML = `<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4.5 2L8.5 6L4.5 10"/></svg>`;
  controls.append(prev, next);

  block.replaceChildren(headerEl, viewport, controls);

  // Carousel logic
  let idx = 0;
  function perPage() {
    return window.innerWidth >= 1024 ? 3 : (window.innerWidth >= 768 ? 2 : 1);
  }
  function maxIdx() {
    return Math.max(0, track.children.length - perPage());
  }
  function step() {
    const max = maxIdx();
    if (idx > max) idx = max;
    if (idx < 0) idx = 0;
    const card = track.querySelector('.announce-card');
    const w = card ? card.offsetWidth + 8 : 320;
    track.style.transform = `translateX(${-idx * w}px)`;
    prev.disabled = idx === 0;
    next.disabled = idx === max;
  }
  prev.addEventListener('click', () => { idx--; step(); });
  next.addEventListener('click', () => { idx++; step(); });
  window.addEventListener('resize', step, { passive: true });
  step();
}
