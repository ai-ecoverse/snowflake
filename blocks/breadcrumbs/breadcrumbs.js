/**
 * breadcrumbs — Accessible breadcrumb trail from authoring rows.
 * Authoring rows:
 *   Each row = one crumb: Cell 1 = label, Cell 2 = URL
 *   Last row has no URL (or empty URL) — treated as current page.
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');

  const ol = document.createElement('ol');
  ol.className = 'breadcrumbs-list';

  rows.forEach((row, i) => {
    const cells = [...row.children];
    const label = cells[0]?.textContent.trim() ?? '';
    const url = cells[1]?.textContent.trim() ?? '';
    const isLast = i === rows.length - 1;

    const li = document.createElement('li');

    if (!isLast && url) {
      const a = document.createElement('a');
      a.href = url;
      a.textContent = label;
      li.append(a);

      const sep = document.createElement('span');
      sep.className = 'sep';
      sep.setAttribute('aria-hidden', 'true');
      sep.textContent = '/';
      li.append(sep);
    } else {
      const current = document.createElement('span');
      current.setAttribute('aria-current', 'page');
      current.textContent = label;
      li.append(current);
    }

    ol.append(li);
  });

  nav.append(ol);
  block.replaceChildren(nav);
}
