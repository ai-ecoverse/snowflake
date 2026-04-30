/**
 * faq-main — Sticky category sidebar + accordion FAQ sections.
 *
 * Authoring rows (positional):
 *   Row 1: Category nav label (eyebrow text, e.g. "On this page")
 *   Row 2..N: FAQ category sections, each row = one category
 *     - Cell 1: Category heading (h2 text, also used as anchor ID)
 *     - Cell 2: Pipe-separated Q|A pairs, one pair per sub-row.
 *               Within each pair: first <p> or text node = question,
 *               remaining content = answer HTML.
 *
 * Authoring note: Each FAQ category is authored as a two-column row.
 * Column 1 = category name. Column 2 = a list of questions and answers.
 * Each question starts with a bold (<strong>) line; everything after is
 * the answer content until the next bold line.
 *
 * Simpler flat authoring shape:
 *   Row 1: "On this page" (eyebrow)
 *   Row 2: Category heading | <p><strong>Question text</strong></p><p>Answer...</p>...
 *   Row 3: Next category heading | ...
 */

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Row 0: eyebrow label for the sidebar nav
  const navLabel = rows[0]?.firstElementChild?.textContent.trim() || 'On this page';

  // Rows 1+: category sections
  const categoryRows = rows.slice(1);

  // Build sidebar nav
  const aside = document.createElement('aside');
  aside.className = 'cat-nav';

  const navEyebrow = document.createElement('p');
  navEyebrow.className = 'eyebrow';
  navEyebrow.textContent = navLabel;
  aside.append(navEyebrow);

  const navList = document.createElement('ol');
  aside.append(navList);

  // Build Q sections
  const content = document.createElement('div');
  content.className = 'faq-content';

  categoryRows.forEach((row) => {
    const cells = [...row.children];
    const headingCell = cells[0];
    const questionsCell = cells[1];

    if (!headingCell) return;

    const categoryName = headingCell.textContent.trim();
    const categoryId = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Sidebar nav entry
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${categoryId}`;
    a.textContent = categoryName;
    li.append(a);
    navList.append(li);

    // Category section
    const section = document.createElement('div');
    section.className = 'q-section';
    section.id = categoryId;

    const h2 = document.createElement('h2');
    h2.textContent = categoryName;
    section.append(h2);

    // Parse Q&A pairs from the questions cell
    // Each <p><strong>Question</strong></p> starts a new QA pair.
    // Everything until the next such <p> is the answer.
    if (questionsCell) {
      const nodes = [...questionsCell.childNodes];
      let currentQuestion = null;
      let currentAnswer = null;
      let currentDetails = null;

      const flushCurrent = () => {
        if (currentDetails) {
          section.append(currentDetails);
        }
      };

      nodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) return;

        // Detect question: a <p> whose first child is <strong>
        const firstChild = node.firstElementChild;
        const isQuestion = (
          node.nodeName === 'P'
          && firstChild
          && firstChild.nodeName === 'STRONG'
          && firstChild === node.firstElementChild
          && firstChild.textContent.trim() === node.textContent.trim()
        );

        if (isQuestion) {
          flushCurrent();
          currentDetails = document.createElement('details');
          currentDetails.className = 'q';

          const summary = document.createElement('summary');
          summary.textContent = firstChild.textContent.trim();
          currentDetails.append(summary);

          currentAnswer = document.createElement('div');
          currentAnswer.className = 'a';
          currentDetails.append(currentAnswer);
        } else if (currentAnswer) {
          currentAnswer.append(node.cloneNode(true));
        }
      });

      flushCurrent();
    }

    content.append(section);
  });

  // Assemble final layout
  const inner = document.createElement('div');
  inner.className = 'faq-inner';
  inner.append(aside, content);

  block.replaceChildren(inner);
}
