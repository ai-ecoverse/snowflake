/**
 * faq-accordion — Native <details> FAQ accordion.
 * Authoring rows:
 *   1: Section heading
 *   2+: FAQ rows — Cell 1=question, Cell 2=answer
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const fragments = [];

  // Row 1 — heading
  if (rows[0]) {
    const heading = document.createElement('h2');
    heading.textContent = rows[0].firstElementChild?.textContent.trim() ?? '';
    fragments.push(heading);
  }

  const faqList = document.createElement('div');
  faqList.className = 'faq-list';

  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    const question = cells[0]?.textContent.trim() ?? '';
    const answer = cells[1]?.textContent.trim() ?? '';

    const details = document.createElement('details');

    const summary = document.createElement('summary');
    summary.textContent = question;

    const answerEl = document.createElement('div');
    answerEl.className = 'faq-answer';
    answerEl.textContent = answer;

    details.append(summary, answerEl);
    faqList.append(details);
  });

  fragments.push(faqList);
  block.replaceChildren(...fragments);
}
