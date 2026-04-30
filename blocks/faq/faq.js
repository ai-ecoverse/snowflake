/**
 * faq — sticky sidebar category nav + accordion Q&A groups
 *
 * Authoring rows (positional):
 *   1. "nav" | Category 1 | Category 2 | ...  ← sidebar nav labels
 *   Then for each category:
 *     - "heading" | Category name              ← starts a new q-section
 *     - Question text | Answer HTML            ← accordion item
 */

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // ── Row 1: nav row
  const navRow = rows[0];
  const navCells = [...navRow.children];
  // navCells[0] is the "nav" signal cell; remaining cells are category labels
  const categoryLabels = navCells.slice(1).map((cell) => cell.textContent.trim());

  // Build sticky aside
  const aside = document.createElement('aside');
  aside.className = 'cat-nav';

  const navEyebrow = document.createElement('p');
  navEyebrow.className = 'eyebrow';
  navEyebrow.textContent = 'On this page';

  const ol = document.createElement('ol');
  categoryLabels.forEach((label) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${slugify(label)}`;
    a.textContent = label;
    li.append(a);
    ol.append(li);
  });

  aside.append(navEyebrow, ol);

  // ── Rows 2+: heading rows and question rows
  const contentArea = document.createElement('div');
  contentArea.className = 'faq-content';

  let currentSection = null;

  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    const firstCellText = cells[0]?.textContent?.trim() ?? '';

    if (firstCellText.toLowerCase() === 'heading') {
      // Start a new q-section
      const categoryName = cells[1]?.textContent?.trim() ?? '';
      currentSection = document.createElement('div');
      currentSection.className = 'q-section';
      currentSection.id = slugify(categoryName);

      const h2 = document.createElement('h2');
      h2.textContent = categoryName;
      currentSection.append(h2);
      contentArea.append(currentSection);
    } else {
      // Question/answer row — create a details accordion item
      if (!currentSection) return;

      const details = document.createElement('details');
      details.className = 'q';

      const summary = document.createElement('summary');
      summary.textContent = firstCellText;

      const answerDiv = document.createElement('div');
      answerDiv.className = 'a';
      answerDiv.innerHTML = cells[1]?.innerHTML ?? '';

      details.append(summary, answerDiv);
      currentSection.append(details);
    }
  });

  // ── Assemble grid wrapper
  const inner = document.createElement('div');
  inner.className = 'faq-inner';
  inner.append(aside, contentArea);

  block.replaceChildren(inner);
}
