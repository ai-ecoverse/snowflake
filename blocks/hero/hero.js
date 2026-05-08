/**
 * hero — full-bleed featured article card (v09 platinum with lifestyle photo background)
 *
 * Authoring rows (positional):
 *   1. Background image URL (text) — lifestyle photo for the right-side background
 *   2. Eyebrow text
 *   3. <picture> / <img> — article thumbnail (309×309)
 *   4. Article URL (link) — wraps the thumbnail
 *   5. <h1> headline
 *   6. Deck paragraph
 *   7. Meta line (chip | date | read-time | author — separated by ·)
 *   8. Tag row — each cell is one tag link
 *   9. CTA — <strong><a> for primary button
 */

function text(cell) { return cell ? cell.textContent.trim() : ''; }
function html(cell) { return cell ? cell.innerHTML : ''; }
function el(cell) { return cell ? cell.firstElementChild : null; }

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Row 0: background image URL
  const bgUrl = text(rows[0]?.firstElementChild);

  // Row 1: eyebrow
  const eyebrow = text(rows[1]?.firstElementChild);

  // Row 2: thumb cell (contains <picture> or <img>); row 3: article href
  const thumbCell = rows[2]?.firstElementChild;
  const articleHref = text(rows[3]?.firstElementChild) || '#';

  // Row 4: headline (h1)
  const headlineCell = rows[4]?.firstElementChild;

  // Row 5: deck
  const deckCell = rows[5]?.firstElementChild;

  // Row 6: meta
  const metaCell = rows[6]?.firstElementChild;

  // Row 7: tags (each child <div> is one tag)
  const tagRow = rows[7];

  // Row 8: CTA
  const ctaCell = rows[8]?.firstElementChild;

  // Apply background image
  if (bgUrl) {
    block.style.setProperty('--hero-bg-image', `url('${bgUrl}')`);
  }

  // Build card
  const card = document.createElement('div');
  card.className = 'hero-card';

  // Thumb
  const thumbLink = document.createElement('a');
  thumbLink.className = 'hero-thumb';
  thumbLink.href = articleHref;
  thumbLink.setAttribute('aria-label', 'Read the lead story');
  if (thumbCell) {
    [...thumbCell.childNodes].forEach((n) => thumbLink.append(n.cloneNode(true)));
  }

  // Body
  const body = document.createElement('div');
  body.className = 'hero-body';

  if (eyebrow) {
    const ey = document.createElement('span');
    ey.className = 'ds-eyebrow ds-eyebrow--brass-deep';
    ey.textContent = eyebrow;
    body.append(ey);
  }

  // Headline — clone from authored h1
  if (headlineCell) {
    const h1 = headlineCell.querySelector('h1') || document.createElement('h1');
    if (!headlineCell.querySelector('h1')) h1.textContent = text(headlineCell);
    body.append(h1.cloneNode(true));
  }

  // Deck
  if (deckCell) {
    const deck = document.createElement('p');
    deck.className = 'hero-deck';
    [...deckCell.childNodes].forEach((n) => deck.append(n.cloneNode(true)));
    body.append(deck);
  }

  // Meta
  if (metaCell) {
    const meta = document.createElement('div');
    meta.className = 'hero-meta';
    [...metaCell.childNodes].forEach((n) => meta.append(n.cloneNode(true)));
    body.append(meta);
  }

  // Tags
  if (tagRow) {
    const tagRowEl = document.createElement('div');
    tagRowEl.className = 'ds-tag-row';
    tagRowEl.setAttribute('aria-label', 'Tags');
    [...tagRow.children].forEach((cell) => {
      const a = cell.querySelector('a');
      if (a) {
        const tag = a.cloneNode(true);
        tag.className = 'ds-tag';
        tagRowEl.append(tag);
      }
    });
    if (tagRowEl.children.length) body.append(tagRowEl);
  }

  // CTA
  if (ctaCell && ctaCell.querySelector('a')) {
    const actions = document.createElement('div');
    actions.className = 'hero-actions';
    [...ctaCell.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
    body.append(actions);
  }

  card.append(thumbLink, body);

  const inner = document.createElement('div');
  inner.className = 'hero-inner ds-container';
  inner.append(card);

  block.replaceChildren(inner);

  // Delight: H1 word-by-word reveal
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const h1 = block.querySelector('h1');
    if (h1) {
      const words = h1.textContent.split(/(\s+)/);
      let idx = 0;
      h1.innerHTML = words.map((part) => {
        if (/^\s+$/.test(part)) return part;
        const span = document.createElement('span');
        span.className = 'word';
        span.style.animationDelay = `${idx * 70}ms`;
        span.textContent = part;
        idx += 1;
        return span.outerHTML;
      }).join('');
    }
  }
}
