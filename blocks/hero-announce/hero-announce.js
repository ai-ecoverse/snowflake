/**
 * hero-announce — announcement banner (Adobe + Semrush acquisition)
 *
 * Authoring rows (positional):
 *   1. lockup image (<picture> or <img>)
 *   2. headline text
 *   3. subtitle text
 *   4. CTA links — first link is primary (solid white pill), subsequent are ghost
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const panel = document.createElement('div');
  panel.className = 'hero-announce__panel';

  // lockup
  const lockupCell = rows[0]?.firstElementChild;
  if (lockupCell) {
    const lockupWrap = document.createElement('div');
    lockupWrap.className = 'hero-announce__lockup-wrap';
    [...lockupCell.childNodes].forEach(n => lockupWrap.append(n.cloneNode(true)));
    const img = lockupWrap.querySelector('img');
    if (img) img.className = 'hero-announce__lockup';
    panel.append(lockupWrap);
  }

  // copy
  const copy = document.createElement('div');
  copy.className = 'hero-announce__copy';
  const headCell = rows[1]?.firstElementChild;
  const subCell = rows[2]?.firstElementChild;
  if (headCell) {
    const p = document.createElement('p');
    p.className = 'hero-announce__head';
    p.textContent = headCell.textContent.trim();
    copy.append(p);
  }
  if (subCell) {
    const p = document.createElement('p');
    p.className = 'hero-announce__sub';
    p.textContent = subCell.textContent.trim();
    copy.append(p);
  }
  panel.append(copy);

  // CTAs
  const ctaCell = rows[3]?.firstElementChild;
  if (ctaCell) {
    const ctas = document.createElement('div');
    ctas.className = 'hero-announce__ctas';
    const links = [...ctaCell.querySelectorAll('a')];
    links.forEach((a, i) => {
      const el = a.cloneNode(true);
      el.className = i === 0 ? 'hero-announce__cta hero-announce__cta--primary' : 'hero-announce__cta';
      ctas.append(el);
    });
    panel.append(ctas);
  }

  block.replaceChildren(panel);
}
