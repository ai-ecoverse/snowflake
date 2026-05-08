export default async function decorate(block) {
  const rows = [...block.children];

  // Row 1 = h2 text
  const h2El = rows[0]?.querySelector('h2');
  const titleText = h2El ? h2El.innerHTML : (rows[0]?.querySelector('div')?.textContent?.trim() || '');

  const title = document.createElement('h2');
  title.className = 'bc-intro__title';
  title.innerHTML = titleText;

  block.innerHTML = '';
  block.appendChild(title);
}
