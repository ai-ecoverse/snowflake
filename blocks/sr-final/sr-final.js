export default async function decorate(block) {
  const rows = [...block.children];

  // Row 1 = h2, Row 2 = body, Row 3 = CTA
  const titleEl = rows[0]?.querySelector('h2');
  const bodyEl = rows[1]?.querySelector('div');
  const ctaEl = rows[2]?.querySelector('div');

  const title = document.createElement('h2');
  title.className = 'sr-final__title';
  title.innerHTML = titleEl ? titleEl.innerHTML : (rows[0]?.querySelector('div')?.textContent?.trim() || '');

  const body = document.createElement('p');
  body.className = 'sr-final__body';
  body.textContent = bodyEl?.textContent?.trim() || '';

  const actions = document.createElement('div');
  actions.className = 'sr-final__actions';
  if (ctaEl) {
    [...ctaEl.childNodes].forEach((node) => actions.appendChild(node.cloneNode(true)));
  }

  block.innerHTML = '';
  block.appendChild(title);
  block.appendChild(body);
  block.appendChild(actions);
}
