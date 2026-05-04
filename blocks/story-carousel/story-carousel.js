/**
 * story-carousel — Horizontally scrolling story carousel with arrows and quicklinks.
 * Authoring rows:
 *   1: Section heading (h3)
 *   2: Quicklinks — pipe-separated "label | URL" pairs
 *   3+: Tile rows — Cell 1=image, Cell 2=eyebrow, Cell 3=title, Cell 4=CTA text, Cell 5=link URL
 */
export default async function decorate(block) {
  const rows = [...block.children];

  // Row 1 — heading
  const h3 = document.createElement('h3');
  h3.textContent = rows[0]?.firstElementChild?.textContent.trim() ?? '';

  // Arrow buttons
  const prevBtn = document.createElement('button');
  prevBtn.className = 'theme-arrow';
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.textContent = '←';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'theme-arrow';
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.textContent = '→';

  const arrows = document.createElement('div');
  arrows.className = 'theme-arrows';
  arrows.append(prevBtn, nextBtn);

  const header = document.createElement('div');
  header.className = 'theme-header';
  header.append(h3, arrows);

  // Row 2 — quicklinks
  const quicklinksRaw = rows[1]?.firstElementChild?.textContent.trim() ?? '';
  const quicklinksSection = document.createElement('div');
  quicklinksSection.className = 'theme-quicklinks';

  const qlLabel = document.createElement('span');
  qlLabel.className = 'quicklinks-label';
  qlLabel.textContent = 'Explore:';
  quicklinksSection.append(qlLabel);

  const qlRow = document.createElement('div');
  qlRow.className = 'quicklinks-row';

  if (quicklinksRaw) {
    quicklinksRaw.split(' | ').forEach((pair) => {
      const [label, url] = pair.split('|').map((s) => s.trim());
      if (!label) return;
      const a = document.createElement('a');
      a.className = 'quicklink';
      a.href = url || '#';
      a.textContent = label;
      qlRow.append(a);
    });
  }

  quicklinksSection.append(qlRow);

  // Rows 3+ — tiles
  const track = document.createElement('div');
  track.className = 'theme-carousel-track';

  rows.slice(2).forEach((row) => {
    const cells = [...row.children];
    const picture = cells[0]?.querySelector('picture, img');
    const eyebrowText = cells[1]?.textContent.trim() ?? '';
    const titleText = cells[2]?.textContent.trim() ?? '';
    const ctaText = cells[3]?.textContent.trim() ?? '';
    const url = cells[4]?.textContent.trim() ?? '#';

    const a = document.createElement('a');
    a.className = 'tile-a';
    a.href = url;

    if (picture) a.append(picture);

    const band = document.createElement('div');
    band.className = 'tile-a-band';

    const eyebrow = document.createElement('p');
    eyebrow.className = 'tile-a-eyebrow';
    eyebrow.textContent = eyebrowText;

    const tileH3 = document.createElement('h3');
    tileH3.textContent = titleText;

    band.append(eyebrow, tileH3);

    if (ctaText) {
      const cta = document.createElement('span');
      cta.className = 'tile-a-cta';
      cta.textContent = ctaText;
      band.append(cta);
    }

    a.append(band);
    track.append(a);
  });

  // Arrow scroll behavior
  const SCROLL_AMOUNT = 0.9;
  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -track.clientWidth * SCROLL_AMOUNT, behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: track.clientWidth * SCROLL_AMOUNT, behavior: 'smooth' });
  });

  block.replaceChildren(header, quicklinksSection, track);
}
