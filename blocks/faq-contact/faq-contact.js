import { el, rows, cells, resetBlock } from '../../scripts/utils/dom.js';

/**
 * faq-contact block
 *
 * Authoring shape:
 *   Row 1 — 1 cell  — h2 heading ("Still have questions?")
 *   Row 2+ — 3 cells each:
 *     cell 1: eyebrow label (em)
 *     cell 2: h3 card title
 *     cell 3: plain <a> link (href + link text)
 */
export default async function decorate(block) {
  const allRows = rows(block);
  if (!allRows.length) return;

  // ── Row 1: heading ────────────────────────────────────────────────────
  const headingHTML = cells(allRows[0])[0]?.innerHTML ?? '';

  // ── Rows 2+: contact cards ────────────────────────────────────────────
  const cards = allRows.slice(1).map((row) => {
    const cols = cells(row);
    const eyebrowEl = cols[0]?.querySelector('em') ?? cols[0];
    const eyebrowText = eyebrowEl ? eyebrowEl.textContent.trim() : '';

    const h3El = cols[1]?.querySelector('h3');
    const titleText = h3El ? h3El.textContent.trim() : cols[1]?.textContent.trim() ?? '';

    const linkEl = cols[2]?.querySelector('a');
    const linkHref = linkEl?.getAttribute('href') ?? '';
    const linkText = linkEl?.textContent.trim() ?? '';

    return el('div', { class: 'still-card' },
      el('p', { class: 'eyebrow' }, eyebrowText),
      el('h3', {}, titleText),
      el('a', { href: linkHref }, linkText),
    );
  });

  // ── Rebuild block ─────────────────────────────────────────────────────
  resetBlock(block, 'faq-contact');

  const h2 = document.createElement('h2');
  h2.innerHTML = headingHTML;

  const grid = el('div', { class: 'still-grid' }, ...cards);
  const inner = el('div', { class: 'still-have-inner' }, h2, grid);

  block.append(inner);
}
