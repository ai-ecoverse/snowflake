/**
 * Reads block — "This week's reads" — 2×2 roster grid.
 *
 * Authoring: 4 rows, each = one card.
 *   Cell A: <picture>
 *   Cell B: chip label | <h3> headline | deck paragraph | date | read-time | author
 */

function chipVariant(text) {
  const t = (text || '').toLowerCase();
  if (t.includes('ai') || t.includes('artificial')) return 'ds-chip--ai';
  if (t.includes('workplace') || t.includes('hybrid')) return 'ds-chip--workplace';
  if (t.includes('datacenter') || t.includes('data center') || t.includes('storage')) return 'ds-chip--datacenter';
  if (t.includes('dell tech')) return 'ds-chip--neutral';
  return 'ds-chip--neutral';
}

function parseBody(bodyCell) {
  const h3El = bodyCell.querySelector('h3');
  const pEls = [...bodyCell.querySelectorAll('p')];
  let chipText = '';
  let headlineText = '';
  let deckText = '';
  let metaText = '';

  if (h3El) {
    // chip = text before h3
    const allNodes = [...bodyCell.childNodes];
    const chipParts = [];
    for (const node of allNodes) {
      if (node === h3El || (node.nodeType === Node.ELEMENT_NODE && node.contains(h3El))) break;
      chipParts.push(node.textContent.trim());
    }
    chipText = chipParts.filter(Boolean).join(' ');
    headlineText = h3El.textContent.trim();

    // deck = first <p> or italic-ish content after h3
    const afterH3 = pEls.filter((p) => !p.contains(h3El));
    if (afterH3.length) {
      deckText = afterH3[0].textContent.trim();
      metaText = afterH3.slice(1).map((p) => p.textContent.trim()).join(' · ');
    }
  } else {
    const lines = bodyCell.textContent.split(/[\n|]/).map((s) => s.trim()).filter(Boolean);
    chipText = lines[0] || '';
    headlineText = lines[1] || '';
    deckText = lines[2] || '';
    metaText = lines.slice(3).join(' · ');
  }

  return { chipText, headlineText, deckText, metaText };
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  block.innerHTML = '';

  const outer = document.createElement('div');
  outer.className = 'ds-container';

  // Section head
  const secHead = document.createElement('div');
  secHead.className = 'ds-section-head';
  const secHeadInner = document.createElement('div');
  const ew = document.createElement('span');
  ew.className = 'ds-eyebrow';
  ew.textContent = 'This Week';
  const h2 = document.createElement('h2');
  h2.textContent = "This week's reads";
  secHeadInner.append(ew, h2);
  secHead.append(secHeadInner);

  const allLink = document.createElement('a');
  allLink.className = 'ds-link-arrow';
  allLink.href = '/newsroom';
  allLink.textContent = 'All articles →';
  secHead.append(allLink);

  outer.append(secHead);

  const grid = document.createElement('div');
  grid.className = 'ds-roster';

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (cells.length < 2) return;

    const picCell = cells[0];
    const bodyCell = cells[1];

    // pic cell anchor href = image URL; get article link from body cell
    const bodyAnchor = bodyCell.querySelector('a');
    const href = bodyAnchor?.href || '#';

    const { chipText, headlineText, deckText, metaText } = parseBody(bodyCell);

    const card = document.createElement('a');
    card.className = 'ds-roster-card';
    card.href = href;

    // Thumb
    const thumb = document.createElement('span');
    thumb.className = 'ds-roster-thumb';
    // Pic cell: <p><a href="img-url">alt text</a></p> — DA preserves href values
    const imgAnchor = picCell?.querySelector('a');
    const imgSrc = imgAnchor?.href || imgAnchor?.getAttribute('href') || '';
    const imgAlt = imgAnchor?.textContent.trim() || '';
    const pic = imgSrc; // truthy check
    if (pic) {
      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = imgAlt;
      img.setAttribute('loading', 'lazy');
      img.width = 200;
      img.height = 200;
      thumb.append(img);
    }
    card.append(thumb);

    // Body
    const body = document.createElement('div');
    body.className = 'ds-roster-body';

    if (chipText) {
      const chip = document.createElement('span');
      chip.className = `ds-chip ${chipVariant(chipText)}`;
      chip.textContent = chipText;
      body.append(chip);
    }

    if (headlineText) {
      const h3 = document.createElement('h3');
      h3.textContent = headlineText;
      body.append(h3);
    }

    if (deckText) {
      const deck = document.createElement('p');
      deck.className = 'ds-deck';
      deck.textContent = deckText;
      body.append(deck);
    }

    if (metaText) {
      const meta = document.createElement('div');
      meta.className = 'ds-meta';
      meta.textContent = metaText;
      body.append(meta);
    }

    card.append(body);
    grid.append(card);
  });

  outer.append(grid);
  block.append(outer);
}
