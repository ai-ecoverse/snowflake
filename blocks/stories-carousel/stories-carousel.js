/**
 * stories-carousel — testimonials in horizontal scroll
 *
 * Authoring rows (positional):
 *   1. Eyebrow text
 *   2. h2 headline
 *   3. Body paragraph
 *   4..N Card rows — 4 cells: logo-image | quote | name | role
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const cell = (row, i) => [...row.children][i];

  // Header rows
  const eyebrowText = cell(rows[0], 0)?.textContent?.trim() || '';
  const headlineEl  = cell(rows[1], 0);
  const bodyEl      = cell(rows[2], 0);

  // Card rows
  const cardRows = rows.slice(3);

  // Section header
  const header = document.createElement('header');
  header.className = 'section-header';

  if (eyebrowText) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 't-eyebrow';
    eyebrow.textContent = eyebrowText;
    header.appendChild(eyebrow);
  }

  if (headlineEl) {
    const h2 = document.createElement('h2');
    h2.className = 't-title-2';
    h2.innerHTML = headlineEl.innerHTML;
    header.appendChild(h2);
  }

  if (bodyEl) {
    const p = document.createElement('p');
    p.className = 't-body-m';
    p.innerHTML = bodyEl.innerHTML;
    header.appendChild(p);
  }

  // Stories track
  const track = document.createElement('div');
  track.className = 'stories-track';
  track.id = 'stories-track';
  track.setAttribute('tabindex', '0');
  track.setAttribute('aria-label', 'Customer story carousel');

  cardRows.forEach((row) => {
    const logoEl  = cell(row, 0);
    const quoteEl = cell(row, 1);
    const nameEl  = cell(row, 2);
    const roleEl  = cell(row, 3);

    const card = document.createElement('article');
    card.className = 'story-card';

    // Logo
    const logoWrap = document.createElement('div');
    logoWrap.className = 'company-logo';
    if (logoEl) {
      logoWrap.innerHTML = logoEl.innerHTML;
    }
    card.appendChild(logoWrap);

    // Quote
    const blockquote = document.createElement('blockquote');
    if (quoteEl) {
      blockquote.innerHTML = quoteEl.innerHTML;
    }
    card.appendChild(blockquote);

    // Person row
    const personRow = document.createElement('div');
    personRow.className = 'person-row';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'name';
    if (nameEl) nameSpan.innerHTML = nameEl.innerHTML;
    personRow.appendChild(nameSpan);

    const roleSpan = document.createElement('span');
    roleSpan.className = 'role';
    if (roleEl) roleSpan.innerHTML = roleEl.innerHTML;
    personRow.appendChild(roleSpan);

    card.appendChild(personRow);
    track.appendChild(card);
  });

  // Nav dots
  const dotsCount = Math.min(4, cardRows.length > 0 ? 4 : 0);
  const nav = document.createElement('nav');
  nav.className = 'stories-nav';
  nav.setAttribute('aria-label', 'Stories navigation');
  const dots = [];
  for (let i = 0; i < dotsCount; i += 1) {
    const dot = document.createElement('span');
    dot.className = i === 0 ? 'dot is-active' : 'dot';
    dots.push(dot);
    nav.appendChild(dot);
  }

  // Dot interaction
  if (dots.length) {
    track.addEventListener('scroll', () => {
      const ratio = track.scrollLeft / Math.max(1, track.scrollWidth - track.clientWidth);
      const idx = Math.min(dots.length - 1, Math.floor(ratio * dots.length));
      dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
    }, { passive: true });

    dots.forEach((d, i) => {
      d.addEventListener('click', () => {
        const step = (track.scrollWidth - track.clientWidth) / Math.max(1, dots.length - 1);
        track.scrollTo({ left: i * step, behavior: 'smooth' });
      });
    });
  }

  block.replaceChildren(header, track, nav);
}
