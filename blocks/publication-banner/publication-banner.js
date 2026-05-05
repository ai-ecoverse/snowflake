/**
 * Publication Banner block — compact ink-deep masthead band.
 * Authoring: 1 row, 2 cells.
 *   Cell 0: publication name
 *   Cell 1: tagline
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const cells = rows[0] ? [...rows[0].querySelectorAll(':scope > div')] : [];

  const name = cells[0]?.textContent.trim() || '';
  const tagline = cells[1]?.textContent.trim() || '';

  block.innerHTML = '';

  const inner = document.createElement('div');
  inner.className = 'ds-container';

  const np = document.createElement('p');
  np.className = 'ds-banner-name';
  np.id = 'banner-name';
  np.textContent = name;
  inner.append(np);

  if (tagline) {
    const tp = document.createElement('p');
    tp.className = 'ds-banner-tagline';
    tp.textContent = tagline;
    inner.append(tp);
  }

  block.append(inner);
}
