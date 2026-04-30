/**
 * Mission block
 * Authoring rows (positional):
 *   1. eyebrow
 *   2. blockquote text
 *   3. body paragraph
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const eyebrowText = rows[0]?.querySelector('p, div')?.textContent?.trim() ?? '';
  const quoteText = rows[1]?.querySelector('p, div')?.textContent?.trim() ?? '';
  const bodyText = rows[2]?.querySelector('p, div')?.textContent?.trim() ?? '';

  const inner = document.createElement('div');
  inner.className = 'mission-inner';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = eyebrowText;

  const blockquote = document.createElement('blockquote');
  blockquote.textContent = quoteText;

  const body = document.createElement('p');
  body.className = 'body';
  body.textContent = bodyText;

  inner.append(eyebrow, blockquote, body);
  block.replaceChildren(inner);
}
