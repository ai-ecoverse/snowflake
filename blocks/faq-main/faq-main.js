/**
 * FAQ Main block
 * Authoring rows (positional):
 *   1. (optional) nav label eyebrow — single cell
 *   2+. Category rows: 2 cells
 *       cell 1 = category name (nav label + section heading)
 *       cell 2 = Q/A pairs: odd <p> = question, even <p> = answer
 *               (or <details>/<summary> HTML if pre-structured)
 */

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  let startRow = 0;
  let navLabel = 'On this page';

  // Check if first row is a single-cell nav eyebrow
  const firstCells = [...rows[0].children];
  if (firstCells.length === 1) {
    navLabel = firstCells[0]?.textContent?.trim() || navLabel;
    startRow = 1;
  }

  const categoryRows = rows.slice(startRow);

  // Build sidebar nav
  const nav = document.createElement('nav');
  nav.className = 'cat-nav';

  const navEyebrow = document.createElement('p');
  navEyebrow.className = 'nav-eyebrow';
  navEyebrow.textContent = navLabel;
  nav.append(navEyebrow);

  const ol = document.createElement('ol');
  nav.append(ol);

  // Build main content
  const mainContent = document.createElement('div');
  mainContent.className = 'faq-sections';

  categoryRows.forEach((row) => {
    const cells = [...row.children];
    const categoryName = cells[0]?.textContent?.trim() ?? '';
    const id = slugify(categoryName);

    // Nav item
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${id}`;
    a.textContent = categoryName;
    li.append(a);
    ol.append(li);

    // Section
    const section = document.createElement('div');
    section.className = 'q-section';
    section.id = id;

    const h2 = document.createElement('h2');
    h2.textContent = categoryName;
    section.append(h2);

    // Q/A pairs from cell 2
    const contentCell = cells[1];
    if (contentCell) {
      // Check if already has <details> elements
      const existingDetails = contentCell.querySelectorAll('details');
      if (existingDetails.length) {
        existingDetails.forEach((d) => {
          d.className = 'q';
          section.append(d.cloneNode(true));
        });
      } else {
        // Collect all paragraphs; odd index = question, even index = answer
        const paras = [...contentCell.querySelectorAll('p, li')].filter(
          (el) => el.textContent.trim()
        );

        for (let i = 0; i < paras.length; i += 2) {
          const questionText = paras[i]?.textContent?.trim() ?? '';
          const answerText = paras[i + 1]?.textContent?.trim() ?? '';

          if (!questionText) continue;

          const details = document.createElement('details');
          details.className = 'q';

          const summary = document.createElement('summary');
          summary.textContent = questionText;

          const answerDiv = document.createElement('div');
          answerDiv.className = 'a';

          if (paras[i + 1]) {
            // Clone the answer paragraph to preserve any HTML (links, lists)
            const cloned = paras[i + 1].cloneNode(true);
            answerDiv.append(cloned);
          } else if (answerText) {
            const p = document.createElement('p');
            p.textContent = answerText;
            answerDiv.append(p);
          }

          details.append(summary, answerDiv);
          section.append(details);
        }
      }
    }

    mainContent.append(section);
  });

  const inner = document.createElement('div');
  inner.className = 'faq-main-inner';
  inner.append(nav, mainContent);

  block.replaceChildren(inner);
}
