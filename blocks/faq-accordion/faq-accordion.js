/**
 * faq-accordion — FAQ content with sticky category nav + accordion Q&A sections
 *
 * Authoring rows (positional, repeating):
 *   Each category is a pair of rows:
 *     Row A (category header): single cell with category name and anchor id
 *                              e.g. "Donations | donations"
 *     Row B+ (Q&A pairs):      two cells — question | answer (HTML allowed in answer)
 *
 *   Repeat Row A + Row B+ pairs for each category.
 *
 *   Special: a row with a single cell containing only a pipe-separated "label | id"
 *   is treated as a category heading. All subsequent two-cell rows are Q&A until
 *   the next category heading.
 *
 * Example authoring:
 *   | Donations | donations |
 *   | Does The Road Home accept clothing? | Yes, we accept... |
 *   | What is the EIN? | 87-0212465 |
 *   | Volunteering | volunteering |
 *   | How can I help? | Visit our Get Involved page. |
 */

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Parse categories + Q&As
  const categories = [];
  let currentCat = null;

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1) {
      // Category heading: "Label | id" in a single cell, pipe-separated text
      const raw = cells[0].textContent.trim();
      const parts = raw.split('|').map((s) => s.trim());
      currentCat = { label: parts[0], id: parts[1] || parts[0].toLowerCase().replace(/\s+/g, '-'), items: [] };
      categories.push(currentCat);
    } else if (cells.length >= 2 && currentCat) {
      // Q&A row
      currentCat.items.push({
        question: cells[0].textContent.trim(),
        answerEl: cells[1],
      });
    }
  });

  // Build layout
  const outer = document.createElement('div');
  outer.className = 'faq-main';

  const grid = document.createElement('div');
  grid.className = 'faq-inner';

  // Sidebar nav
  const aside = document.createElement('aside');
  aside.className = 'cat-nav';
  const navEyebrow = document.createElement('p');
  navEyebrow.className = 'eyebrow';
  navEyebrow.textContent = 'On this page';
  aside.append(navEyebrow);

  const navOl = document.createElement('ol');
  categories.forEach(({ label, id }) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${id}`;
    a.textContent = label;
    li.append(a);
    navOl.append(li);
  });
  aside.append(navOl);

  // Main accordion area
  const main = document.createElement('div');

  categories.forEach(({ label, id, items }) => {
    const section = document.createElement('div');
    section.className = 'q-section';
    section.id = id;

    const h2 = document.createElement('h2');
    h2.textContent = label;
    section.append(h2);

    items.forEach(({ question, answerEl }) => {
      const details = document.createElement('details');
      details.className = 'q';

      const summary = document.createElement('summary');
      summary.textContent = question;
      details.append(summary);

      const answerDiv = document.createElement('div');
      answerDiv.className = 'a';
      // Clone the answer cell's content (may contain <p>, <ul>, <a>, <strong>)
      [...answerEl.childNodes].forEach((n) => answerDiv.append(n.cloneNode(true)));
      details.append(answerDiv);

      section.append(details);
    });

    main.append(section);
  });

  grid.append(aside, main);
  outer.append(grid);
  block.replaceChildren(outer);
}
