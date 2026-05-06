/**
 * Hero Carousel Block
 * Authoring: each row = one slide
 *   Cell 0: <picture> background image
 *   Cell 1: eyebrow text
 *   Cell 2: headline (<h1> for first slide, <h2> for rest)
 *   Cell 3: description text
 *   Cell 4: CTA link (wrap in <strong> for primary style)
 */

const ADVANCE_MS = 7000;

function buildSlide(row, index) {
  const cells = [...row.children];
  const pictureOrImg = cells[0]?.querySelector('picture, img');
  const eyebrow = cells[1]?.textContent?.trim() || '';
  const headlineEl = cells[2]?.querySelector('h1, h2, h3') || cells[2];
  const headlineText = headlineEl?.textContent?.trim() || '';
  const descText = cells[3]?.innerHTML || '';
  const ctaAnchor = cells[4]?.querySelector('a');
  const isPrimary = !!cells[4]?.querySelector('strong');

  const article = document.createElement('article');
  article.className = 'hero-slide';
  article.setAttribute('role', 'tabpanel');
  article.setAttribute('aria-roledescription', 'slide');
  article.id = `hero-slide-${index}`;
  article.setAttribute('aria-labelledby', `hero-tab-${index}`);

  if (pictureOrImg) {
    const media = pictureOrImg.cloneNode(true);
    if (media.tagName === 'PICTURE') {
      media.className = 'hero-photo';
      const img = media.querySelector('img');
      if (img) {
        img.className = '';
        img.removeAttribute('class');
      }
    } else {
      media.className = 'hero-photo';
      media.style.position = 'absolute';
      media.style.top = '0';
      media.style.right = '0';
      media.style.height = '100%';
      media.style.width = 'auto';
      media.style.maxWidth = 'none';
    }
    article.appendChild(media);
  }

  const scrim = document.createElement('div');
  scrim.className = 'hero-scrim';
  scrim.setAttribute('aria-hidden', 'true');
  article.appendChild(scrim);

  const inner = document.createElement('div');
  inner.className = 'hero-inner';
  const content = document.createElement('div');
  content.className = 'hero-content';

  const eyebrowEl = document.createElement('p');
  eyebrowEl.className = 'hero-eyebrow';
  eyebrowEl.textContent = eyebrow;
  content.appendChild(eyebrowEl);

  const hl = document.createElement(index === 0 ? 'h1' : 'h2');
  hl.className = 'hero-headline';
  hl.textContent = headlineText;
  content.appendChild(hl);

  const desc = document.createElement('p');
  desc.className = 'hero-description';
  desc.innerHTML = descText;
  content.appendChild(desc);

  if (ctaAnchor) {
    const ctaRow = document.createElement('div');
    ctaRow.className = 'hero-cta-row';
    const a = document.createElement('a');
    a.className = isPrimary ? 'btn btn-primary' : 'btn btn-secondary';
    a.href = ctaAnchor.href;
    a.textContent = ctaAnchor.textContent.trim();
    ctaRow.appendChild(a);
    content.appendChild(ctaRow);
  }

  inner.appendChild(content);
  article.appendChild(inner);
  return article;
}

function buildTab(row, index) {
  const cells = [...row.children];
  const eyebrow = cells[1]?.textContent?.trim() || '';
  const headlineEl = cells[2]?.querySelector('h1, h2, h3') || cells[2];
  const title = headlineEl?.textContent?.trim() || '';

  const btn = document.createElement('button');
  btn.className = 'hero-tab';
  btn.type = 'button';
  btn.id = `hero-tab-${index}`;
  btn.setAttribute('role', 'tab');
  btn.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
  btn.setAttribute('aria-controls', `hero-slide-${index}`);
  btn.setAttribute('tabindex', index === 0 ? '0' : '-1');

  const progress = document.createElement('span');
  progress.className = 'hero-tab-progress';
  progress.setAttribute('aria-hidden', 'true');
  btn.appendChild(progress);

  const eyebrowSpan = document.createElement('span');
  eyebrowSpan.className = 'hero-tab-eyebrow';
  eyebrowSpan.textContent = eyebrow;
  btn.appendChild(eyebrowSpan);

  const titleSpan = document.createElement('span');
  titleSpan.className = 'hero-tab-title';
  titleSpan.textContent = title;
  btn.appendChild(titleSpan);

  return btn;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Build wrapper
  block.className = block.className.replace(/\bhero\b/, 'hero');
  block.setAttribute('aria-roledescription', 'carousel');
  block.setAttribute('aria-label', 'Featured announcements');

  const slidesContainer = document.createElement('div');
  slidesContainer.className = 'hero-slides';

  const switcherEl = document.createElement('div');
  switcherEl.className = 'hero-switcher';
  const switcherInner = document.createElement('div');
  switcherInner.className = 'hero-switcher-inner';
  const tabsEl = document.createElement('div');
  tabsEl.className = 'hero-tabs';
  tabsEl.setAttribute('role', 'tablist');
  tabsEl.setAttribute('aria-label', 'Choose featured story');

  const slides = [];
  const tabs = [];

  rows.forEach((row, i) => {
    const slide = buildSlide(row, i);
    if (i === 0) slide.classList.add('is-active');
    slidesContainer.appendChild(slide);
    slides.push(slide);

    const tab = buildTab(row, i);
    if (i === 0) tab.classList.add('is-active');
    tabsEl.appendChild(tab);
    tabs.push(tab);
  });

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
  countdown.textContent = 'AUTOPLAY · 7s';

  const hint = document.createElement('span');
  hint.className = 'hero-hint';
  hint.setAttribute('aria-hidden', 'true');
  hint.textContent = '← → TO NAVIGATE';

  switcherInner.appendChild(tabsEl);
  switcherInner.appendChild(pauseBtn);
  switcherInner.appendChild(countdown);
  switcherEl.appendChild(switcherInner);

  // Clear block and rebuild
  block.innerHTML = '';
  block.appendChild(slidesContainer);
  block.appendChild(hint);
  block.appendChild(switcherEl);

  // ── Carousel logic ──────────────────────────────────────
  let current = 0;
  let timer = null;
  let userPaused = false;

  function show(idx) {
    slides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
    tabs.forEach((t, i) => {
      t.classList.toggle('is-active', i === idx);
      t.setAttribute('aria-selected', i === idx ? 'true' : 'false');
      t.setAttribute('tabindex', i === idx ? '0' : '-1');
    });
    // Re-trigger progress animation
    const activeTab = tabs[idx];
    if (activeTab) {
      const prog = activeTab.querySelector('.hero-tab-progress');
      if (prog) {
        prog.style.animation = 'none';
        // eslint-disable-next-line no-unused-expressions
        prog.offsetHeight; // force reflow
        prog.style.animation = '';
      }
    }
    current = idx;
  }

  function next() { show((current + 1) % slides.length); }

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

  block.addEventListener('mouseenter', stop);
  block.addEventListener('mouseleave', () => { if (!userPaused) start(); });
  block.addEventListener('focusin', stop);
  block.addEventListener('focusout', (e) => {
    if (!block.contains(e.relatedTarget) && !userPaused) start();
  });

  tabs.forEach((t, i) => {
    t.addEventListener('click', () => { show(i); start(); });
    t.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const n = (i + 1) % slides.length;
        show(n); tabs[n].focus();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const n = (i - 1 + slides.length) % slides.length;
        show(n); tabs[n].focus();
      }
    });
  });

  pauseBtn.addEventListener('click', () => {
    userPaused = !userPaused;
    if (userPaused) {
      stop();
      pauseBtn.setAttribute('aria-pressed', 'true');
      pauseBtn.setAttribute('aria-label', 'Resume carousel autoplay');
      pauseBtn.textContent = '▶';
    } else {
      start();
      pauseBtn.setAttribute('aria-pressed', 'false');
      pauseBtn.setAttribute('aria-label', 'Pause carousel autoplay');
      pauseBtn.textContent = '⏸';
    }
  });

  // Countdown ticker
  let remaining = 7;
  let ticker = null;

  function paintCountdown() {
    const paused = block.classList.contains('is-paused');
    countdown.textContent = `${paused ? 'PAUSED · ' : 'AUTOPLAY · '}${remaining}s`;
  }

  function startTicker() {
    stopTicker();
    remaining = 7;
    paintCountdown();
    ticker = setInterval(() => {
      remaining = remaining > 1 ? remaining - 1 : 7;
      paintCountdown();
    }, 1000);
  }

  function stopTicker() {
    if (ticker) { clearInterval(ticker); ticker = null; }
    paintCountdown();
  }

  // Watch pause state
  let lastPaused = false;
  setInterval(() => {
    const paused = block.classList.contains('is-paused');
    if (paused !== lastPaused) {
      lastPaused = paused;
      if (paused) stopTicker(); else startTicker();
    }
  }, 200);

  // Watch slide changes
  let lastActive = -1;
  setInterval(() => {
    let active = -1;
    slides.forEach((s, i) => { if (s.classList.contains('is-active')) active = i; });
    if (active !== lastActive) {
      lastActive = active;
      if (!block.classList.contains('is-paused')) startTicker();
    }
  }, 250);

  // Reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    userPaused = true;
    pauseBtn.setAttribute('aria-pressed', 'true');
    pauseBtn.setAttribute('aria-label', 'Resume carousel autoplay');
    pauseBtn.textContent = '▶';
    stop();
  } else {
    start();
    setTimeout(() => { if (!block.classList.contains('is-paused')) startTicker(); }, 100);
  }
}
