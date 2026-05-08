/**
 * hero-announce — Announcement banner above the hero.
 *
 * Authoring rows (positional):
 *   1. Lockup image (the Adobe + Semrush SVG)
 *   2. Headline text
 *   3. Sub-text
 *   4. Primary CTA link
 *   5. Secondary CTA link
 */
export default async function decorate(block) {
  const rows = [...block.children];
  const lockupCell = rows[0]?.firstElementChild;
  const headCell   = rows[1]?.firstElementChild;
  const subCell    = rows[2]?.firstElementChild;
  const ctaPrimary = rows[3]?.firstElementChild;
  const ctaSecond  = rows[4]?.firstElementChild;

  const panel = document.createElement('div');
  panel.className = 'hero-announce__panel';

  if (lockupCell?.querySelector('img, picture')) {
    const img = lockupCell.querySelector('img, picture').cloneNode(true);
    img.className = 'hero-announce__lockup';
    panel.append(img);
  }

  const copy = document.createElement('div');
  copy.className = 'hero-announce__copy';
  if (headCell) {
    const h = document.createElement('p');
    h.className = 'hero-announce__head';
    h.textContent = headCell.textContent.trim();
    copy.append(h);
  }
  if (subCell) {
    const s = document.createElement('p');
    s.className = 'hero-announce__sub';
    s.textContent = subCell.textContent.trim();
    copy.append(s);
  }
  panel.append(copy);

  const ctas = document.createElement('div');
  ctas.className = 'hero-announce__ctas';
  if (ctaPrimary?.querySelector('a')) {
    const a = ctaPrimary.querySelector('a').cloneNode(true);
    a.className = 'hero-announce__cta hero-announce__cta--primary';
    ctas.append(a);
  }
  if (ctaSecond?.querySelector('a')) {
    const a = ctaSecond.querySelector('a').cloneNode(true);
    a.className = 'hero-announce__cta';
    ctas.append(a);
  }
  panel.append(ctas);

  block.replaceChildren(panel);
}
