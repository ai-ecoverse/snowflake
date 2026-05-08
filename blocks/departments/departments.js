/**
 * departments — "Three reads from each topic" multi-column text list
 *
 * Section head row (row 0):
 *   Cell 1: eyebrow
 *   Cell 2: h2
 *
 * Department group rows: one row per department column.
 * Each row cells:
 *   Cell 1: label letter (A, B, C …)
 *   Cell 2: department name
 *   Cell 3: label variant class (datacenter | ai | workplace | neutral — maps to dept-label--)
 *   Cell 4…N: article items, each cell contains two children: article URL | title text
 *             (or a single <a> element with href + text content)
 *
 * Simpler authoring shortcut: each article cell can just be a plain <a href="...">Title</a>
 */

function text(cell) { return cell ? cell.textContent.trim() : ''; }

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'ds-container';

  // Head
  const cells0 = [...(rows[0]?.children || [])];
  const head = document.createElement('div');
  head.className = 'ds-section-head';
  const headLeft = document.createElement('div');
  headLeft.innerHTML = `<span class="ds-eyebrow">${text(cells0[0])}</span><h2>${text(cells0[1])}</h2>`;
  head.append(headLeft);
  wrapper.append(head);

  // Grid
  const grid = document.createElement('div');
  grid.className = 'dept-grid';

  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    const letter = text(cells[0]);
    const deptName = text(cells[1]);
    const variant = text(cells[2]) || '';

    const col = document.createElement('div');
    col.className = 'dept-col';

    // Label
    const label = document.createElement('span');
    label.className = `dept-label${variant ? ` dept-label--${variant}` : ''}`;
    label.innerHTML = `<span class="dept-label-num">${letter}</span> ${deptName}`;
    col.append(label);

    // Articles
    const ul = document.createElement('ul');
    ul.className = 'dept-list';

    cells.slice(3).forEach((cell) => {
      // Cell may contain an <a> directly, or two lines: URL + title
      const a = cell.querySelector('a');
      const href = a ? a.href : (text(cells[0]) || '#');
      const title = a ? a.textContent.trim() : text(cell);
      if (!title) return;

      const li = document.createElement('li');
      li.className = 'dept-item';

      const h3 = document.createElement('h3');
      const link = document.createElement('a');
      link.href = a ? a.getAttribute('href') : href;
      link.textContent = title;
      h3.append(link);
      li.append(h3);
      ul.append(li);
    });

    col.append(ul);
    grid.append(col);
  });

  wrapper.append(grid);
  block.replaceChildren(wrapper);
}
