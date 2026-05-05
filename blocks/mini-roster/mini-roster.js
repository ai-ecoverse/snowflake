/**
 * Mini Roster block — "What else partners are reading" — 3 mini cards.
 *
 * Authoring: 3 rows, each row = one card.
 *   Cell A: <picture> or linked <picture>
 *   Cell B: chip label | <h3> headline | date | read-time
 *           (pipe-delimited plain text, or structured with h3 + plain text)
 */

function chipVariant(text) {
  const t = (text || '').toLowerCase();
  if (t.includes('ai') || t.includes('artificial')) return 'ds-chip--ai';
  if (t.includes('workplace') || t.includes('hybrid')) return 'ds-chip--workplace';
  if (t.includes('datacenter') || t.includes('data center')) return 'ds-chip--datacenter';
  if (t.includes('storage')) return 'ds-chip--datacenter';
  if (t.includes('dell tech')) return 'ds-chip--neutral';
  return 'ds-chip--neutral';
}

export default function decorate(block) {
  // eslint-disable-next-line no-console
  console.log('[mini-roster] block.innerHTML at start:', block.innerHTML.substring(0, 300));
  const rows = [...block.querySelectorAll(':scope > div')];

  // First row may be a section head (contains h2) — check
  let dataRows = rows;
  const headRow = rows.find((r) => r.querySelector('h2'));
  if (headRow) {
    // Build section head
    const headWrap = document.createElement('div');
    headWrap.className = 'ds-section-head';
    const inner2 = document.createElement('div');
    const eyebrowEl = headRow.querySelector('.ds-eyebrow, [class*="eyebrow"]');
    const h2El = headRow.querySelector('h2');
    // If no explicit eyebrow, use first text node
    const eyebrowText = eyebrowEl?.textContent.trim() || 'Also in the front';
    const ew = document.createElement('span');
    ew.className = 'ds-eyebrow';
    ew.textContent = eyebrowText;
    inner2.append(ew);
    if (h2El) inner2.append(h2El.cloneNode(true));
    headWrap.append(inner2);
    dataRows = rows.filter((r) => r !== headRow);
  }

  block.innerHTML = '';

  const outer = document.createElement('div');
  outer.className = 'ds-container';

  // Section head
  const secHead = document.createElement('div');
  secHead.className = 'ds-section-head';
  const secHeadInner = document.createElement('div');
  const ew = document.createElement('span');
  ew.className = 'ds-eyebrow';
  ew.textContent = 'Also in the front';
  const h2 = document.createElement('h2');
  h2.textContent = 'What else partners are reading';
  secHeadInner.append(ew, h2);
  secHead.append(secHeadInner);
  outer.append(secHead);

  const grid = document.createElement('div');
  grid.className = 'ds-mini-grid';

  dataRows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (cells.length < 2) return;

    const picCell = cells[0];
    const bodyCell = cells[1];

    // Pic cell: <p><code>img-url</code></p> — DA passes <code> through verbatim.
    const imgCode = picCell?.querySelector('code');
    const imgSrc = imgCode?.textContent.trim() || '';
    // eslint-disable-next-line no-console
    console.log('[mini-roster] picCell innerHTML:', picCell?.innerHTML?.substring(0,200), 'imgSrc:', imgSrc);
    const imgAlt = picCell?.querySelector('a')?.textContent.trim() || '';
    // Article href: prefer h3 > a, then any link in body
    const h3Anchor = bodyCell?.querySelector('h3 a');
    const bodyAnchor = h3Anchor || bodyCell.querySelector('a');
    const href = bodyAnchor?.href || '#';

    const card = document.createElement('a');
    card.className = 'ds-mini-card';
    card.href = href;

    // Thumb
    const thumb = document.createElement('span');
    thumb.className = 'ds-mini-thumb';
    const pic = imgSrc; // truthy check
    if (pic) {
      const img = document.createElement('img');
      img.setAttribute('src', imgSrc);
      img.alt = imgAlt;
      img.setAttribute('loading', 'lazy');
      img.width = 96;
      img.height = 96;
      thumb.append(img);
    }
    card.append(thumb);

    // Body
    const body = document.createElement('div');
    body.className = 'ds-mini-body';

    // Chip: first line of body text before h3, or first cell text
    const h3El = bodyCell.querySelector('h3');
    let chipText = '';
    let headlineText = '';
    let metaText = '';

    if (h3El) {
      // Chip text = text before h3
      const walker = document.createTreeWalker(bodyCell, NodeFilter.SHOW_TEXT);
      const beforeH3 = [];
      let node = walker.nextNode();
      while (node) {
        if (!h3El.contains(node)) beforeH3.push(node.textContent.trim());
        node = walker.nextNode();
      }
      chipText = beforeH3.filter(Boolean)[0] || '';
      headlineText = h3El.textContent.trim();
      // Meta = text after h3
      const allText = bodyCell.textContent.replace(chipText, '').replace(headlineText, '').trim();
      metaText = allText;
    } else {
      // Parse from pipe-delimited or line text
      const lines = bodyCell.textContent.split(/[\n|·•]/).map((s) => s.trim()).filter(Boolean);
      chipText = lines[0] || '';
      headlineText = lines[1] || '';
      metaText = lines.slice(2).join(' · ');
    }

    // Chip
    if (chipText) {
      const chip = document.createElement('span');
      chip.className = `ds-chip ${chipVariant(chipText)}`;
      chip.textContent = chipText;
      body.append(chip);
    }

    // Headline
    if (headlineText) {
      const h3 = document.createElement('h3');
      h3.textContent = headlineText;
      body.append(h3);
    }

    // Meta
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
