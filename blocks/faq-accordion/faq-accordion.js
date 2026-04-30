/**
 * faq-accordion — categorised FAQ with sticky sidebar nav and expand/collapse
 * accordion items.
 *
 * Authoring rows (positional):
 *   Row 1, 1 cell  — sidebar eyebrow label (e.g. "On this page")
 *   Row N, 1 cell  — category heading (marks start of a new category group).
 *                    The cell must contain an <h2> or plain text treated as h2.
 *   Row N, 2 cells — Q&A pair. Cell 1: question text. Cell 2: answer HTML.
 *
 * Categories are detected as single-cell rows after the first (eyebrow) row.
 * The sidebar nav is auto-generated from category headings with anchor links.
 */

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Row 0: sidebar eyebrow
  const eyebrowText = rows[0]?.firstElementChild?.textContent?.trim() || 'On this page';

  // Parse remaining rows into categories + Q&A pairs
  const categories = [];
  let currentCat = null;

  for (let i = 1; i < rows.length; i++) {
    const cells = [...rows[i].children];
    if (cells.length === 1) {
      // Category header
      const heading = cells[0].querySelector('h2') || cells[0];
      const name = heading.textContent.trim();
      currentCat = { name, slug: slugify(name), items: [] };
      categories.push(currentCat);
    } else if (cells.length >= 2 && currentCat) {
      // Q&A pair
      currentCat.items.push({
        question: cells[0].innerHTML.trim(),
        answer: cells[1].innerHTML.trim(),
      });
    }
  }

  // Build sidebar nav
  const nav = document.createElement('aside');
  nav.className = 'cat-nav';

  const navEyebrow = document.createElement('p');
  navEyebrow.className = 'eyebrow';
  navEyebrow.textContent = eyebrowText;
  nav.append(navEyebrow);

  const ol = document.createElement('ol');
  categories.forEach((cat) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#faq-${cat.slug}`;
    a.textContent = cat.name;
    li.append(a);
    ol.append(li);
  });
  nav.append(ol);

  // Build FAQ content area
  const content = document.createElement('div');
  content.className = 'faq-content';

  categories.forEach((cat) => {
    const section = document.createElement('div');
    section.className = 'q-section';
    section.id = `faq-${cat.slug}`;

    const h2 = document.createElement('h2');
    h2.textContent = cat.name;
    section.append(h2);

    cat.items.forEach(({ question, answer }) => {
      const details = document.createElement('details');
      details.className = 'q';

      const summary = document.createElement('summary');
      summary.innerHTML = question;
      details.append(summary);

      const answerDiv = document.createElement('div');
      answerDiv.className = 'a';
      answerDiv.innerHTML = answer;
      details.append(answerDiv);

      section.append(details);
    });

    content.append(section);
  });

  // Assemble inner layout
  const inner = document.createElement('div');
  inner.className = 'faq-inner';
  inner.append(nav, content);

  block.replaceChildren(inner);
}
