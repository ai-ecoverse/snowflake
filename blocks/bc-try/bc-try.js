export default async function decorate(block) {
  const rows = [...block.children];

  // Row 1 = h2 title, Row 2 = subtext, Rows 3+ = chip text items
  const titleEl = rows[0]?.querySelector('h2');
  const titleText = titleEl ? titleEl.innerHTML : (rows[0]?.querySelector('div')?.textContent?.trim() || '');
  const subText = rows[1]?.querySelector('div')?.textContent?.trim() || '';

  const chips = [];
  for (let i = 2; i < rows.length; i += 1) {
    const cells = [...rows[i].querySelectorAll(':scope > div')];
    cells.forEach((cell) => {
      const text = cell.textContent.trim();
      if (text) chips.push(text);
    });
  }

  const inner = document.createElement('div');
  inner.className = 'bc-try__inner';

  const title = document.createElement('h2');
  title.className = 'bc-try__title';
  title.innerHTML = titleText;
  inner.appendChild(title);

  const sub = document.createElement('p');
  sub.className = 'bc-try__sub';
  sub.textContent = subText;
  inner.appendChild(sub);

  if (chips.length) {
    const chipsEl = document.createElement('div');
    chipsEl.className = 'bc-try__chips';
    chips.forEach((chipText) => {
      const chip = document.createElement('button');
      chip.className = 'bc-try__chip';
      chip.textContent = chipText;
      chip.type = 'button';
      chip.addEventListener('click', () => {
        const input = inner.querySelector('.bc-try__bar input');
        if (input) {
          input.value = chipText;
          input.focus();
        }
      });
      chipsEl.appendChild(chip);
    });
    inner.appendChild(chipsEl);
  }

  // Search bar
  const bar = document.createElement('div');
  bar.className = 'bc-try__bar';
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Ask Brand Concierge anything…';
  input.setAttribute('aria-label', 'Ask Brand Concierge');
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Submit');
  btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
  bar.appendChild(input);
  bar.appendChild(btn);
  inner.appendChild(bar);

  block.innerHTML = '';
  block.appendChild(inner);
}
