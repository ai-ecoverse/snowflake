/**
 * Theme Carousel Portrait Block — Variant C: Cinematic Hero-Tile (4:5)
 * Authoring rows:
 *   Row 1: section heading (h2)
 *   Row 2: description text
 *   Row 3: quick links (multiple <a> elements)
 *   Rows 4+: tiles — Cell 0: img/picture, Cell 1: eyebrow, Cell 2: h3, Cell 3: cta link
 */

function initReveal(el) {
  el.classList.add('reveal-init');
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.classList.add('reveal-in');
    return;
  }
  if (!('IntersectionObserver' in window)) {
    el.classList.add('reveal-in');
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  obs.observe(el);
}

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 4) return;

  const surfaceClass = [...block.classList].find((c) => c.startsWith('surface-')) || 'surface-dark';

  // Row 1: heading
  const headingCell = rows[0].firstElementChild;
  const h2 = headingCell?.querySelector('h2') || (() => {
    const el = document.createElement('h2');
    el.textContent = headingCell?.textContent?.trim() || '';
    return el;
  })();

  // Row 2: description
  const descCell = rows[1].firstElementChild;

  // Row 3: quick links
  const linksCell = rows[2].firstElementChild;
  const links = linksCell ? [...linksCell.querySelectorAll('a')] : [];

  // Rows 4+: tiles
  const tileRows = rows.slice(3);

  // Build wrapper
  const wrapper = document.createElement('div');
  wrapper.className = `theme-carousel-portrait-wrapper ${surfaceClass}`;

  const container = document.createElement('div');
  container.className = 'container';
  wrapper.appendChild(container);

  // Header
  const header = document.createElement('div');
  header.className = 'theme-header';

  const headingClone = h2.cloneNode(true);
  header.appendChild(headingClone);

  const arrows = document.createElement('div');
  arrows.className = 'theme-arrows';
  arrows.setAttribute('role', 'group');
  arrows.setAttribute('aria-label', `${h2.textContent.trim()} carousel controls`);

  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'theme-arrow theme-arrow-prev';
  prevBtn.setAttribute('aria-label', `Previous ${h2.textContent.trim()} stories`);
  prevBtn.textContent = '‹';

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'theme-arrow theme-arrow-next';
  nextBtn.setAttribute('aria-label', `Next ${h2.textContent.trim()} stories`);
  nextBtn.textContent = '›';

  arrows.appendChild(prevBtn);
  arrows.appendChild(nextBtn);
  header.appendChild(arrows);
  container.appendChild(header);

  // Description
  const descP = document.createElement('p');
  descP.className = 'theme-description';
  descP.innerHTML = descCell?.innerHTML || '';
  container.appendChild(descP);

  // Quick links
  if (links.length) {
    const quicklinks = document.createElement('nav');
    quicklinks.className = 'theme-quicklinks';
    quicklinks.setAttribute('aria-label', `${h2.textContent.trim()} quick links`);

    const label = document.createElement('span');
    label.className = 'quicklinks-label';
    label.textContent = 'Quick Links';
    quicklinks.appendChild(label);

    const row = document.createElement('div');
    row.className = 'quicklinks-row';
    links.forEach((a) => {
      const link = document.createElement('a');
      link.className = 'quicklink';
      link.href = a.href;
      link.textContent = a.textContent.trim();
      row.appendChild(link);
    });
    quicklinks.appendChild(row);
    container.appendChild(quicklinks);
  }

  // Carousel track
  const trackWrapper = document.createElement('div');
  trackWrapper.className = 'theme-carousel-track-wrapper';

  const track = document.createElement('div');
  track.className = 'theme-carousel-track';
  track.setAttribute('role', 'region');
  track.setAttribute('aria-roledescription', 'carousel');
  track.setAttribute('aria-label', `${h2.textContent.trim()} stories`);

  tileRows.forEach((row) => {
    const cells = [...row.children];
    const imgEl = cells[0]?.querySelector('img, picture');
    const eyebrow = cells[1]?.textContent?.trim() || '';
    const h3El = cells[2]?.querySelector('h3') || cells[2];
    const headlineText = h3El?.textContent?.trim() || '';
    const ctaA = cells[3]?.querySelector('a');
    const ctaHref = ctaA?.href || '#';
    const ctaText = ctaA?.textContent?.trim() || 'Learn More';

    const tile = document.createElement('a');
    tile.className = 'tile-c';
    tile.href = ctaHref;

    if (imgEl) {
      const media = imgEl.cloneNode(true);
      if (media.tagName === 'PICTURE') {
        const img = media.querySelector('img');
        if (img) {
          img.style.position = 'absolute';
          img.style.inset = '0';
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'cover';
        }
      }
      tile.appendChild(media);
    } else {
      const empty = document.createElement('div');
      empty.className = 'tile-c-photo-empty';
      tile.appendChild(empty);
    }

    const scrim = document.createElement('div');
    scrim.className = 'tile-c-scrim';
    scrim.setAttribute('aria-hidden', 'true');
    tile.appendChild(scrim);

    const content = document.createElement('div');
    content.className = 'tile-c-content';

    const eyebrowEl = document.createElement('div');
    eyebrowEl.className = 'tile-c-eyebrow';
    eyebrowEl.textContent = eyebrow;
    content.appendChild(eyebrowEl);

    const hl = document.createElement('h3');
    hl.textContent = headlineText;
    content.appendChild(hl);

    const cta = document.createElement('span');
    cta.className = 'tile-c-cta';
    cta.textContent = ctaText;
    content.appendChild(cta);

    tile.appendChild(content);
    track.appendChild(tile);
  });

  trackWrapper.appendChild(track);
  container.appendChild(trackWrapper);

  block.replaceWith(wrapper);

  // Arrow controls
  function pageWidth() { return track.clientWidth; }
  prevBtn.addEventListener('click', () => track.scrollBy({ left: -pageWidth(), behavior: 'smooth' }));
  nextBtn.addEventListener('click', () => track.scrollBy({ left: pageWidth(), behavior: 'smooth' }));

  track.setAttribute('tabindex', '0');
  track.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowLeft': e.preventDefault(); track.scrollBy({ left: -pageWidth(), behavior: 'smooth' }); break;
      case 'ArrowRight': e.preventDefault(); track.scrollBy({ left: pageWidth(), behavior: 'smooth' }); break;
      case 'Home': e.preventDefault(); track.scrollTo({ left: 0, behavior: 'smooth' }); break;
      case 'End': e.preventDefault(); track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' }); break;
      default: break;
    }
  });

  function updateArrows() {
    const max = track.scrollWidth - track.clientWidth - 4;
    prevBtn.disabled = track.scrollLeft <= 4;
    nextBtn.disabled = track.scrollLeft >= max;
  }

  track.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows);
  updateArrows();

  initReveal(wrapper);
}
