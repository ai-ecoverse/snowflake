/**
 * faq-accordion — Sticky sidebar category nav + categorized accordion Q&A sections.
 *
 * Authoring rows (positional, mixed types):
 *   - Category heading row: 1 cell — text only (e.g. "Donations").
 *     Used as the nav anchor label and the section <h2>.
 *   - Q&A row: 2 cells — cell 1 is the question, cell 2 is the answer HTML
 *     (may contain <p>, <ul>, <a>, <strong>).
 *
 * The JS groups Q&A pairs under their preceding category heading and builds:
 *   - Left sidebar <nav class="cat-nav"> with an ordered list linking to #slug anchors
 *   - Main column with <div class="q-section" id="slug"> per category
 */

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/&[a-z]+;/gi, '') // strip HTML entities like &amp;
    .replace(/&/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export default async function decorate(block) {
  const rows = [...block.children];

  // Parse rows into categories with their Q&A pairs
  const categories = [];
  let current = null;

  for (const row of rows) {
    const cells = [...row.children];
    if (cells.length === 1) {
      // Category heading row
      const label = cells[0].textContent.trim();
      current = { label, slug: slugify(label), items: [] };
      categories.push(current);
    } else if (cells.length >= 2 && current) {
      // Q&A row
      const question = cells[0].textContent.trim();
      const answerCell = cells[1];
      current.items.push({ question, answerCell });
    }
  }

  // Build sidebar nav
  const nav = document.createElement('nav');
  nav.className = 'cat-nav';

  const navEyebrow = document.createElement('p');
  navEyebrow.className = 'eyebrow';
  navEyebrow.textContent = 'On this page';
  nav.appendChild(navEyebrow);

  const ol = document.createElement('ol');
  for (const cat of categories) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${cat.slug}`;
    a.textContent = cat.label;
    li.appendChild(a);
    ol.appendChild(li);
  }
  nav.appendChild(ol);

  // Build main Q&A column
  const mainCol = document.createElement('div');

  for (const cat of categories) {
    const section = document.createElement('div');
    section.className = 'q-section';
    section.id = cat.slug;

    const h2 = document.createElement('h2');
    h2.textContent = cat.label;
    section.appendChild(h2);

    for (const item of cat.items) {
      const details = document.createElement('details');
      details.className = 'q';

      const summary = document.createElement('summary');
      summary.textContent = item.question;
      details.appendChild(summary);

      const answerDiv = document.createElement('div');
      answerDiv.className = 'a';
      // Clone all children from the answer cell
      for (const child of item.answerCell.childNodes) {
        answerDiv.appendChild(child.cloneNode(true));
      }
      details.appendChild(answerDiv);
      section.appendChild(details);
    }

    mainCol.appendChild(section);
  }

  // Wrap in faq-inner layout
  const inner = document.createElement('div');
  inner.className = 'faq-inner';
  inner.appendChild(nav);
  inner.appendChild(mainCol);

  block.textContent = '';
  block.appendChild(inner);
}
