/**
 * library-index — Navigation grid showing 5 tiers with block IDs, names, and status badges.
 * Authoring rows:
 *   Each row = one tier column.
 *   Cell 1: Tier heading text
 *   Cell 2: Comma-separated entries in format "ID:name:status" e.g. "C1:header:built,C2:footer:built"
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const grid = document.createElement('div');
  grid.className = 'library-index-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    const tierName = cells[0]?.textContent.trim() ?? '';
    const entriesRaw = cells[1]?.textContent.trim() ?? '';

    const col = document.createElement('div');
    col.className = 'library-index-tier';

    const heading = document.createElement('h2');
    heading.textContent = tierName;
    col.append(heading);

    const ul = document.createElement('ul');
    if (entriesRaw) {
      entriesRaw.split(',').forEach((entry) => {
        const parts = entry.trim().split(':');
        const id = parts[0]?.trim() ?? '';
        const name = parts[1]?.trim() ?? '';
        const status = parts[2]?.trim() ?? '';

        const li = document.createElement('li');

        const idSpan = document.createElement('span');
        idSpan.className = 'lib-id';
        idSpan.textContent = id;

        const a = document.createElement('a');
        a.href = `#${id.toLowerCase()}`;
        a.textContent = name;

        const statusSpan = document.createElement('span');
        statusSpan.className = 'lib-status';
        statusSpan.textContent = status;

        li.append(idSpan, a, statusSpan);
        ul.append(li);
      });
    }

    col.append(ul);
    grid.append(col);
  });

  block.replaceChildren(grid);
}
