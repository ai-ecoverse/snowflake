/**
 * bc-faq — FAQ accordion.
 *
 * Authoring rows (positional):
 *   1. h2 section title
 *   2-N. FAQ pairs: cell 1 = question text, cell 2 = answer text
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const inner = document.createElement('div');
  inner.className = 'bc-faq__inner';

  const titleEl = rows[0]?.querySelector('h2, div');
  const heading = document.createElement('h2');
  heading.className = 'bc-faq__title';
  heading.textContent = titleEl?.textContent?.trim() || '';
  inner.appendChild(heading);

  const list = document.createElement('div');
  list.className = 'bc-faq__list';

  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    const question = cells[0]?.textContent?.trim() || '';
    const answer = cells[1]?.textContent?.trim() || '';
    if (!question) return;

    const item = document.createElement('div');
    item.className = 'bc-faq__item';

    const btn = document.createElement('button');
    btn.className = 'bc-faq__question';
    btn.textContent = question;
    btn.setAttribute('aria-expanded', 'false');

    const answerEl = document.createElement('div');
    answerEl.className = 'bc-faq__answer';
    answerEl.setAttribute('aria-hidden', 'true');
    const answerInner = document.createElement('div');
    answerInner.className = 'bc-faq__answer-inner';
    answerInner.textContent = answer;
    answerEl.appendChild(answerInner);

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      // Close all
      list.querySelectorAll('.bc-faq__item.is-open').forEach((openItem) => {
        openItem.classList.remove('is-open');
        openItem.querySelector('.bc-faq__question')?.setAttribute('aria-expanded', 'false');
        openItem.querySelector('.bc-faq__answer')?.setAttribute('aria-hidden', 'true');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        answerEl.setAttribute('aria-hidden', 'false');
      }
    });

    item.appendChild(btn);
    item.appendChild(answerEl);
    list.appendChild(item);
  });

  inner.appendChild(list);
  block.innerHTML = '';
  block.appendChild(inner);
}
