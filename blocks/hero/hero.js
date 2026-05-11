/**
 * hero — Semrush homepage hero with mosaic background
 *
 * Authoring rows (positional):
 *   1. eyebrow glyph label  (text, e.g. "Semrush")
 *   2. h1 headline          (use <em> to wrap accent word)
 *   3. body paragraph
 *   4. CTAs — wrap primary in <strong><a>, secondary in <em><a>
 *
 * Variants (block class suffix):
 *   hero            — standard hero (home-proposed)
 *   hero cinematic  — cinematic variant with GSAP mosaic converge + gradient ground
 *
 * Note: Adobe Clean is loaded via Adobe Fonts CDN (proprietary).
 *       Source Sans 3 is the self-hosted OFL fallback.
 */

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const isCinematic = block.classList.contains('cinematic');

  // Row helpers
  function cell(row, idx = 0) {
    return row?.children[idx] || null;
  }
  function txt(row) { return cell(row)?.textContent.trim() || ''; }

  const eyebrowRow = rows[0];
  const headlineRow = rows[1];
  const bodyRow = rows[2];
  const ctaRow = rows[3];

  // Build hero structure
  const wrap = document.createElement('div');
  wrap.className = 'hero-wrap';

  // Mosaic (15 tiles, 5 cols × 3 rows) — decorative placeholder
  const mosaicWrap = document.createElement('div');
  mosaicWrap.className = 'hero-mosaic-wrap';
  mosaicWrap.setAttribute('aria-hidden', 'true');
  const mosaic = document.createElement('div');
  mosaic.className = 'hero-mosaic';
  for (let c = 0; c < 5; c++) {
    const col = document.createElement('div');
    col.className = 'mosaic-col';
    for (let r = 0; r < 3; r++) {
      const card = document.createElement('div');
      card.className = 'mosaic-card';
      col.append(card);
    }
    mosaic.append(col);
  }
  mosaicWrap.append(mosaic);

  // Text group
  const textGroup = document.createElement('div');
  textGroup.className = 'hero-text';

  // Eyebrow
  if (eyebrowRow) {
    const eyebrow = document.createElement('div');
    eyebrow.className = 'hero-eyebrow';
    const glyph = document.createElement('span');
    glyph.className = 'glyph';
    glyph.setAttribute('aria-hidden', 'true');
    glyph.textContent = 'S';
    const wordmark = document.createElement('span');
    wordmark.className = 'wordmark-eyebrow';
    wordmark.textContent = txt(eyebrowRow);
    eyebrow.append(glyph, wordmark);
    textGroup.append(eyebrow);
  }

  // Headline — preserve inner HTML (accent spans etc.)
  if (headlineRow) {
    const h1 = document.createElement('h1');
    h1.className = 'hero-title t-title-1';
    h1.innerHTML = cell(headlineRow)?.innerHTML || '';
    // Wrap <em> text in .accent span
    h1.querySelectorAll('em').forEach((em) => {
      const span = document.createElement('span');
      span.className = 'accent';
      span.textContent = em.textContent;
      em.replaceWith(span);
    });
    textGroup.append(h1);
  }

  // Body
  if (bodyRow) {
    const p = document.createElement('p');
    p.className = 'hero-body t-body-m';
    p.innerHTML = cell(bodyRow)?.innerHTML || '';
    textGroup.append(p);
  }

  // CTAs — clone the cell's child nodes; EDS decorateButton() applies .btn classes
  if (ctaRow) {
    const ctaCell = cell(ctaRow);
    if (ctaCell) {
      const ctas = document.createElement('div');
      ctas.className = 'hero-ctas';
      [...ctaCell.childNodes].forEach((n) => ctas.append(n.cloneNode(true)));
      textGroup.append(ctas);
    }
  }

  wrap.append(mosaicWrap, textGroup);
  block.replaceChildren(wrap);

  // Cinematic: wire GSAP mosaic-converge if motion allowed
  if (isCinematic && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    await loadCinematicMotion(mosaic, block);
  }
}

async function loadCinematicMotion(mosaic, block) {
  // GSAP + ScrollTrigger loaded via CDN per documented v3 amendment
  if (!window.gsap) {
    await Promise.all([
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js'),
    ]);
    window.gsap.registerPlugin(window.ScrollTrigger);
  }
  const { gsap, ScrollTrigger } = window;
  const cards = [...mosaic.querySelectorAll('.mosaic-card')];
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const chebyshev = (i, cx, cy) => Math.max(Math.abs(i % 5 - cx), Math.abs(Math.floor(i / 5) - cy));

  // Load-in: Chebyshev ring ripple
  cards.forEach((card, i) => {
    const d = chebyshev(i, 2, 1) * 0.08;
    gsap.from(card, {
      opacity: 0, scale: 0.85, duration: 0.6, delay: d, ease: 'power2.out',
    });
  });

  // Scroll: mosaic converge to centre
  ScrollTrigger.create({
    trigger: block.closest('.section') || block,
    pin: true,
    scrub: 0.8,
    start: 'top top',
    end: `+=${2.2 * vh}`,
    onUpdate: (self) => {
      const p = self.progress;
      cards.forEach((card, i) => {
        const col = i % 5;
        const row = Math.floor(i / 5);
        const dx = (col - 2) * (vw * 0.12) * (1 - p);
        const dy = (row - 1) * (vh * 0.08) * (1 - p);
        card.style.transform = `translate(${dx}px, ${dy}px)`;
      });
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
