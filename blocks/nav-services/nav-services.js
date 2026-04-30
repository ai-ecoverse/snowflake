/**
 * Nav Services block
 * Authoring rows (positional):
 *   1. h2 (head left)
 *   2. intro paragraph (head right)
 *   3+. Service item rows — 3 cells each: [category label | heading | description]
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const headingText = rows[0]?.querySelector('p, div, h2')?.textContent?.trim() ?? '';
  const introText = rows[1]?.querySelector('p, div')?.textContent?.trim() ?? '';

  // Build head
  const head = document.createElement('div');
  head.className = 'ns-head';

  const h2 = document.createElement('h2');
  h2.textContent = headingText;

  const intro = document.createElement('p');
  intro.textContent = introText;

  head.append(h2, intro);

  // Build service list from rows 2+
  const list = document.createElement('div');
  list.className = 'ns-list';

  rows.slice(2).forEach((row) => {
    const cells = [...row.children];
    const category = cells[0]?.textContent?.trim() ?? '';
    const heading = cells[1]?.textContent?.trim() ?? '';
    const desc = cells[2]?.textContent?.trim() ?? '';

    const item = document.createElement('div');
    item.className = 'ns-item';

    const cat = document.createElement('p');
    cat.className = 'c';
    cat.textContent = category;

    const h4 = document.createElement('h4');
    h4.textContent = heading;

    const p = document.createElement('p');
    p.textContent = desc;

    item.append(cat, h4, p);
    list.append(item);
  });

  block.replaceChildren(head, list);
}
