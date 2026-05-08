/**
 * publication-banner — compact publication masthead with brass accent
 *
 * Authoring rows (positional):
 *   1. Publication name (text)
 *   2. Tagline (text)
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const name = rows[0]?.firstElementChild?.textContent?.trim() || '';
  const tagline = rows[1]?.firstElementChild?.textContent?.trim() || '';

  const inner = document.createElement('div');
  inner.className = 'pub-inner ds-container';

  const nameEl = document.createElement('p');
  nameEl.className = 'pub-name';
  nameEl.textContent = name;

  const taglineEl = document.createElement('p');
  taglineEl.className = 'pub-tagline';
  taglineEl.textContent = tagline;

  inner.append(nameEl, taglineEl);
  block.replaceChildren(inner);
}
