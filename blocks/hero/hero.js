/**
 * Hero block — featured article, platinum bg, image left + body right.
 *
 * Authoring rows (positional):
 *   0: <picture> — article thumbnail (linked)
 *   1: eyebrow text
 *   2: <h1> headline
 *   3: editorial italic deck paragraph
 *   4: chip text | date | read time | author  (pipe-separated in one cell or 4 cells)
 *   5: tags — each tag as <a href="/category/...">Tag name</a> comma/line separated
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

  // Row 0: thumbnail picture (may be wrapped in an anchor)
  const thumbCell = rows[0]?.querySelector(':scope > div');
  const pic = thumbCell?.querySelector('picture, img');
  const thumbLink = thumbCell?.querySelector('a');

  // Row 1: eyebrow
  const eyebrow = rows[1]?.querySelector(':scope > div')?.textContent.trim() || '';

  // Row 2: headline
  const headlineEl = rows[2]?.querySelector(':scope > div');
  const h1Raw = headlineEl?.querySelector('h1') || headlineEl;
  const headlineText = h1Raw?.textContent.trim() || '';

  // Row 3: deck
  const deckCell = rows[3]?.querySelector(':scope > div');
  const deckText = deckCell?.textContent.trim() || '';

  // Row 4: chip | date | readtime | author — may be pipe-delimited or separate cells
  const metaRow = rows[4];
  const metaCells = metaRow ? [...metaRow.querySelectorAll(':scope > div')] : [];
  let chipText = '', dateTxt = '', readTxt = '', authorTxt = '';
  if (metaCells.length >= 4) {
    chipText = metaCells[0]?.textContent.trim();
    dateTxt = metaCells[1]?.textContent.trim();
    readTxt = metaCells[2]?.textContent.trim();
    authorTxt = metaCells[3]?.textContent.trim();
  } else if (metaCells.length === 1) {
    const parts = metaCells[0].textContent.split('|').map((s) => s.trim());
    [chipText, dateTxt, readTxt, authorTxt] = parts;
  } else if (metaCells.length >= 2) {
    chipText = metaCells[0]?.textContent.trim();
    const rest = metaCells[1]?.textContent.split('|').map((s) => s.trim()) || [];
    [dateTxt, readTxt, authorTxt] = rest;
  }

  // Row 5: tag links
  const tagCell = rows[5]?.querySelector(':scope > div');
  const tagAnchors = tagCell ? [...tagCell.querySelectorAll('a')] : [];

  // Row 6: CTA — strong > a (primary)
  const ctaCell = rows[6]?.querySelector(':scope > div');
  const ctaLink = ctaCell?.querySelector('strong a') || ctaCell?.querySelector('a');

  // === Build ===
  block.innerHTML = '';

  const inner = document.createElement('div');
  inner.className = 'ds-container';

  const card = document.createElement('div');
  card.className = 'ds-hero-card';

  // — Thumb —
  if (pic) {
    const thumbWrap = document.createElement('a');
    thumbWrap.className = 'ds-hero-thumb';
    thumbWrap.href = thumbLink?.href || ctaLink?.href || '#';
    thumbWrap.setAttribute('aria-label', 'Read the lead story');
    thumbWrap.setAttribute('tabindex', '-1');
    const picClone = pic.closest('picture') ? pic.closest('picture').cloneNode(true) : pic.cloneNode(true);
    thumbWrap.append(picClone);
    card.append(thumbWrap);
  }

  // — Body —
  const body = document.createElement('div');
  body.className = 'ds-hero-body';

  // Eyebrow
  if (eyebrow) {
    const ew = document.createElement('span');
    ew.className = 'ds-eyebrow ds-eyebrow--brass-deep';
    ew.textContent = eyebrow;
    body.append(ew);
  }

  // H1 with word-reveal delight
  const h1 = document.createElement('h1');
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    const words = headlineText.split(/(\s+)/);
    let wordIdx = 0;
    h1.innerHTML = words.map((part) => {
      if (/^\s+$/.test(part)) return part;
      const span = `<span class="ds-word" style="animation-delay:${wordIdx * 70}ms">${part.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</span>`;
      wordIdx += 1;
      return span;
    }).join('');
  } else {
    h1.textContent = headlineText;
  }
  body.append(h1);

  // Deck
  if (deckText) {
    const deck = document.createElement('p');
    deck.className = 'ds-deck';
    deck.textContent = deckText;
    body.append(deck);
  }

  // Meta row
  const meta = document.createElement('div');
  meta.className = 'ds-meta';

  if (chipText) {
    const chip = document.createElement('span');
    chip.className = `ds-chip ${chipVariant(chipText)}`;
    chip.textContent = chipText;
    meta.append(chip);
  }

  const metaItems = [dateTxt, readTxt, authorTxt].filter(Boolean);
  metaItems.forEach((m) => {
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

  // Tags
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

  // Actions
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
