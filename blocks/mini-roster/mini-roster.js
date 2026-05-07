/**
 * Mini Roster block
 *
 * Authoring shape — each row = one mini card:
 *   Cell 1: thumbnail image (96x96)
 *   Cell 2: chip text | h3 title (with optional href in a child <a>) | meta (date · read-time)
 *            The cell may contain multiple <p> elements; first is chip, second is title, third is meta.
 *            OR the entire cell content may be a single set of child nodes to parse.
 *
 * Simpler authoring:
 *   Cell 1: image (links to article)
 *   Cell 2: chip text (first line/p) | h3 title | meta
 */
export default async function decorate(block) {
  const rows = [...block.children];

  // Section header row: if first row has a single cell containing heading text only (no image)
  // and matches "eyebrow | h2" pattern — detect by absence of img in row 0 col 0.
  // For simplicity we always inject a fixed section head.

  const inner = document.createElement('div');
  inner.className = 'mini-roster-inner';

  const sectionHead = document.createElement('div');
  sectionHead.className = 'section-head';
  sectionHead.innerHTML = `
    <div>
      <span class="ds-eyebrow">Also in the front</span>
      <h2>What else partners are reading</h2>
    </div>
  `;
  inner.append(sectionHead);

  const grid = document.createElement('div');
  grid.className = 'mini-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    const imgCell = cells[0];
    const bodyCell = cells[1];
    if (!imgCell || !bodyCell) return;

    const imgEl = imgCell.querySelector('img');
    if (!imgEl) return; // skip non-card rows

    // Extract link href from image parent anchor or body anchors
    const imgAnchor = imgCell.querySelector('a');
    const bodyAnchor = bodyCell.querySelector('a');
    const href = imgAnchor?.href || bodyAnchor?.href || '#';

    // Parse body cell: paragraphs or direct text nodes
    const paras = [...bodyCell.querySelectorAll('p')];
    const chipText = paras[0]?.textContent?.trim() || '';
    const titleText = paras[1]?.textContent?.trim() || bodyAnchor?.textContent?.trim() || '';
    const metaText = paras[2]?.textContent?.trim() || '';

    // Build card
    const card = document.createElement('a');
    card.className = 'mini-card';
    card.href = href;

    // Thumb
    const thumb = document.createElement('span');
    thumb.className = 'mini-thumb';
    imgEl.loading = 'lazy';
    thumb.append(imgEl);
    card.append(thumb);

    // Body
    const body = document.createElement('div');
    body.className = 'mini-body';

    if (chipText) {
      const chip = document.createElement('span');
      chip.className = `ds-chip ds-chip--${resolveChipMod(chipText)}`;
      chip.textContent = chipText;
      body.append(chip);
    }

    const h3 = document.createElement('h3');
    h3.textContent = titleText;
    body.append(h3);

    if (metaText) {
      const meta = document.createElement('div');
      meta.className = 'mini-meta';
      // Split on · or |
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
  return 'datacenter';
}
