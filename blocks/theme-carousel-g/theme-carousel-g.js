/**
 * theme-carousel-g — Stacked-Pair Tile carousel (variant G), 4-up.
 *
 * Authoring rows:
 *   Row 1: heading text
 *   Row 2: description text
 *   Row 3: quick links — "Label|URL, Label|URL, ..."
 *   Row 4+: tile rows — cells: image | eyebrow | headline | CTA text | URL
 *
 * Supports "dark" variant class.
 */

function buildArrows(label) {
  const group = document.createElement('div');
  group.className = 'theme-arrows';
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', `${label} carousel controls`);
  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'theme-arrow theme-arrow-prev';
  prev.setAttribute('aria-label', `Previous ${label} stories`);
  prev.textContent = '\u2039';
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'theme-arrow theme-arrow-next';
  next.setAttribute('aria-label', `Next ${label} stories`);
  next.textContent = '\u203A';
  group.append(prev, next);
  return { group, prev, next };
}

function initScroll(track, prev, next) {
  function pageWidth() { return track.clientWidth; }
  prev.addEventListener('click', () => track.scrollBy({ left: -pageWidth(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: pageWidth(), behavior: 'smooth' }));
  track.setAttribute('tabindex', '0');
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); track.scrollBy({ left: -pageWidth(), behavior: 'smooth' }); }
    if (e.key === 'ArrowRight') { e.preventDefault(); track.scrollBy({ left: pageWidth(), behavior: 'smooth' }); }
  });
  function updateState() {
    const max = track.scrollWidth - track.clientWidth - 4;
    prev.disabled = track.scrollLeft <= 4;
    next.disabled = track.scrollLeft >= max;
  }
  track.addEventListener('scroll', updateState, { passive: true });
  window.addEventListener('resize', updateState);
  updateState();
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 4) return;

  const isDark = block.classList.contains('dark');
  const headingText = rows[0]?.firstElementChild?.textContent.trim() || '';
  const descText = rows[1]?.firstElementChild?.textContent.trim() || '';
  const quicklinksRaw = rows[2]?.firstElementChild?.textContent.trim() || '';
  const tileRows = rows.slice(3);

  const container = document.createElement('div');
  container.className = 'theme-container';

  const header = document.createElement('div');
  header.className = 'theme-header';
  const h2 = document.createElement('h2');
  h2.textContent = headingText;
  header.append(h2);
  const { group: arrowGroup, prev, next } = buildArrows(headingText);
  header.append(arrowGroup);
  container.append(header);

  if (descText) {
    const desc = document.createElement('p');
    desc.className = 'theme-description';
    desc.textContent = descText;
    container.append(desc);
  }

  if (quicklinksRaw) {
    const nav = document.createElement('nav');
    nav.className = 'theme-quicklinks';
    nav.setAttribute('aria-label', `${headingText} quick links`);
    const label = document.createElement('span');
    label.className = 'quicklinks-label';
    label.textContent = 'Quick Links';
    nav.append(label);
    const row = document.createElement('div');
    row.className = 'quicklinks-row';
    quicklinksRaw.split(',').forEach((pair) => {
      const [text, url] = pair.split('|').map((s) => s.trim());
      if (text && url) {
        const a = document.createElement('a');
        a.className = 'quicklink';
        a.href = url;
        a.textContent = text;
        row.append(a);
      }
    });
    nav.append(row);
    container.append(nav);
  }

  const carousel = document.createElement('div');
  carousel.className = 'theme-carousel';
  const track = document.createElement('div');
  track.className = 'theme-carousel-track';
  track.setAttribute('role', 'region');
  track.setAttribute('aria-roledescription', 'carousel');
  track.setAttribute('aria-label', `${headingText} stories`);

  tileRows.forEach((tileRow) => {
    const cells = [...tileRow.children];
    const img = cells[0]?.querySelector('picture, img');
    const eyebrow = cells[1]?.textContent.trim() || '';
    const headline = cells[2]?.textContent.trim() || '';
    const ctaText = cells[3]?.textContent.trim() || 'Learn more';
    const url = cells[4]?.textContent.trim() || '#';

    const tile = document.createElement('a');
    tile.className = 'tile-g';
    tile.href = url;

    const photo = document.createElement('div');
    photo.className = 'tile-g-photo';
    if (img) photo.append(img.cloneNode(true));
    tile.append(photo);

    const body = document.createElement('div');
    body.className = 'tile-g-body';

    const ey = document.createElement('span');
    ey.className = 'tile-g-eyebrow';
    ey.textContent = eyebrow;
    body.append(ey);

    const h3 = document.createElement('h3');
    h3.textContent = headline;
    body.append(h3);

    const cta = document.createElement('span');
    cta.className = 'tile-g-cta';
    cta.textContent = ctaText;
    body.append(cta);

    tile.append(body);
    track.append(tile);
  });

  carousel.append(track);
  container.append(carousel);
  block.replaceChildren(container);

  if (isDark) block.closest('.section')?.classList.add('surface-dark');
  initScroll(track, prev, next);
}
