/**
 * faq-accordion — Two-column FAQ layout: sticky category nav + grouped Q&A sections.
 *
 * Authoring rows (positional):
 *   Row 1: Category navigation heading (e.g. "On this page")
 *   Row 2+: Category groups, each with two cells:
 *     Cell 1: Category heading (e.g. "Donations") — becomes a nav anchor + section h2
 *     Cell 2: Q&A pairs, alternating: question paragraph, answer div/paragraphs
 *             Each Q is a <strong> or bold paragraph; the following content is the answer.
 *             Pairs are separated by <hr> or grouped as consecutive strong+content blocks.
 *
 * Simplified authoring: each category group is one row.
 *   Cell 1: section title (plain text, used as nav label and section heading)
 *   Cell 2: Q&A content — alternating <p><strong>Question</strong></p> then answer paragraphs,
 *           separated by <hr>
 */

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function buildQASection(categorySlug, heading, contentCell) {
  const section = document.createElement('div');
  section.className = 'q-section';
  section.id = categorySlug;

  const h2 = document.createElement('h2');
  h2.textContent = heading;
  section.append(h2);

  // Parse Q&A pairs from content cell
  // Each <strong> in a paragraph starts a new question; everything until the next strong is the answer
  const nodes = [...contentCell.childNodes];
  let currentQ = null;
  let currentAnswer = null;

  const finalizeQ = () => {
    if (currentQ) {
      const details = document.createElement('details');
      details.className = 'q';

      const summary = document.createElement('summary');
      summary.textContent = currentQ;
      details.append(summary);

      if (currentAnswer) {
        currentAnswer.className = 'a';
        details.append(currentAnswer);
      }

      section.append(details);
      currentQ = null;
      currentAnswer = null;
    }
  };

  nodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) return;

    const el = node;
    // Detect question: a paragraph whose first child is <strong>, or an <hr> separator
    if (el.tagName === 'HR') {
      finalizeQ();
      return;
    }

    const isQuestion = (
      el.tagName === 'P'
      && el.querySelector('strong')
      && el.textContent.trim() === el.querySelector('strong')?.textContent.trim()
    );

    if (isQuestion) {
      finalizeQ();
      currentQ = el.querySelector('strong').textContent.trim();
      currentAnswer = document.createElement('div');
    } else if (currentAnswer) {
      currentAnswer.append(el.cloneNode(true));
    }
  });

  finalizeQ();

  // Keyboard: toggle details on Enter/Space on summary
  section.querySelectorAll('details').forEach((d) => {
    d.querySelector('summary')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        d.open = !d.open;
      }
    });
  });

  return section;
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Row 0: nav heading
  const navHeadingCell = rows[0]?.firstElementChild;
  const navHeading = navHeadingCell?.textContent.trim() || 'On this page';

  // Rows 1+: category groups
  const categories = rows.slice(1).map((row) => {
    const cells = [...row.children];
    const title = cells[0]?.textContent.trim() || '';
    const contentCell = cells[1];
    return { title, slug: slugify(title), contentCell };
  }).filter((c) => c.title && c.contentCell);

  // Build nav
  const nav = document.createElement('aside');
  nav.className = 'cat-nav';

  const navEyebrow = document.createElement('p');
  navEyebrow.className = 'eyebrow';
  navEyebrow.textContent = navHeading;
  nav.append(navEyebrow);

  const ol = document.createElement('ol');
  categories.forEach(({ title, slug }) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${slug}`;
    a.textContent = title;
    li.append(a);
    ol.append(li);
  });
  nav.append(ol);

  // Build Q&A sections
  const content = document.createElement('div');
  content.className = 'faq-content';
  categories.forEach(({ title, slug, contentCell }) => {
    content.append(buildQASection(slug, title, contentCell));
  });

  const inner = document.createElement('div');
  inner.className = 'faq-accordion-inner';
  inner.append(nav, content);

  block.replaceChildren(inner);
}
