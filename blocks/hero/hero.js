/**
 * Hero block
 *
 * Authoring shape (positional rows):
 *   Row 1: article thumbnail image (309x309)
 *   Row 2: eyebrow text
 *   Row 3: h1 headline
 *   Row 4: deck paragraph (italic)
 *   Row 5: meta info — chip text | date | read-time | author (pipe-separated cells or single cell)
 *   Row 6: tag links (anchor elements inside cells)
 *   Row 7: CTA links — primary wrapped in <strong><a>, secondary in <em><a>
 */
export default async function decorate(block) {
  const rows = [...block.children];

  function cell(row, idx = 0) {
    return row?.children?.[idx] ?? null;
  }

  // Row 1 — thumbnail
  const thumbCell = cell(rows[0]);
  const imgEl = thumbCell?.querySelector('img');

  // Row 2 — eyebrow
  const eyebrowText = cell(rows[1])?.textContent?.trim() ?? '';

  // Row 3 — h1 headline
  const headlineText = cell(rows[2])?.textContent?.trim() ?? '';

  // Row 4 — deck
  const deckEl = cell(rows[3])?.querySelector('p') ?? cell(rows[3]);
  const deckHTML = deckEl?.innerHTML ?? '';

  // Row 5 — meta: chip | date | read-time | author (cells within the row)
  const metaCells = rows[4] ? [...rows[4].children] : [];
  const chipText = metaCells[0]?.textContent?.trim() ?? '';
  const chipClass = chipText
    ? `ds-chip ds-chip--${resolveChipMod(chipText)}`
    : 'ds-chip';
  const dateTxt = metaCells[1]?.textContent?.trim() ?? '';
  const readTimeTxt = metaCells[2]?.textContent?.trim() ?? '';
  const authorTxt = metaCells[3]?.textContent?.trim() ?? '';

  // Row 6 — tags (anchor elements)
  const tagLinks = rows[5] ? [...rows[5].querySelectorAll('a')] : [];

  // Row 7 — CTA links
  const ctaLinks = rows[6] ? [...rows[6].querySelectorAll('a')] : [];

  // Build DOM
  block.innerHTML = '';

  const inner = document.createElement('div');
  inner.className = 'hero-inner';

  // Card wrapper
  const card = document.createElement('div');
  card.className = 'hero-card';

  // Thumbnail
  if (imgEl) {
    const thumbLink = document.createElement('a');
    thumbLink.className = 'hero-thumb';
    const primaryLink = ctaLinks[0];
    if (primaryLink) thumbLink.href = primaryLink.href;
    thumbLink.setAttribute('aria-label', 'Read the lead story');
    imgEl.loading = 'eager';
    imgEl.setAttribute('fetchpriority', 'high');
    thumbLink.append(imgEl);
    card.append(thumbLink);
  }

  // Body
  const body = document.createElement('div');
  body.className = 'hero-body';

  if (eyebrowText) {
    const eyebrow = document.createElement('span');
    eyebrow.className = 'ds-eyebrow ds-eyebrow--brass-deep';
    eyebrow.textContent = eyebrowText;
    body.append(eyebrow);
  }

  if (headlineText) {
    const h1 = document.createElement('h1');
    // Word-by-word reveal animation
    const words = headlineText.split(/\s+/);
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.style.animationDelay = `${i * 60}ms`;
      span.textContent = word;
      h1.append(span);
      if (i < words.length - 1) h1.append(' ');
    });
    body.append(h1);
  }

  if (deckHTML) {
    const deck = document.createElement('p');
    deck.className = 'hero-deck';
    deck.innerHTML = deckHTML;
    body.append(deck);
  }

  // Meta row
  const meta = document.createElement('div');
  meta.className = 'hero-meta';
  if (chipText) {
    const chip = document.createElement('span');
    chip.className = chipClass;
    chip.textContent = chipText;
    meta.append(chip);
  }
  [[dateTxt], [readTimeTxt], [authorTxt]].forEach(([txt]) => {
    if (!txt) return;
    const sep = document.createElement('span');
    sep.className = 'meta-sep';
    sep.setAttribute('aria-hidden', 'true');
    sep.textContent = '·';
    const s = document.createElement('span');
    s.textContent = txt;
    meta.append(sep, s);
  });
  if (meta.childElementCount) body.append(meta);

  // Tags
  if (tagLinks.length) {
    const tagRow = document.createElement('div');
    tagRow.className = 'hero-tags';
    tagRow.setAttribute('aria-label', 'Tags');
    tagLinks.forEach((a) => {
      a.className = 'ds-tag';
      tagRow.append(a);
    });
    body.append(tagRow);
  }

  // Actions
  if (ctaLinks.length) {
    const actions = document.createElement('div');
    actions.className = 'hero-actions';
    ctaLinks.forEach((a, i) => {
      if (i === 0) {
        // Primary button — two-tone variant
        const btn = document.createElement('a');
        btn.className = 'ds-button-primary';
        btn.href = a.href;
        btn.innerHTML = `<span class="ds-btn-lab">${a.textContent.trim()}</span><span class="ds-btn-arrow" aria-hidden="true">→</span>`;
        actions.append(btn);
      } else {
        a.className = 'ds-button-secondary';
        actions.append(a);
      }
    });
    body.append(actions);
  }

  card.append(body);
  inner.append(card);
  block.append(inner);
}

/** Map chip label to CSS modifier token */
function resolveChipMod(label) {
  const lower = label.toLowerCase();
  if (lower.includes('workplace') || lower.includes('modern workplace')) return 'workplace';
  if (lower.includes('datacenter') || lower.includes('storage')) return 'datacenter';
  if (lower.includes('ai') || lower.includes('artificial')) return 'ai';
  if (lower.includes('advantage') || lower.includes('dta') || lower.includes('neutral')) return 'neutral';
  return 'datacenter';
}
