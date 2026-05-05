/**
 * Utility Strip block — thin attribution bar.
 * Authoring: 1 row, 2 cells.
 *   Cell 0: left text (producer / sponsor attribution)
 *   Cell 1: right text (publication descriptor)
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const cells = rows[0] ? [...rows[0].querySelectorAll(':scope > div')] : [];

  const left = cells[0]?.textContent.trim() || '';
  const right = cells[1]?.textContent.trim() || '';

  block.innerHTML = '';

  const inner = document.createElement('div');
  inner.className = 'ds-container';

  const lp = document.createElement('p');
  lp.textContent = left;
  inner.append(lp);

  if (right) {
    const rp = document.createElement('p');
    rp.textContent = right;
    inner.append(rp);
  }

  block.append(inner);
}
