/**
 * faq-accordion — Two-column FAQ layout with sticky category nav and
 * expandable question/answer sections grouped by category.
 *
 * Authoring rows (positional):
 *   1. Category nav label (e.g. "On this page")
 *   Then, repeating groups per category:
 *     Category header row: single cell with category name text
 *     Q&A pair rows: two cells — question | answer HTML
 *
 * The block distinguishes Q&A rows from category headers by checking whether
 * a row has two cells (Q&A) vs one cell that doesn't look like plain text.
 *
 * Simplified authoring: the sprinkle passes a flat list of rows where:
 *   - Row with 1 cell + no pipe = nav label (first row only)
 *   - Row with 1 cell = category heading
 *   - Row with 2 cells = question | answer
 */

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // ── Build outer layout ───────────────────────────────────────────────────
  const inner = document.createElement('div');
  inner.className = 'faq-inner';

  const aside = document.createElement('aside');
  aside.className = 'cat-nav';

  const content = document.createElement('div');
  content.className = 'faq-content';

  inner.append(aside, content);

  // ── Parse nav label from first row ───────────────────────────────────────
  let rowIndex = 0;
  const firstRowCells = [...rows[0].children];
  let navLabel = 'On this page';
  if (firstRowCells.length === 1 && !firstRowCells[0].querySelector('p, h1, h2, h3, ul, details')) {
    navLabel = firstRowCells[0].textContent.trim();
    rowIndex = 1;
  }

  const navEyebrow = document.createElement('p');
  navEyebrow.className = 'eyebrow';
  navEyebrow.textContent = navLabel;
  aside.append(navEyebrow);

  const navList = document.createElement('ol');
  aside.append(navList);

  // ── Parse categories and Q&A pairs ──────────────────────────────────────
  let currentSection = null;
  let currentList = null;

  for (let i = rowIndex; i < rows.length; i++) {
    const cells = [...rows[i].children];

    if (cells.length === 1) {
      // Category heading
      const catName = cells[0].textContent.trim();
      const catId = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      // Nav entry
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${catId}`;
      a.textContent = catName;
      li.append(a);
      navList.append(li);

      // Section
      currentSection = document.createElement('div');
      currentSection.className = 'q-section';
      currentSection.id = catId;

      const h2 = document.createElement('h2');
      h2.textContent = catName;
      currentSection.append(h2);

      currentList = document.createElement('div');
      currentList.className = 'q-list';
      currentSection.append(currentList);
      content.append(currentSection);

    } else if (cells.length >= 2 && currentList) {
      // Q&A row
      const question = cells[0].textContent.trim();
      const answerCell = cells[1];

      const details = document.createElement('details');
      details.className = 'q';

      const summary = document.createElement('summary');
      summary.textContent = question;
      details.append(summary);

      const answerDiv = document.createElement('div');
      answerDiv.className = 'a';
      [...answerCell.childNodes].forEach((n) => answerDiv.append(n.cloneNode(true)));
      details.append(answerDiv);

      // Toggle +/− via JS to avoid CSS content conflict with reduced-motion
      details.addEventListener('toggle', () => {
        // Handled purely via CSS ::after
      });

      currentList.append(details);
    }
  }

  block.replaceChildren(inner);
}
