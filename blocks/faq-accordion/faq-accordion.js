import { el, rows, cells, resetBlock } from '../../scripts/utils/dom.js';

/**
 * faq-accordion block
 *
 * Authoring shape (flat rows inside the block div):
 *   Category row  — 1 cell  — contains <h2> with category name
 *   Q row         — 2 cells — cell 1: question text (strong), cell 2: answer HTML
 *
 * The JS rebuilds a two-column layout:
 *   Left  — sticky category nav <ol> (auto-generated from category names)
 *   Right — <div class="q-sections"> with one <div class="q-section"> per category,
 *           each containing an <h2 id="anchor"> and <details class="q"> items.
 */
export default async function decorate(block) {
  const allRows = rows(block);

  // ── Parse flat rows into categories ────────────────────────────────────
  const categories = []; // [{ name, anchor, questions: [{q, aHTML}] }]
  let current = null;

  for (const row of allRows) {
    const cols = cells(row);

    if (cols.length === 1) {
      // Category header row — extract name from h2 or plain text
      const h2 = cols[0].querySelector('h2');
      const name = h2 ? h2.textContent.trim() : cols[0].textContent.trim();
      if (!name) continue; // skip blank separator rows
      const anchor = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      current = { name, anchor, questions: [] };
      categories.push(current);
    } else if (cols.length >= 2 && current) {
      // Q&A row
      const qText = cols[0].textContent.trim();
      const aHTML = cols[1].innerHTML;
      if (qText) current.questions.push({ q: qText, aHTML });
    }
  }

  // ── Build DOM ────────────────────────────────────────────────────────────
  resetBlock(block, 'faq-accordion');

  // Left: sticky category nav
  const navItems = categories.map(({ name, anchor }) =>
    el('li', {}, el('a', { href: `#${anchor}` }, name)),
  );
  const catNav = el('aside', { class: 'cat-nav' },
    el('p', { class: 'eyebrow' }, 'On this page'),
    el('ol', {}, ...navItems),
  );

  // Right: accordion sections
  const qSections = categories.map(({ name, anchor, questions }) => {
    const items = questions.map(({ q, aHTML }) => {
      const answerDiv = el('div', { class: 'a' });
      answerDiv.innerHTML = aHTML;
      return el('details', { class: 'q' },
        el('summary', {}, q),
        answerDiv,
      );
    });
    return el('div', { class: 'q-section', id: anchor },
      el('h2', {}, name),
      ...items,
    );
  });

  const qCol = el('div', { class: 'q-sections' }, ...qSections);

  const inner = el('div', { class: 'faq-inner' }, catNav, qCol);
  block.append(inner);
}
