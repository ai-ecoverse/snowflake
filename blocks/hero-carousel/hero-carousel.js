/**
 * hero-carousel (H2) — 6-slide editorial carousel with WCAG 2.2.2 pause control
 *
 * Authoring rows (one row per slide):
 *   cell 1: background picture (responsive sources preferred)
 *   cell 2: eyebrow text
 *   cell 3: h1/h2 headline
 *   cell 4: description paragraph
 *   cell 5: CTA links — wrap primary in <strong>, secondary in <em>
 *
 * Auto-advances every 7s. Pauses on hover/focus. Respects prefers-reduced-motion.
 */

const ADVANCE_MS = 7000;

function buildSlide(row, idx) {
  const cells = [...row.children];
  const [imgCell, eyebrowCell, headlineCell, descCell, ctaCell] = cells;

  const article = document.createElement('article');
  article.className = `hero-slide${idx === 0 ? ' is-active' : ''}`;
  article.setAttribute('role', 'tabpanel');
  article.setAttribute('aria-roledescription', 'slide');
  article.id = `hc-slide-${idx}`;
  article.setAttribute('aria-labelledby', `hc-tab-${idx}`);

  // Photo
  const pic = imgCell?.querySelector('picture, img');
  if (pic) {
    pic.className = 'hero-photo';
    if (pic.tagName === 'IMG') { pic.setAttribute('loading', idx === 0 ? 'eager' : 'lazy'); pic.setAttribute('fetchpriority', idx === 0 ? 'high' : 'auto'); }
    if (pic.tagName === 'PICTURE') { const img = pic.querySelector('img'); if (img) { img.setAttribute('loading', idx === 0 ? 'eager' : 'lazy'); img.setAttribute('fetchpriority', idx === 0 ? 'high' : 'auto'); } }
    article.append(pic);
  }

  // Scrim
  const scrim = document.createElement('div');
  scrim.className = 'hero-scrim';
  scrim.setAttribute('aria-hidden', 'true');
  article.append(scrim);

  // Content
  const inner = document.createElement('div');
  inner.className = 'hero-inner';
  const content = document.createElement('div');
  content.className = 'hero-content';

  if (eyebrowCell) {
    const p = document.createElement('p');
    p.className = 'hero-eyebrow';
    p.textContent = eyebrowCell.textContent.trim();
    content.append(p);
  }
  if (headlineCell) {
    const hEl = headlineCell.querySelector('h1, h2, h3') || document.createElement(idx === 0 ? 'h1' : 'h2');
    hEl.className = 'hero-headline';
    if (!hEl.textContent) hEl.textContent = headlineCell.textContent.trim();
    content.append(hEl);
  }
  if (descCell) {
    const p = document.createElement('p');
    p.className = 'hero-description';
    p.textContent = descCell.textContent.trim();
    content.append(p);
  }
  if (ctaCell && ctaCell.querySelector('a')) {
    const row = document.createElement('div');
    row.className = 'hero-cta-row';
    [...ctaCell.childNodes].forEach((n) => row.append(n.cloneNode(true)));
    content.append(row);
  }

  inner.append(content);
  article.append(inner);
  return article;
}

function buildTab(row, idx) {
  const cells = [...row.children];
  const eyebrow = cells[1]?.textContent.trim() || '';
  const headline = cells[2]?.textContent.trim() || '';

  const btn = document.createElement('button');
  btn.className = `hero-tab${idx === 0 ? ' is-active' : ''}`;
  btn.type = 'button';
  btn.id = `hc-tab-${idx}`;
  btn.setAttribute('role', 'tab');
  btn.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
  btn.setAttribute('aria-controls', `hc-slide-${idx}`);
  btn.setAttribute('tabindex', idx === 0 ? '0' : '-1');
  btn.innerHTML = `
    <span class="hero-tab-progress" aria-hidden="true"></span>
    <span class="hero-tab-eyebrow">${eyebrow}</span>
    <span class="hero-tab-title">${headline}</span>
  `;
  return btn;
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const carousel = document.createElement('section');
  carousel.className = 'hero-carousel';
  carousel.setAttribute('aria-roledescription', 'carousel');
  carousel.setAttribute('aria-label', 'Featured announcements');

  // Slides
  const slidesWrap = document.createElement('div');
  slidesWrap.className = 'hero-slides';
  rows.forEach((row, i) => slidesWrap.append(buildSlide(row, i)));

  // Keyboard hint
  const hint = document.createElement('span');
  hint.className = 'hero-hint';
  hint.setAttribute('aria-hidden', 'true');
  hint.textContent = '← → TO NAVIGATE';

  // Switcher
  const switcher = document.createElement('div');
  switcher.className = 'hero-switcher';
  const switcherInner = document.createElement('div');
  switcherInner.className = 'hero-switcher-inner';

  const tablist = document.createElement('div');
  tablist.className = 'hero-tabs';
  tablist.setAttribute('role', 'tablist');
  tablist.setAttribute('aria-label', 'Choose featured story');
  const tabs = rows.map((row, i) => buildTab(row, i));
  tabs.forEach((t) => tablist.append(t));

  const pauseBtn = document.createElement('button');
  pauseBtn.className = 'hero-pause';
  pauseBtn.type = 'button';
  pauseBtn.setAttribute('aria-pressed', 'false');
  pauseBtn.setAttribute('aria-label', 'Pause carousel autoplay');
  pauseBtn.textContent = '⏸';

  const countdown = document.createElement('span');
  countdown.className = 'hero-countdown';
  countdown.setAttribute('aria-live', 'off');
  countdown.setAttribute('aria-hidden', 'true');
  countdown.innerHTML = 'AUTOPLAY · 7<span class="hero-countdown-unit">s</span>';

  switcherInner.append(tablist, pauseBtn, countdown);
  switcher.append(switcherInner);
  carousel.append(slidesWrap, hint, switcher);
  block.replaceChildren(carousel);

  // ── Behaviour ──────────────────────────────────────────────────────────────
  const slides = [...slidesWrap.querySelectorAll('.hero-slide')];
  let current = 0;
  let timer = null;
  let userPaused = false;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  function show(idx) {
    slides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
    tabs.forEach((t, i) => {
      t.classList.toggle('is-active', i === idx);
      t.setAttribute('aria-selected', i === idx ? 'true' : 'false');
      t.setAttribute('tabindex', i === idx ? '0' : '-1');
    });
    const prog = tabs[idx]?.querySelector('.hero-tab-progress');
    if (prog) { prog.style.animation = 'none'; prog.offsetHeight; prog.style.animation = ''; }
    current = idx;
  }

  function stop() { clearInterval(timer); timer = null; carousel.classList.add('is-paused'); }
  function start() {
    if (userPaused || reduced) return;
    stop();
    timer = setInterval(() => show((current + 1) % slides.length), ADVANCE_MS);
    carousel.classList.remove('is-paused');
  }

  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', () => { if (!userPaused) start(); });
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', (e) => { if (!carousel.contains(e.relatedTarget) && !userPaused) start(); });

  tabs.forEach((t, i) => {
    t.addEventListener('click', () => { show(i); start(); });
    t.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); const n = (i + 1) % slides.length; show(n); tabs[n].focus(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); const n = (i - 1 + slides.length) % slides.length; show(n); tabs[n].focus(); }
    });
  });

  pauseBtn.addEventListener('click', () => {
    userPaused = !userPaused;
    if (userPaused) { stop(); pauseBtn.setAttribute('aria-pressed', 'true'); pauseBtn.setAttribute('aria-label', 'Resume carousel autoplay'); pauseBtn.textContent = '▶'; }
    else { start(); pauseBtn.setAttribute('aria-pressed', 'false'); pauseBtn.setAttribute('aria-label', 'Pause carousel autoplay'); pauseBtn.textContent = '⏸'; }
  });

  if (reduced) { userPaused = true; pauseBtn.setAttribute('aria-pressed', 'true'); pauseBtn.setAttribute('aria-label', 'Resume carousel autoplay'); pauseBtn.textContent = '▶'; carousel.classList.add('is-paused'); }
  else { start(); }
}
