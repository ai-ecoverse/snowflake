/**
 * studio-banner — Final CTA garage-door scroll-driven section (black, gradient).
 *
 * Authoring rows (positional):
 *   1. Headline
 *   2. Body paragraph (optional — may be empty)
 *   3. CTA links (primary and secondary, space-separated in one cell)
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const headCell = rows[0]?.firstElementChild;
  const bodyCell = rows[1]?.firstElementChild;
  const ctaCell  = rows[2]?.firstElementChild;

  // ── Background layer ───────────────────────────────────────────────────────
  const bg = document.createElement('div');
  bg.className = 'section-background';

  // ── Overlay ────────────────────────────────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.className = 'studio-banner__overlay';

  // ── Content ────────────────────────────────────────────────────────────────
  const content = document.createElement('div');
  content.className = 'studio-banner__content';

  if (headCell) {
    const h2 = document.createElement('h2');
    h2.className = 'title-2 studio-banner__title';
    h2.textContent = headCell.textContent.trim();
    content.append(h2);
  }

  const bodyText = bodyCell?.textContent.trim();
  if (bodyText) {
    const p = document.createElement('p');
    p.className = 'studio-banner__body';
    p.textContent = bodyText;
    content.append(p);
  }

  if (ctaCell) {
    const ctas = document.createElement('div');
    ctas.className = 'studio-banner__ctas';
    const links = [...ctaCell.querySelectorAll('a')];
    links.forEach((a, i) => {
      const clone = a.cloneNode(true);
      clone.className = i === 0 ? 'btn btn--solid-white' : 'btn btn--ghost-white';
      ctas.append(clone);
    });
    if (links.length) content.append(ctas);
  }

  block.replaceChildren(bg, overlay, content);
}
