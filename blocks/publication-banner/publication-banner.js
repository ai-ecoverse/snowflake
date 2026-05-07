/**
 * Publication Banner block
 *
 * Authoring shape (positional rows):
 *   Row 1: publication name (p or h1)
 *   Row 2: tagline text
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const nameText = rows[0]?.querySelector('div')?.textContent?.trim() ?? '';
  const taglineText = rows[1]?.querySelector('div')?.textContent?.trim() ?? '';

  block.innerHTML = '';

  const inner = document.createElement('div');
  inner.className = 'banner-inner';

  const name = document.createElement('p');
  name.className = 'banner-name';
  name.textContent = nameText;

  const tagline = document.createElement('p');
  tagline.className = 'banner-tagline';
  tagline.textContent = taglineText;

  inner.append(name, tagline);
  block.append(inner);
}
