/**
 * tier-header — Section divider with enum label, h2 title, and purpose paragraph.
 * Authoring rows:
 *   1: Enum text e.g. "/ 01"
 *   2: h2 title
 *   3: Purpose paragraph
 *   4: (optional) Surface class override e.g. "surface-dark" or "surface-white"
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const enumText = rows[0]?.firstElementChild?.textContent.trim() ?? '';
  const titleText = rows[1]?.firstElementChild?.textContent.trim() ?? '';
  const purposeText = rows[2]?.firstElementChild?.textContent.trim() ?? '';
  const surfaceClass = rows[3]?.firstElementChild?.textContent.trim() ?? '';

  if (surfaceClass) {
    block.closest('.section')?.classList.add(surfaceClass);
  }

  const enumEl = document.createElement('p');
  enumEl.className = 'tier-header-enum';
  enumEl.textContent = enumText;

  const h2 = document.createElement('h2');
  h2.textContent = titleText;

  const purpose = document.createElement('p');
  purpose.className = 'tier-header-purpose';
  purpose.textContent = purposeText;

  block.replaceChildren(enumEl, h2, purpose);
}
