/**
 * hero — emotional hook, full-bleed with mosaic background
 *
 * Authoring rows (positional):
 *   1. Background images — one <picture> per mosaic tile (up to 15)
 *   2. Eyebrow text
 *   3. h1 headline
 *   4. Body paragraph
 *   5. CTAs — <em><strong><a> for trial/accent, <em><a> for secondary
 *
 * Button convention: clone cell children into .actions — do NOT manufacture anchors.
 * The EDS link decorator applies .btn / .btn-primary / .btn-secondary / .btn-accent.
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const cells = (row) => [...row.children];

  // Row 0: mosaic images (optional)
  const mosaicImages = cells(rows[0]).map((c) => c.querySelector('picture, img')).filter(Boolean);

  // Row 1: eyebrow
  const eyebrowText = rows[1] ? rows[1].firstElementChild : null;

  // Row 2: headline
  const headlineEl = rows[2] ? rows[2].firstElementChild : null;

  // Row 3: body
  const bodyEl = rows[3] ? rows[3].firstElementChild : null;

  // Row 4: CTAs
  const ctaCell = rows[4] ? rows[4].firstElementChild : null;

  // Build DOM
  const section = document.createElement('div');
  section.className = 'hero-section';

  // Mosaic background
  const mosaic = document.createElement('div');
  mosaic.className = 'hero-mosaic';
  mosaic.setAttribute('aria-hidden', 'true');

  if (mosaicImages.length) {
    mosaicImages.forEach((img) => {
      const tile = document.createElement('span');
      tile.className = 'tile';
      tile.appendChild(img.cloneNode(true));
      mosaic.appendChild(tile);
    });
  } else {
    // Render 15 placeholder tiles matching the prototype
    for (let i = 1; i <= 15; i += 1) {
      const tile = document.createElement('span');
      tile.className = 'tile';
      tile.dataset.placeholder = 'true';
      tile.dataset.placeholderType = 'image';
      const eye = document.createElement('span');
      eye.className = 'placeholder-eyebrow';
      eye.textContent = `PLACEHOLDER \u00B7 image ${i} of 15`;
      tile.appendChild(eye);
      mosaic.appendChild(tile);
    }
  }

  // Hero text
  const textWrap = document.createElement('div');
  textWrap.className = 'hero-text';

  // Eyebrow
  if (eyebrowText) {
    const eyebrow = document.createElement('div');
    eyebrow.className = 'hero-eyebrow t-eyebrow';
    const glyph = document.createElement('span');
    glyph.className = 'glyph';
    glyph.setAttribute('aria-hidden', 'true');
    glyph.textContent = 'A';
    eyebrow.appendChild(glyph);
    const eyebrowSpan = document.createElement('span');
    eyebrowSpan.textContent = eyebrowText.textContent.trim();
    eyebrow.appendChild(eyebrowSpan);
    textWrap.appendChild(eyebrow);
  }

  // Headline
  if (headlineEl) {
    const h1 = headlineEl.querySelector('h1') || headlineEl;
    const headline = document.createElement('h1');
    headline.className = 'hero-title t-title-1';
    headline.innerHTML = h1.innerHTML || h1.textContent;
    textWrap.appendChild(headline);
  }

  // Body
  if (bodyEl) {
    const bodyP = document.createElement('p');
    bodyP.className = 'hero-body t-body-m';
    bodyP.innerHTML = bodyEl.innerHTML;
    textWrap.appendChild(bodyP);
  }

  // CTAs
  if (ctaCell && ctaCell.querySelector('a')) {
    const actions = document.createElement('div');
    actions.className = 'hero-ctas';
    [...ctaCell.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
    textWrap.appendChild(actions);
  }

  section.appendChild(mosaic);
  section.appendChild(textWrap);

  block.replaceChildren(section);

  // Animate mosaic in when motion is allowed
  const allowMotion = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  if (allowMotion) {
    mosaic.style.opacity = '0';
    mosaic.style.transition = 'opacity 600ms ease, transform 800ms cubic-bezier(0.16, 1, 0.3, 1)';
    requestAnimationFrame(() => { mosaic.style.opacity = ''; });
  }
}
