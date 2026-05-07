/**
 * Reads block — 2x2 magazine roster
 *
 * Authoring shape — each row = one roster card:
 *   Cell 1: thumbnail image (200x200)
 *   Cell 2: chip text | h3 title | deck | meta (date · read-time · author)
 *           Parsed as successive <p> elements: p[0]=chip, p[1]=title, p[2]=deck, p[3]=meta
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const inner = document.createElement('div');
  inner.className = 'reads-inner';

  // Section head
  const sectionHead = document.createElement('div');
  sectionHead.className = 'section-head';
  sectionHead.innerHTML = `
    <div>
      <span class="ds-eyebrow">This Week</span>
      <h2>This week&rsquo;s reads</h2>
    </div>
    <a class="ds-link-arrow" href="/newsroom">All articles →</a>
  `;
  inner.append(sectionHead);

  const grid = document.createElement('div');
  grid.className = 'roster-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    const imgCell = cells[0];
    const bodyCell = cells[1];
    if (!imgCell || !bodyCell) return;

    const imgEl = imgCell.querySelector('img');
    if (!imgEl) return;

    const imgAnchor = imgCell.querySelector('a');
    const bodyAnchor = bodyCell.querySelector('a');
    const href = imgAnchor?.href || bodyAnchor?.href || '#';

    const paras = [...bodyCell.querySelectorAll('p')];
    const chipText = paras[0]?.textContent?.trim() || '';
    const titleText = paras[1]?.textContent?.trim() || bodyAnchor?.textContent?.trim() || '';
    const deckHTML = paras[2]?.innerHTML || '';
    const metaText = paras[3]?.textContent?.trim() || '';

    const card = document.createElement('a');
    card.className = 'roster-card';
    card.href = href;

    // Thumb
    const thumb = document.createElement('span');
    thumb.className = 'roster-thumb';
    imgEl.loading = 'lazy';
    thumb.append(imgEl);
    card.append(thumb);

    // Body
    const body = document.createElement('div');
    body.className = 'roster-body';

    if (chipText) {
      const chip = document.createElement('span');
      chip.className = `ds-chip ds-chip--${resolveChipMod(chipText)}`;
      chip.textContent = chipText;
      body.append(chip);
    }

    const h3 = document.createElement('h3');
    h3.textContent = titleText;
    body.append(h3);

    if (deckHTML) {
      const deck = document.createElement('p');
      deck.className = 'roster-deck';
      deck.innerHTML = deckHTML;
      body.append(deck);
    }

    if (metaText) {
      const meta = document.createElement('div');
      meta.className = 'roster-meta';
      const parts = metaText.split(/[·|]/).map((p) => p.trim()).filter(Boolean);
      parts.forEach((p, i) => {
        if (i > 0) {
          const sep = document.createElement('span');
          sep.setAttribute('aria-hidden', 'true');
          sep.textContent = '·';
          meta.append(sep);
        }
        const s = document.createElement('span');
        s.textContent = p;
        meta.append(s);
      });
      body.append(meta);
    }

    card.append(body);
    grid.append(card);
  });

  inner.append(grid);
  block.innerHTML = '';
  block.append(inner);
}

function resolveChipMod(label) {
  const lower = label.toLowerCase();
  if (lower.includes('workplace')) return 'workplace';
  if (lower.includes('storage')) return 'datacenter';
  if (lower.includes('datacenter') || lower.includes('data center')) return 'datacenter';
  if (lower.includes('ai') || lower.includes('artificial')) return 'ai';
  if (lower.includes('advantage') || lower.includes('dta')) return 'neutral';
  return 'neutral';
}
