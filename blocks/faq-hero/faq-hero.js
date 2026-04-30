import { el, rows, cells, resetBlock } from '../../scripts/utils/dom.js';

export default async function decorate(block) {
  const allRows = rows(block);

  const eyebrowText = cells(allRows[0])?.[0]?.textContent.trim() ?? '';
  const headlineHTML = cells(allRows[1])?.[0]?.innerHTML ?? '';
  const subHTML = cells(allRows[2])?.[0]?.innerHTML ?? '';

  resetBlock(block, 'faq-hero');

  const inner = el('div', { class: 'faq-hero-inner' },
    el('p', { class: 'eyebrow' }, eyebrowText),
    ...parseInto('h1', headlineHTML),
    ...parseInto('p', subHTML, 'sub'),
  );

  block.append(inner);
}

/**
 * Wrap an innerHTML string in a new element, returning [element].
 * @param {string} tag
 * @param {string} html
 * @param {string} [cls]
 * @returns {HTMLElement[]}
 */
function parseInto(tag, html, cls) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  node.innerHTML = html;
  return [node];
}
