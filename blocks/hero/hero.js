/**
 * Hero block — featured article, platinum bg, image left + body right.
 *
 * Authoring rows (positional):
 *   0: linked <picture> — article thumbnail
 *   1: eyebrow text
 *   2: <h1> headline
 *   3: editorial italic deck paragraph
 *   4: chip text | date | read time | author (4 cells)
 *   5: tags — each tag as <a href="/category/...">Tag name</a>
 *   6: CTA — <strong><a>Read article</a></strong>
 */

function chipVariant(text) {
  const t = (text || '').toLowerCase();
  if (t.includes('ai') || t.includes('artificial')) return 'ds-chip--ai';
  if (t.includes('workplace') || t.includes('hybrid')) return 'ds-chip--workplace';
  if (t.includes('datacenter') || t.includes('storage') || t.includes('data center')) return 'ds-chip--datacenter';
  return 'ds-chip--neutral';
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Row 0: thumbnail — read src from img before AEM optimises it away
  const thumbCell = rows[0]?.querySelector(':scope > div');
  const thumbLink = thumbCell?.querySelector('a');
  const origImg = thumbCell?.querySelector('img');
  // Grab the original src attribute (not the .src property which may be about:error)
  const imgSrc = origImg?.getAttribute('src') || '';
  const imgAlt = origImg?.getAttribute('alt') || '';
  const imgWidth = origImg?.getAttribute('width') || '309';
  const imgHeight = origImg?.getAttribute('height') || '309';

  // Row 1: eyebrow
  const eyebrow = rows[1]?.querySelector(':scope > div')?.textContent.trim() || '';

  // Row 2: headline
  const headlineEl = rows[2]?.querySelector(':scope > div');
  const h1Raw = headlineEl?.querySelector('h1') || headlineEl;
  const headlineText = h1Raw?.textContent.trim() || '';

  // Row 3: deck
  const deckText = rows[3]?.querySelector(':scope > div')?.textContent.trim() || '';

  // Row 4: chip | date | readtime | author
  const metaCells = rows[4] ? [...rows[4].querySelectorAll(':scope > div')] : [];
  let chipText = '', dateTxt = '', readTxt = '', authorTxt = '';
  if (metaCells.length >= 4) {
    chipText = metaCells[0]?.textContent.trim();
    dateTxt = metaCells[1]?.textContent.trim();
    readTxt = metaCells[2]?.textContent.trim();
    authorTxt = metaCells[3]?.textContent.trim();
  } else if (metaCells.length === 1) {
    [chipText, dateTxt, readTxt, authorTxt] = metaCells[0].textContent.split('|').map((s) => s.trim());
  }

  // Row 5: tag links
  const tagAnchors = rows[5] ? [...rows[5].querySelectorAll('a')] : [];

  // Row 6: CTA
  const ctaCell = rows[6]?.querySelector(':scope > div');
  const ctaLink = ctaCell?.querySelector('strong a') || ctaCell?.querySelector('a');

  // === Build ===
  block.innerHTML = '';
  const inner = document.createElement('div');
  inner.className = 'ds-container';
  const card = document.createElement('div');
  card.className = 'ds-hero-card';

  // Thumb — build fresh img from src attribute (bypass AEM picture optimiser)
  if (imgSrc) {
    const thumbWrap = document.createElement('a');
    thumbWrap.className = 'ds-hero-thumb';
    thumbWrap.href = thumbLink?.href || ctaLink?.href || '#';
    thumbWrap.setAttribute('aria-label', 'Read the lead story');
    thumbWrap.setAttribute('tabindex', '-1');
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = imgAlt;
    img.width = imgWidth;
    img.height = imgHeight;
    img.setAttribute('fetchpriority', 'high');
    thumbWrap.append(img);
    card.append(thumbWrap);
  }

  // Body
  const body = document.createElement('div');
  body.className = 'ds-hero-body';

  if (eyebrow) {
    const ew = document.createElement('span');
    ew.className = 'ds-eyebrow ds-eyebrow--brass-deep';
    ew.textContent = eyebrow;
    body.append(ew);
  }

  const h1 = document.createElement('h1');
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced && headlineText) {
    let wordIdx = 0;
    h1.innerHTML = headlineText.split(/(\s+)/).map((part) => {
      if (/^\s+$/.test(part)) return part;
      const s = `<span class="ds-word" style="animation-delay:${wordIdx * 70}ms">${part.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</span>`;
      wordIdx += 1;
      return s;
    }).join('');
  } else {
    h1.textContent = headlineText;
  }
  body.append(h1);

  if (deckText) {
    const deck = document.createElement('p');
    deck.className = 'ds-deck';
    deck.textContent = deckText;
    body.append(deck);
  }

  const meta = document.createElement('div');
  meta.className = 'ds-meta';
  if (chipText) {
    const chip = document.createElement('span');
    chip.className = `ds-chip ${chipVariant(chipText)}`;
    chip.textContent = chipText;
    meta.append(chip);
  }
  [dateTxt, readTxt, authorTxt].filter(Boolean).forEach((m) => {
    const sep = document.createElement('span');
    sep.className = 'ds-meta-sep';
    sep.setAttribute('aria-hidden', 'true');
    sep.textContent = '·';
    meta.append(sep);
    const s = document.createElement('span');
    s.textContent = m;
    meta.append(s);
  });
  if (meta.childNodes.length) body.append(meta);

  if (tagAnchors.length) {
    const tagRow = document.createElement('div');
    tagRow.className = 'ds-tag-row';
    tagRow.setAttribute('aria-label', 'Tags');
    tagAnchors.forEach((a) => {
      const tag = document.createElement('a');
      tag.className = 'ds-tag';
      tag.href = a.href;
      tag.textContent = a.textContent.trim();
      tagRow.append(tag);
    });
    body.append(tagRow);
  }

  if (ctaLink) {
    const actions = document.createElement('div');
    actions.className = 'ds-hero-actions';
    const btn = document.createElement('a');
    btn.className = 'ds-button-primary';
    btn.href = ctaLink.href;
    const lab = document.createElement('span');
    lab.className = 'ds-btn-lab';
    lab.textContent = ctaLink.textContent.trim();
    const arrow = document.createElement('span');
    arrow.className = 'ds-btn-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '→';
    btn.append(lab, arrow);
    actions.append(btn);
    body.append(actions);
  }

  card.append(body);
  inner.append(card);
  block.append(inner);
}
