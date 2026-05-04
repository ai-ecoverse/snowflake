/**
 * hero-carousel — Full-bleed 6-slide autoplay hero with tab switcher.
 *
 * Authoring rows (positional, one per slide):
 *   Cell 1: <picture> hero background image
 *   Cell 2: eyebrow text
 *   Cell 3: headline text (becomes <h1> for first slide, <h2> for rest)
 *   Cell 4: description paragraph
 *   Cell 5: CTA links — wrap primary in <strong>; EDS decorator applies .btn.btn-primary
 */

const ADVANCE_MS = 7000;

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const slides = [];
  rows.forEach((row, i) => {
    const cells = [...row.children];
    slides.push({
      image: cells[0] ? cells[0].querySelector('picture') : null,
      eyebrow: cells[1] ? cells[1].textContent.trim() : '',
      headline: cells[2] ? cells[2].textContent.trim() : '',
      description: cells[3] ? cells[3].textContent.trim() : '',
      cta: cells[4] || null,
    });
  });

  // Build hero DOM
  const hero = document.createElement('div');
  hero.className = 'hero-carousel-inner';
  hero.setAttribute('aria-roledescription', 'carousel');
  hero.setAttribute('aria-label', 'Featured announcements');

  // Slides container
  const slidesEl = document.createElement('div');
  slidesEl.className = 'hero-slides';

  slides.forEach((slide, i) => {
    const article = document.createElement('article');
    article.className = `hero-slide${i === 0 ? ' is-active' : ''}`;
    article.setAttribute('role', 'tabpanel');
    article.setAttribute('aria-roledescription', 'slide');
    article.id = `hero-slide-${i}`;
    article.setAttribute('aria-labelledby', `hero-tab-${i}`);

    // Photo
    if (slide.image) {
      const photo = slide.image.cloneNode(true);
      photo.className = 'hero-photo';
      article.append(photo);
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

    if (slide.eyebrow) {
      const ey = document.createElement('p');
      ey.className = 'hero-eyebrow';
      ey.textContent = slide.eyebrow;
      content.append(ey);
    }

    if (slide.headline) {
      const hl = document.createElement(i === 0 ? 'h1' : 'h2');
      hl.className = 'hero-headline';
      hl.textContent = slide.headline;
      content.append(hl);
    }

    if (slide.description) {
      const desc = document.createElement('p');
      desc.className = 'hero-description';
      desc.textContent = slide.description;
      content.append(desc);
    }

    if (slide.cta) {
      const ctaRow = document.createElement('div');
      ctaRow.className = 'hero-cta-row';
      [...slide.cta.childNodes].forEach((n) => ctaRow.append(n.cloneNode(true)));
      content.append(ctaRow);
    }

    inner.append(content);
    article.append(inner);
    slidesEl.append(article);
  });

  hero.append(slidesEl);

  // Keyboard hint
  const hint = document.createElement('span');
  hint.className = 'hero-hint';
  hint.setAttribute('aria-hidden', 'true');
  hint.textContent = '\u2190 \u2192 TO NAVIGATE';
  hero.append(hint);

  // Switcher
  const switcher = document.createElement('div');
  switcher.className = 'hero-switcher';
  const switcherInner = document.createElement('div');
  switcherInner.className = 'hero-switcher-inner';

  const tablist = document.createElement('div');
  tablist.className = 'hero-tabs';
  tablist.setAttribute('role', 'tablist');
  tablist.setAttribute('aria-label', 'Choose featured story');

  slides.forEach((slide, i) => {
    const tab = document.createElement('button');
    tab.className = `hero-tab${i === 0 ? ' is-active' : ''}`;
    tab.type = 'button';
    tab.id = `hero-tab-${i}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    tab.setAttribute('aria-controls', `hero-slide-${i}`);
    tab.setAttribute('tabindex', i === 0 ? '0' : '-1');

    const progress = document.createElement('span');
    progress.className = 'hero-tab-progress';
    progress.setAttribute('aria-hidden', 'true');
    tab.append(progress);

    const eyebrow = document.createElement('span');
    eyebrow.className = 'hero-tab-eyebrow';
    eyebrow.textContent = slide.eyebrow;
    tab.append(eyebrow);

    const title = document.createElement('span');
    title.className = 'hero-tab-title';
    title.textContent = slide.headline;
    tab.append(title);

    tablist.append(tab);
  });

  switcherInner.append(tablist);

  // Pause button
  const pauseBtn = document.createElement('button');
  pauseBtn.className = 'hero-pause';
  pauseBtn.type = 'button';
  pauseBtn.setAttribute('aria-pressed', 'false');
  pauseBtn.setAttribute('aria-label', 'Pause carousel autoplay');
  pauseBtn.textContent = '\u23F8';
  switcherInner.append(pauseBtn);

  // Countdown
  const countdown = document.createElement('span');
  countdown.className = 'hero-countdown';
  countdown.setAttribute('aria-live', 'off');
  countdown.setAttribute('aria-hidden', 'true');
  countdown.textContent = 'AUTOPLAY \u00B7 7s';
  switcherInner.append(countdown);

  switcher.append(switcherInner);
  hero.append(switcher);

  block.replaceChildren(hero);

  // ─── Carousel logic ───
  const allSlides = block.querySelectorAll('.hero-slide');
  const allTabs = block.querySelectorAll('.hero-tab');
  let current = 0;
  let timer = null;
  let userPaused = false;

  function show(idx) {
    allSlides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
    allTabs.forEach((t, i) => {
      t.classList.toggle('is-active', i === idx);
      t.setAttribute('aria-selected', i === idx ? 'true' : 'false');
      t.setAttribute('tabindex', i === idx ? '0' : '-1');
    });
    // Retrigger progress animation
    const activeTab = allTabs[idx];
    if (activeTab) {
      const prog = activeTab.querySelector('.hero-tab-progress');
      if (prog) {
        prog.style.animation = 'none';
        prog.offsetHeight; // eslint-disable-line no-unused-expressions
        prog.style.animation = '';
      }
    }
    current = idx;
  }

  function next() { show((current + 1) % allSlides.length); }

  function start() {
    if (userPaused) return;
    stop();
    timer = setInterval(next, ADVANCE_MS);
    block.classList.remove('is-paused');
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
    block.classList.add('is-paused');
  }

  // Hover/focus pause
  block.addEventListener('mouseenter', stop);
  block.addEventListener('mouseleave', () => { if (!userPaused) start(); });
  block.addEventListener('focusin', stop);
  block.addEventListener('focusout', (e) => {
    if (!block.contains(e.relatedTarget) && !userPaused) start();
  });

  // Tab clicks + keyboard
  allTabs.forEach((t, i) => {
    t.addEventListener('click', () => { show(i); start(); });
    t.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const n = (i + 1) % allSlides.length;
        show(n);
        allTabs[n].focus();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const n = (i - 1 + allSlides.length) % allSlides.length;
        show(n);
        allTabs[n].focus();
      }
    });
  });

  // Pause button
  pauseBtn.addEventListener('click', () => {
    userPaused = !userPaused;
    if (userPaused) {
      stop();
      pauseBtn.setAttribute('aria-pressed', 'true');
      pauseBtn.setAttribute('aria-label', 'Resume carousel autoplay');
      pauseBtn.textContent = '\u25B6';
    } else {
      start();
      pauseBtn.setAttribute('aria-pressed', 'false');
      pauseBtn.setAttribute('aria-label', 'Pause carousel autoplay');
      pauseBtn.textContent = '\u23F8';
    }
  });

  // Reduced motion
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    userPaused = true;
    pauseBtn.setAttribute('aria-pressed', 'true');
    pauseBtn.setAttribute('aria-label', 'Resume carousel autoplay');
    pauseBtn.textContent = '\u25B6';
    stop();
  } else {
    start();
  }
}
