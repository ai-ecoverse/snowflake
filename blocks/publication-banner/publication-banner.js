export default async function decorate(block) {
  const rows = [...block.children];

  // Row 0: site name
  // Row 1: tagline
  const nameEl = rows[0]?.querySelector('div');
  const taglineEl = rows[1]?.querySelector('div');

  const inner = document.createElement('div');
  inner.className = 'publication-banner-inner';

  if (nameEl) {
    const name = document.createElement('p');
    name.className = 'publication-banner-name';
    name.textContent = nameEl.textContent.trim();
    inner.append(name);
  }

  if (taglineEl) {
    const tagline = document.createElement('p');
    tagline.className = 'publication-banner-tagline';
    tagline.textContent = taglineEl.textContent.trim();
    inner.append(tagline);
  }

  block.innerHTML = '';
  block.append(inner);
}
