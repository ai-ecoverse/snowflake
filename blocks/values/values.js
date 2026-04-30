/**
 * Values block
 * Authoring rows (positional):
 *   1. eyebrow
 *   2. h2
 *   3. intro paragraph
 *   4+. Value rows — 2 cells each: [number | heading + description text]
 *       Cell 1: number label (e.g. "01")
 *       Cell 2: "heading — description" or heading text in first p, description in second p
 *               OR single cell text in format "Heading — Description"
 */
export default async function decorate(block) {
  const rows = [...block.children];

  // Head rows
  const eyebrowText = rows[0]?.querySelector('p, div')?.textContent?.trim() ?? '';
  const headlineText = rows[1]?.querySelector('p, div, h2')?.textContent?.trim() ?? '';
  const introText = rows[2]?.querySelector('p, div')?.textContent?.trim() ?? '';

  // Build header
  const header = document.createElement('div');
  header.className = 'values-header';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = eyebrowText;

  const h2 = document.createElement('h2');
  h2.textContent = headlineText;

  const intro = document.createElement('p');
  intro.className = 'intro';
  intro.textContent = introText;

  header.append(eyebrow, h2, intro);

  // Build values grid
  const grid = document.createElement('div');
  grid.className = 'values-grid';

  const valueRows = rows.slice(3);
  valueRows.forEach((row) => {
    const cells = [...row.children];
    const numText = cells[0]?.textContent?.trim() ?? '';
    const contentCell = cells[1];

    // Try to extract heading and description from content cell
    const paras = contentCell ? [...contentCell.querySelectorAll('p')] : [];
    let headingText = '';
    let descText = '';

    if (paras.length >= 2) {
      headingText = paras[0].textContent.trim();
      descText = paras.slice(1).map((p) => p.textContent.trim()).join(' ');
    } else if (paras.length === 1) {
      // Try splitting on em-dash or regular dash
      const raw = paras[0].textContent.trim();
      const separatorMatch = raw.match(/^([^—–-]+?)\s*[—–]\s*(.+)$/s);
      if (separatorMatch) {
        headingText = separatorMatch[1].trim();
        descText = separatorMatch[2].trim();
      } else {
        headingText = raw;
      }
    } else {
      // Fallback: use cell text directly
      const raw = contentCell?.textContent?.trim() ?? '';
      const separatorMatch = raw.match(/^([^—–-]+?)\s*[—–]\s*(.+)$/s);
      if (separatorMatch) {
        headingText = separatorMatch[1].trim();
        descText = separatorMatch[2].trim();
      } else {
        headingText = raw;
      }
    }

    const card = document.createElement('div');
    card.className = 'value';

    const numEl = document.createElement('span');
    numEl.className = 'num';
    numEl.textContent = numText;

    const h3 = document.createElement('h3');
    h3.textContent = headingText;

    const p = document.createElement('p');
    p.textContent = descText;

    card.append(numEl, h3, p);
    grid.append(card);
  });

  // Assemble
  const wrapper = document.createElement('div');
  wrapper.className = 'values-inner';
  wrapper.append(header, grid);

  block.replaceChildren(wrapper);
}
