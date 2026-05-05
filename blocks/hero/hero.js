export default async function decorate(block) {
  const rows = [...block.children];

  // Row 0: image
  // Row 1: eyebrow text
  // Row 2: headline (h1)
  // Row 3: deck text
  // Row 4: topic chip | meta text
  // Row 5: CTA links (strong = primary, em = secondary)
  // Row 6: tags (each anchor = a tag)

  const getCell = (row, idx = 0) => row?.children[idx];
  const getText = (row, idx = 0) => getCell(row, idx)?.textContent.trim() || '';

  // Image
  const imgCell = getCell(rows[0]);
  const imgEl = imgCell?.querySelector('img');
  const imgHref = imgCell?.querySelector('a')?.href || '';

  // Eyebrow
  const eyebrowText = getText(rows[1]);

  // Headline
  const headlineText = getText(rows[2]);

  // Deck
  const deckText = getText(rows[3]);

  // Chip + meta
  const chipText = getText(rows[4], 0);
  const metaText = getCell(rows[4], 1)?.textContent.trim() || '';

  // CTAs — strong = primary, em = secondary
  const ctaCell = getCell(rows[5]);
  const primaryLink = ctaCell?.querySelector('strong a') || ctaCell?.querySelector('a');
  const secondaryLink = ctaCell?.querySelector('em a');

  // Tags
  const tagsCell = getCell(rows[6]);
  const tagLinks = tagsCell ? [...tagsCell.querySelectorAll('a')] : [];

  // Build DOM
  const card = document.createElement('div');
  card.className = 'hero-card';

  // Thumb
  if (imgEl) {
    const thumb = document.createElement('a');
    thumb.className = 'hero-thumb';
    if (imgHref) thumb.href = imgHref;
    thumb.setAttribute('aria-label', 'Read the lead story');
    thumb.append(imgEl.cloneNode(true));
    card.append(thumb);
  }

  // Body
  const body = document.createElement('div');
  body.className = 'hero-body';

  if (eyebrowText) {
    const eyebrow = document.createElement('span');
    eyebrow.className = 'hero-eyebrow';
    eyebrow.textContent = eyebrowText;
    body.append(eyebrow);
  }

  if (headlineText) {
    const h1 = document.createElement('h1');
    h1.textContent = headlineText;
    body.append(h1);
  }

  if (deckText) {
    const deck = document.createElement('p');
    deck.className = 'hero-deck';
    deck.textContent = deckText;
    body.append(deck);
  }

  // Meta row
  const metaRow = document.createElement('div');
  metaRow.className = 'hero-meta';
  if (chipText) {
    const chip = document.createElement('span');
    chip.className = 'hero-chip';
    chip.textContent = chipText;
    metaRow.append(chip);
  }
  if (metaText) {
    const sep = document.createElement('span');
    sep.className = 'hero-meta-sep';
    sep.setAttribute('aria-hidden', 'true');
    sep.textContent = '·';
    metaRow.append(sep);

    const meta = document.createElement('span');
    meta.className = 'hero-meta-text';
    meta.textContent = metaText;
    metaRow.append(meta);
  }
  if (metaRow.children.length) body.append(metaRow);

  // Tags
  if (tagLinks.length) {
    const tagRow = document.createElement('div');
    tagRow.className = 'hero-tag-row';
    tagRow.setAttribute('aria-label', 'Tags');
    tagLinks.forEach((a) => {
      const tag = document.createElement('a');
      tag.className = 'hero-tag';
      tag.href = a.href;
      tag.textContent = a.textContent.trim();
      tagRow.append(tag);
    });
    body.append(tagRow);
  }

  // Actions
  const actions = document.createElement('div');
  actions.className = 'hero-actions';

  if (primaryLink) {
    const btn = document.createElement('a');
    btn.className = 'hero-btn-primary';
    btn.href = primaryLink.href;
    const lab = document.createElement('span');
    lab.className = 'hero-btn-lab';
    lab.textContent = primaryLink.textContent.trim();
    const arrow = document.createElement('span');
    arrow.className = 'hero-btn-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '→';
    btn.append(lab, arrow);
    actions.append(btn);
  }

  if (secondaryLink) {
    const btn = document.createElement('a');
    btn.className = 'hero-btn-secondary';
    btn.href = secondaryLink.href;
    btn.textContent = secondaryLink.textContent.trim();
    actions.append(btn);
  }

  if (actions.children.length) body.append(actions);

  card.append(body);
  block.innerHTML = '';
  block.append(card);
}
