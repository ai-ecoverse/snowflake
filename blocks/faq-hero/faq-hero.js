/**
 * faq-hero — Page hero with eyebrow, h1 headline, and subtitle paragraph.
 *
 * Authoring rows (positional):
 *   1. Eyebrow text
 *   2. h1 headline (use plain text; block wraps in <h1>)
 *   3. Subtitle paragraph text
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const eyebrow = rows[0]?.querySelector('div')?.textContent?.trim() ?? '';
  const headlineCell = rows[1]?.querySelector('div');
  const headlineHTML = headlineCell?.innerHTML?.trim() ?? '';
  const subtitle = rows[2]?.querySelector('div')?.textContent?.trim() ?? '';

  const wrapper = document.createElement('div');
  wrapper.className = 'faq-hero';

  const eyebrowEl = document.createElement('p');
  eyebrowEl.className = 'eyebrow';
  eyebrowEl.textContent = eyebrow;

  const h1 = document.createElement('h1');
  // Support either plain text or an existing <h1> authored in the cell
  if (headlineHTML.toLowerCase().startsWith('<h1')) {
    const tmp = document.createElement('div');
    tmp.innerHTML = headlineHTML;
    const existingH1 = tmp.querySelector('h1');
    h1.innerHTML = existingH1 ? existingH1.innerHTML : headlineHTML;
  } else {
    h1.textContent = headlineCell?.textContent?.trim() ?? '';
  }

  const subEl = document.createElement('p');
  subEl.className = 'sub';
  subEl.textContent = subtitle;

  wrapper.append(eyebrowEl, h1, subEl);

  block.textContent = '';
  block.appendChild(wrapper);
}
