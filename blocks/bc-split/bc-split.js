export default async function decorate(block) {
  const rows = [...block.children];

  // Groups of 5 rows each:
  // Row 1: picture (image)
  // Row 2: h2 title
  // Row 3: body text
  // Row 4: bullets (pipe-separated or newline)
  // Row 5: CTA link
  // Alternate sides: first group image-left, second image-right, etc.

  const inner = document.createElement('div');
  inner.className = 'bc-split__inner';

  const GROUP_SIZE = 5;

  for (let g = 0; g < rows.length; g += GROUP_SIZE) {
    const group = rows.slice(g, g + GROUP_SIZE);
    if (!group.length) break;

    const row = document.createElement('div');
    row.className = 'bc-split__row';
    const groupIdx = Math.floor(g / GROUP_SIZE);
    if (groupIdx % 2 !== 0) row.classList.add('bc-split__row--right');

    // Media
    const img = group[0]?.querySelector('img');
    const media = document.createElement('div');
    media.className = 'bc-split__media';
    if (img) media.appendChild(img.cloneNode(true));
    row.appendChild(media);

    // Copy
    const copy = document.createElement('div');
    copy.className = 'bc-split__copy';

    // Title
    const h2El = group[1]?.querySelector('h2');
    const titleText = h2El ? h2El.innerHTML : (group[1]?.querySelector('div')?.textContent?.trim() || '');
    const title = document.createElement('h2');
    title.className = 'bc-split__title';
    title.innerHTML = titleText;
    copy.appendChild(title);

    // Body
    const bodyText = group[2]?.querySelector('div')?.textContent?.trim() || '';
    if (bodyText) {
      const body = document.createElement('p');
      body.className = 'bc-split__body';
      body.textContent = bodyText;
      copy.appendChild(body);
    }

    // Bullets
    if (group[3]) {
      const bulletCell = group[3].querySelector('div') || group[3];
      const bulletContent = bulletCell.innerHTML;
      // Parse: pipe-separated or list items or line breaks
      let bulletItems = [];
      const liEls = bulletCell.querySelectorAll('li');
      if (liEls.length) {
        liEls.forEach((li) => bulletItems.push(li.textContent.trim()));
      } else {
        const raw = bulletCell.textContent.trim();
        bulletItems = raw.split(/\||\n/).map((s) => s.trim()).filter(Boolean);
      }

      if (bulletItems.length) {
        const ul = document.createElement('ul');
        ul.className = 'bc-split__bullets';
        bulletItems.forEach((item) => {
          const li = document.createElement('li');
          li.className = 'bc-split__bullet';
          li.textContent = item;
          ul.appendChild(li);
        });
        copy.appendChild(ul);
      }
    }

    // CTA
    if (group[4]) {
      const ctaEl = group[4].querySelector('a');
      if (ctaEl) {
        const cta = document.createElement('a');
        cta.className = 'bc-split__cta';
        cta.href = ctaEl.href;
        cta.textContent = ctaEl.textContent.trim();
        copy.appendChild(cta);
      }
    }

    row.appendChild(copy);
    inner.appendChild(row);
  }

  block.innerHTML = '';
  block.appendChild(inner);
}
