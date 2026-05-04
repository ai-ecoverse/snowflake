/**
 * story-grid — 3-up editorial story grid with image tiles (variant A wide cards).
 * Authoring rows:
 *   1: Section heading (h3)
 *   2+: Tile rows — Cell 1=image, Cell 2=eyebrow, Cell 3=title, Cell 4=CTA text, Cell 5=link URL
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const fragments = [];

  // Row 1 — section heading
  if (rows[0]) {
    const h3 = document.createElement('h3');
    h3.textContent = rows[0].firstElementChild?.textContent.trim() ?? '';
    fragments.push(h3);
  }

  // Track for tiles
  const track = document.createElement('div');
  track.className = 'theme-carousel-track';

  rows.slice(1).forEach((row) => {
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

    const h3 = document.createElement('h3');
    h3.textContent = titleText;

    band.append(eyebrow, h3);

    if (ctaText) {
      const cta = document.createElement('span');
      cta.className = 'tile-a-cta';
      cta.textContent = ctaText;
      band.append(cta);
    }

    a.append(band);
    track.append(a);
  });

  fragments.push(track);
  block.replaceChildren(...fragments);
}
