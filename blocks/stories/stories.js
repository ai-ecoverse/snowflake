/**
 * stories — Customer stories carousel
 *
 * Authoring rows (positional):
 *   1. eyebrow
 *   2. h2 headline
 *   3. body paragraph (optional — used in standard variant)
 *   4..N. Story card rows — col1=company name/logo | col2=quote | col3=name | col4=role
 *
 * Variants: stories (standard) | stories cinematic (scroll-scrubbed horizontal)
 */

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const isCinematic = block.classList.contains('cinematic');

  function cell(row, idx = 0) { return row?.children[idx] || null; }

  // Header rows (eyebrow + headline + optional body)
  let headerRowCount = 2;
  const maybeBody = rows[2];
  if (maybeBody && maybeBody.children.length === 1 && !maybeBody.querySelector('a')) {
    headerRowCount = 3;
  }

  const [eyebrowRow, headlineRow] = rows;
  const bodyRow = headerRowCount === 3 ? rows[2] : null;
  const cardRows = rows.slice(headerRowCount);

  const header = document.createElement('header');
  header.className = isCinematic ? 'stories-section-header' : 'section-header';

  if (eyebrowRow) {
    const p = document.createElement('p');
    p.className = isCinematic ? 't-eyebrow t-caption is-upper' : 't-eyebrow';
    p.textContent = cell(eyebrowRow)?.textContent.trim() || '';
    header.append(p);
  }

  if (headlineRow) {
    const h2 = document.createElement('h2');
    h2.className = isCinematic ? 't-title-2 is-upper deck' : 't-title-2';
    h2.innerHTML = cell(headlineRow)?.innerHTML || '';
    header.append(h2);
  }

  if (bodyRow) {
    const p = document.createElement('p');
    p.className = 't-body-m';
    p.innerHTML = cell(bodyRow)?.innerHTML || '';
    header.append(p);
  }

  // Track
  const track = document.createElement('div');
  track.className = 'stories-track';
  track.setAttribute('tabindex', '0');
  track.setAttribute('aria-label', 'Customer story carousel');

  cardRows.forEach((row) => {
    const company = cell(row, 0)?.textContent.trim() || '';
    const quote = cell(row, 1)?.innerHTML || '';
    const name = cell(row, 2)?.textContent.trim() || '';
    const role = cell(row, 3)?.textContent.trim() || '';

    const card = document.createElement('article');
    card.className = 'story-card';

    const logo = document.createElement('div');
    logo.className = 'company-logo';
    logo.textContent = company;
    card.append(logo);

    if (quote) {
      const bq = document.createElement('blockquote');
      bq.innerHTML = quote;
      card.append(bq);
    }

    if (name || role) {
      const personRow = document.createElement('div');
      personRow.className = 'person-row';
      if (name) {
        const nameEl = document.createElement('span');
        nameEl.className = 'name';
        nameEl.textContent = name;
        personRow.append(nameEl);
      }
      if (role) {
        const roleEl = document.createElement('span');
        roleEl.className = 'role';
        roleEl.textContent = role;
        personRow.append(roleEl);
      }
      card.append(personRow);
    }

    track.append(card);
  });

  // Dot navigation for standard variant
  const nav = document.createElement('nav');
  nav.className = 'stories-nav';
  nav.setAttribute('aria-label', 'Story navigation');

  let currentIdx = 0;

  cardRows.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `dot${i === 0 ? ' is-active' : ''}`;
    dot.setAttribute('aria-label', `Story ${i + 1}`);
    dot.addEventListener('click', () => {
      currentIdx = i;
      updateCarousel();
    });
    nav.append(dot);
  });

  const viewport = document.createElement('div');
  viewport.className = 'stories-viewport';
  viewport.append(track);

  block.replaceChildren(header, viewport, nav);

  function updateCarousel() {
    const cards = [...track.querySelectorAll('.story-card')];
    const cardW = cards[0]?.offsetWidth || 380;
    const gap = 16;
    track.style.transform = `translateX(-${currentIdx * (cardW + gap)}px)`;
    [...nav.querySelectorAll('.dot')].forEach((d, i) => d.classList.toggle('is-active', i === currentIdx));
  }

  // Cinematic: GSAP horizontal scroll-scrub
  if (isCinematic && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    nav.remove(); // dots not used in cinematic
    await loadCinematicHorizontalScrub(track, block);
  }
}

async function loadCinematicHorizontalScrub(track, block) {
  if (!window.gsap) {
    await Promise.all([
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js'),
    ]);
    window.gsap.registerPlugin(window.ScrollTrigger);
  }

  const { gsap, ScrollTrigger } = window;
  const vp = block.querySelector('.stories-viewport');

  ScrollTrigger.create({
    trigger: block.closest('.section') || block,
    pin: true,
    scrub: 1,
    start: 'top top',
    end: () => `+=${track.scrollWidth - (vp?.offsetWidth || window.innerWidth)}`,
    onUpdate: (self) => {
      const max = track.scrollWidth - (vp?.offsetWidth || window.innerWidth);
      track.style.transform = `translateX(-${self.progress * max}px)`;
    },
  });
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.append(s);
  });
}
