export default async function decorate(block) {
  const rows = [...block.children];

  // Collect text items from rows; bold/strong = accent
  const items = [];
  rows.forEach((row) => {
    const cell = row.querySelector('div') || row;
    const strong = cell.querySelector('strong, b');
    const text = cell.textContent.trim();
    if (text) {
      items.push({ text, accent: !!strong });
    }
  });

  if (!items.length) return;

  // Build track doubled for seamless loop
  const track = document.createElement('div');
  track.className = 'bc-marquee__track';

  const buildItems = () => {
    const fragment = document.createDocumentFragment();
    items.forEach((item, idx) => {
      const el = document.createElement('span');
      el.className = `bc-marquee__item${item.accent ? ' bc-marquee__item--accent' : ''}`;
      el.textContent = item.text;
      fragment.appendChild(el);

      // Separator
      const sep = document.createElement('span');
      sep.className = 'bc-marquee__sep';
      sep.setAttribute('aria-hidden', 'true');
      sep.textContent = '·';
      fragment.appendChild(sep);
    });
    return fragment;
  };

  track.appendChild(buildItems());
  track.appendChild(buildItems());

  block.innerHTML = '';
  block.appendChild(track);
}
