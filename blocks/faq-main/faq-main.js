/**
 * faq-main — Two-column FAQ layout: sticky category nav + accordion Q&A sections
 *
 * Authoring rows (positional):
 *   1. Category nav label (eyebrow, e.g. "On this page")
 *   2..N: Category sections — each row has two cells:
 *         Cell 1: category heading (h2) with an id anchor (e.g. "donations")
 *         Cell 2: pipe-separated Q|A pairs, one row per question.
 *                 Use <strong> for question, plain text for answer.
 *                 Multi-paragraph answers separated by double newline.
 *
 * Simplified authoring: each category is one table row.
 * Cell 1 = the section heading text (used for both nav anchor and h2).
 * Cell 2 = alternating rows of question / answer text blocks.
 *
 * In practice the author creates one row per FAQ category:
 *   | Category Name | Q1 text [newline] A1 text [newline] Q2 text [newline] A2 text |
 */

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Row 0: nav eyebrow label
  const navLabel = rows[0]?.firstElementChild?.textContent?.trim() || 'On this page';

  // Rows 1+: category sections
  const categories = rows.slice(1).map((row) => {
    const cells = [...row.children];
    const heading = cells[0]?.textContent?.trim() || '';
    const id = heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    // Content cell: each <p> or line is alternately a question then answer
    const contentCell = cells[1];
    const items = [];
    if (contentCell) {
      const paras = [...contentCell.querySelectorAll('p, li')];
      if (paras.length) {
        // Group into Q/A pairs: odd-indexed = question, even = answer
        for (let i = 0; i < paras.length; i += 2) {
          const q = paras[i]?.innerHTML?.trim() || '';
          const a = paras[i + 1]?.innerHTML?.trim() || '';
          if (q) items.push({ q, a });
        }
      } else {
        // Fallback: split by double newline
        const lines = contentCell.textContent.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
        for (let i = 0; i < lines.length; i += 2) {
          if (lines[i]) items.push({ q: lines[i], a: lines[i + 1] || '' });
        }
      }
    }
    return { heading, id, items };
  });

  // Build nav
  const nav = document.createElement('aside');
  nav.className = 'cat-nav';
  const navEyebrow = document.createElement('p');
  navEyebrow.className = 'eyebrow';
  navEyebrow.textContent = navLabel;
  nav.append(navEyebrow);

  const navList = document.createElement('ol');
  categories.forEach(({ heading, id }) => {
    if (!heading) return;
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${id}`;
    a.textContent = heading;
    li.append(a);
    navList.append(li);
  });
  nav.append(navList);

  // Build Q&A sections
  const content = document.createElement('div');
  content.className = 'faq-content';

  categories.forEach(({ heading, id, items }) => {
    if (!heading) return;
    const section = document.createElement('div');
    section.className = 'q-section';
    section.id = id;

    const h2 = document.createElement('h2');
    h2.textContent = heading;
    section.append(h2);

    items.forEach(({ q, a }) => {
      const details = document.createElement('details');
      details.className = 'q';

      const summary = document.createElement('summary');
      summary.innerHTML = q;
      details.append(summary);

      const answerDiv = document.createElement('div');
      answerDiv.className = 'a';
      if (a) {
        const p = document.createElement('p');
        p.innerHTML = a;
        answerDiv.append(p);
      }
      details.append(answerDiv);
      section.append(details);
    });

    content.append(section);
  });

  // Assemble
  const inner = document.createElement('div');
  inner.className = 'faq-inner';
  inner.append(nav, content);

  block.replaceChildren(inner);
}
