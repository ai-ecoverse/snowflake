/**
 * logo-strip — Partner logo wall (8 slots, grayscale filter).
 * Authoring rows:
 *   1: Section heading
 *   2+: Logo rows — each row contains one logo image (picture element)
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const fragments = [];

  // Row 1 — heading
  if (rows[0]) {
    const heading = document.createElement('h2');
    heading.textContent = rows[0].firstElementChild?.textContent.trim() ?? '';
    fragments.push(heading);
  }

  const wrap = document.createElement('div');
  wrap.className = 'logo-strip-wrap';

  const strip = document.createElement('div');
  strip.className = 'logo-strip';

  rows.slice(1).forEach((row) => {
    const picture = row.querySelector('picture, img');
    const logoWrap = document.createElement('div');
    logoWrap.className = 'partner-logo';
    if (picture) logoWrap.append(picture);
    strip.append(logoWrap);
  });

  wrap.append(strip);
  fragments.push(wrap);

  block.replaceChildren(...fragments);
}
