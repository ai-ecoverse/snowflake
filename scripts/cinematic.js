/**
 * Cinematic motion engine.
 *
 * Lazy-loads GSAP + ScrollTrigger + Lenis from CDN and wires the motion
 * patterns described in stardust/prototypes/home-cinematic-proposed.html:
 *
 *   M1 hero mosaic-converge (220vh pin)
 *   M2 text scrub-reveal     (per [data-ta-group])
 *   M3 stories horizontal scrub (200vh pin)
 *   M4 pillar-router scroll-driven active card (100vh pin)
 *   M7 section entrance fade + translateY (.perks-grid, .free-tools,
 *      .resources, .closing-cta, .avi)
 *   footer wordmark clip-reveal (#footerWordmark)
 *
 * Honors `prefers-reduced-motion: reduce` — every timeline + ScrollTrigger
 * is gated. If vendors fail to load, falls back to a static page.
 */

const GSAP_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
const SCROLLTRIGGER_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
const LENIS_SRC = 'https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.42/bundled/lenis.min.js';

function loadScript(src) {
  return new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.head.append(s);
  });
}

async function loadVendors() {
  const gsapOk = await loadScript(GSAP_SRC);
  if (!gsapOk) return false;
  const stOk = await loadScript(SCROLLTRIGGER_SRC);
  if (!stOk) return false;
  await loadScript(LENIS_SRC);
  return true;
}

function setupLenis() {
  if (!window.Lenis) return null;
  const lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', window.ScrollTrigger.update);
  window.gsap.ticker.add((time) => lenis.raf(time * 1000));
  window.gsap.ticker.lagSmoothing(0);
  return lenis;
}

function setupHero() {
  const cols = window.gsap.utils.toArray('.hero .mosaic-col');
  const pin = document.querySelector('.hero');
  if (cols.length !== 5 || !pin) return;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const xFrom = [-178, -89, 0, 90, 179].map((v) => (v / 1440) * vw);
  const yFrom = [-307, -124, 0, -100, -290].map((v) => (v / 1024) * vh);
  const spreadGap = (100 / 1440) * vw;
  const cardGapExtra = spreadGap - 8;
  const cardYFrom = [0, cardGapExtra, cardGapExtra * 2];

  window.gsap.set(cols, {
    x: (i) => xFrom[i],
    y: (i) => yFrom[i],
  });
  cols.forEach((col) => {
    const cards = col.querySelectorAll('.mosaic-card');
    window.gsap.set(cards, { y: (i) => cardYFrom[i] });
  });

  const loadRings = { 0: [], 1: [], 2: [] };
  cols.forEach((col, colIdx) => {
    col.querySelectorAll('.mosaic-card').forEach((card, rowIdx) => {
      const ring = Math.max(Math.abs(colIdx - 2), rowIdx);
      loadRings[ring].push(card);
    });
  });
  const allCards = cols.reduce(
    (acc, col) => acc.concat([...col.querySelectorAll('.mosaic-card')]),
    [],
  );
  window.gsap.set(allCards, { opacity: 0, clipPath: 'inset(50% round 16px)' });
  [0, 1, 2].forEach((ring) => {
    window.gsap.to(loadRings[ring], {
      opacity: 1,
      clipPath: 'inset(0% round 16px)',
      duration: 0.5,
      ease: 'power2.out',
      delay: 0.1 + ring * 0.1,
    });
  });

  const tl = window.gsap.timeline({ paused: true });
  tl.to('.hero .hero-text', { opacity: 0, y: -80, ease: 'none', duration: 0.45 }, 0);
  tl.to('.hero .hero-mosaic-wrap', { y: '-62vh', ease: 'none' }, 0);
  tl.to(cols, { x: 0, y: 0, ease: 'none' }, 0);
  cols.forEach((col) => {
    tl.to(col.querySelectorAll('.mosaic-card'), { y: 0, ease: 'none' }, 0);
  });

  window.ScrollTrigger.create({
    trigger: '.hero',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.8,
    animation: tl,
  });
}

function measureLines(el, text) {
  const cs = window.getComputedStyle(el);
  const words = text.trim().split(/\s+/);
  if (!words.length) return [];
  const tmp = document.createElement('div');
  tmp.setAttribute('aria-hidden', 'true');
  tmp.style.cssText = [
    'position:absolute', 'visibility:hidden', 'pointer-events:none',
    'top:0', 'left:0',
    `width:${el.offsetWidth}px`,
    `font-family:${cs.fontFamily}`,
    `font-size:${cs.fontSize}`,
    `font-weight:${cs.fontWeight}`,
    `line-height:${cs.lineHeight}`,
    `letter-spacing:${cs.letterSpacing}`,
    `white-space:${cs.whiteSpace}`,
  ].join(';');
  tmp.innerHTML = words.map((w) => `<span style="display:inline">${w}</span>`).join(' ');
  document.body.append(tmp);
  const spans = tmp.querySelectorAll('span');
  const lines = [];
  let currentLine = [];
  let lastTop = null;
  spans.forEach((span, i) => {
    const top = Math.round(span.getBoundingClientRect().top);
    if (lastTop === null) lastTop = top;
    if (top !== lastTop) {
      lines.push(currentLine.join(' '));
      currentLine = [];
      lastTop = top;
    }
    currentLine.push(words[i]);
  });
  if (currentLine.length) lines.push(currentLine.join(' '));
  tmp.remove();
  return lines.filter(Boolean);
}

function wrapLines(el) {
  const existing = el.querySelectorAll('.ta-line-inner');
  if (existing.length) return [...existing];
  if (el.querySelector('.accent')) return [el];
  const segments = el.innerHTML.split(/<br\s*\/?>/gi);
  let allLines = [];
  segments.forEach((seg) => {
    const plain = seg.replace(/<[^>]+>/g, '').trim();
    if (!plain) return;
    allLines = allLines.concat(measureLines(el, plain));
  });
  if (!allLines.length) return [];
  el.innerHTML = allLines
    .map((line) => `<span class="ta-line"><span class="ta-line-inner">${line}</span></span>`)
    .join('');
  return [...el.querySelectorAll('.ta-line-inner')];
}

function animateTextGroup(groupEl) {
  const allEls = [...groupEl.querySelectorAll('[data-ta], [data-ta-unit]')];
  if (!allEls.length) return;
  const allItems = [];
  allEls.forEach((el) => {
    if (el.hasAttribute('data-ta-unit')) {
      allItems.push(el);
    } else {
      allItems.push(...wrapLines(el));
    }
  });
  if (!allItems.length) return;
  const baseOffset = window.innerHeight * 0.065;
  const tl = window.gsap.timeline();
  allItems.forEach((item, i) => {
    window.gsap.set(item, { y: (i + 1) * baseOffset });
    tl.to(item, { y: 0, ease: 'power2.out', duration: 1 }, 0);
  });
  window.ScrollTrigger.create({
    trigger: groupEl,
    start: 'top 90%',
    end: 'top 40%',
    scrub: true,
    animation: tl,
  });
}

function setupTextReveal() {
  document.body.classList.add('ta-init');
  const groups = document.querySelectorAll('[data-ta-group]');
  if (!groups.length) return;
  const run = () => groups.forEach(animateTextGroup);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
  else run();
}

function setupStoriesCarousel() {
  const pin = document.querySelector('.stories');
  const track = pin?.querySelector('.stories-track');
  if (!pin || !track || window.innerWidth < 1024) return;

  let trackWidth = track.scrollWidth;
  let viewportWidth = pin.offsetWidth;
  let translateMax = Math.max(0, trackWidth - viewportWidth + 48);

  window.ScrollTrigger.create({
    trigger: pin,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.6,
    onUpdate(self) {
      window.gsap.set(track, { x: -translateMax * self.progress });
    },
  });

  window.addEventListener('resize', () => {
    trackWidth = track.scrollWidth;
    viewportWidth = pin.offsetWidth;
    translateMax = Math.max(0, trackWidth - viewportWidth + 48);
    window.ScrollTrigger.refresh();
  });
}

function setupPillarRouter() {
  const pin = document.querySelector('.pillar-router');
  const cards = pin ? [...pin.querySelectorAll('.hub-card')] : [];
  if (!pin || cards.length !== 5 || window.innerWidth < 1024) return;

  let clickOverride = false;
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      clickOverride = true;
      setTimeout(() => { clickOverride = false; }, 1200);
    });
  });

  window.ScrollTrigger.create({
    trigger: pin,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate(self) {
      if (clickOverride) return;
      const idx = Math.min(4, Math.max(0, Math.floor(self.progress * 5)));
      if (!cards[idx].classList.contains('is-active')) {
        cards.forEach((c) => c.classList.remove('is-active'));
        cards[idx].classList.add('is-active');
      }
    },
  });
}

function setupSectionEntrances() {
  const sections = document.querySelectorAll(
    'main .perks-grid, main .free-tools, main .resources, main .closing-cta, main .avi',
  );
  sections.forEach((el) => {
    window.gsap.from(el, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        end: 'top 60%',
        toggleActions: 'play none none reverse',
      },
    });
  });
}

function setupFooterWordmark() {
  const fwm = document.getElementById('footerWordmark');
  if (!fwm) return;
  window.gsap.fromTo(
    fwm,
    { clipPath: 'inset(60% 0 0 0)' },
    {
      clipPath: 'inset(0% 0 0 0)',
      ease: 'power2.out',
      scrollTrigger: {
        trigger: fwm,
        start: 'top 90%',
        end: 'top 50%',
        scrub: 0.8,
      },
    },
  );
}

export default async function cinematic() {
  if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
  const ok = await loadVendors();
  if (!ok || !window.gsap || !window.ScrollTrigger) return;
  window.gsap.registerPlugin(window.ScrollTrigger);
  setupLenis();
  setupHero();
  setupTextReveal();
  setupStoriesCarousel();
  setupPillarRouter();
  setupSectionEntrances();
  setupFooterWordmark();
  // Footer is injected post-LCP — give it a tick to land before refreshing
  // ScrollTrigger so the wordmark trigger picks it up.
  setTimeout(() => window.ScrollTrigger.refresh(), 200);
}
