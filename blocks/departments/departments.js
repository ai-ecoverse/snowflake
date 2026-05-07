/**
 * Departments block — 3-column grid of topic departments
 *
 * Authoring shape:
 *   Row 1: section eyebrow | section h2
 *   Row 2+: department groups
 *     Cell 1: dept label text (format: "LETTER | Department Name | modifier" where modifier is ai/workplace/neutral, optional)
 *             OR multiple <p> elements: p[0]=letter, p[1]=name, p[2]=modifier
 *     Cell 2: article title 1 (with <a href>)
 *     Cell 3: article title 2 (with <a href>)
 *     Cell 4: article title 3 (with <a href>)
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Row 1 — section header
  const headerCells = [...rows[0].children];
  const eyebrowText = headerCells[0]?.textContent?.trim() || 'Inside each section';
  const headingText = headerCells[1]?.textContent?.trim() || 'Three reads from each topic';

  const inner = document.createElement('div');
  inner.className = 'departments-inner';

  const sectionHead = document.createElement('div');
  sectionHead.className = 'section-head';
  sectionHead.innerHTML = `
    <div>
      <span class="ds-eyebrow">${eyebrowText}</span>
      <h2>${headingText}</h2>
    </div>
  `;
  inner.append(sectionHead);

  const deptGrid = document.createElement('div');
  deptGrid.className = 'dept-grid';

  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;

    const labelCell = cells[0];
    const articleCells = cells.slice(1);

    // Parse label cell — may be "A | Artificial Intelligence | ai"
    // or paragraphs: p[0]=letter, p[1]=name, p[2]=modifier
    const labelParas = [...(labelCell?.querySelectorAll('p') || [])];
    let labelLetter = '';
    let labelName = '';
    let labelMod = '';

    if (labelParas.length >= 2) {
      labelLetter = labelParas[0]?.textContent?.trim() || '';
      labelName = labelParas[1]?.textContent?.trim() || '';
      labelMod = labelParas[2]?.textContent?.trim() || '';
    } else {
      // Try pipe-separated plain text: "A | Artificial Intelligence | ai"
      const rawLabel = labelCell?.textContent?.trim() || '';
      const parts = rawLabel.split('|').map((p) => p.trim());
      labelLetter = parts[0] || '';
      labelName = parts[1] || '';
      labelMod = parts[2] || '';
    }

    // Build dept column
    const col = document.createElement('div');
    col.className = 'dept-column';

    const label = document.createElement('span');
    const modClass = labelMod ? ` dept-label--${labelMod.toLowerCase()}` : '';
    label.className = `dept-label${modClass}`;

    const letterSpan = document.createElement('span');
    letterSpan.className = 'dept-label-num';
    letterSpan.textContent = labelLetter;

    label.append(letterSpan, ` ${labelName}`);
    col.append(label);

    // Article list
    const list = document.createElement('ul');
    list.className = 'dept-list';

    articleCells.forEach((articleCell) => {
      const a = articleCell.querySelector('a');
      if (!a && !articleCell.textContent.trim()) return;

      const li = document.createElement('li');
      li.className = 'dept-item';

      const h3 = document.createElement('h3');
      const link = document.createElement('a');
      link.href = a?.href || '#';
      link.textContent = a?.textContent?.trim() || articleCell.textContent?.trim() || '';
      h3.append(link);
      li.append(h3);
      list.append(li);
    });

    col.append(list);
    deptGrid.append(col);
  });

  inner.append(deptGrid);
  block.innerHTML = '';
  block.append(inner);
}
