/**
 * page-main block
 *
 * Authoring shape:
 *   Row 0..N — prose content (paragraphs, headings, lists, links)
 *
 * Rebuilds all row cells into a single .body-content wrapper
 * inside .page-main-inner.
 */

export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Collect all cell content into a single .body-content div
  const bodyContent = document.createElement('div');
  bodyContent.className = 'body-content';

  rows.forEach((row) => {
    const cells = row.querySelectorAll(':scope > div');
    cells.forEach((cell) => {
      // Clone each child node from the cell into body-content
      [...cell.childNodes].forEach((node) => {
        bodyContent.appendChild(node.cloneNode(true));
      });
    });
  });

  // Wrap in .page-main-inner
  const inner = document.createElement('div');
  inner.className = 'page-main-inner';
  inner.appendChild(bodyContent);

  // Rebuild block DOM
  block.innerHTML = '';
  block.appendChild(inner);
}
