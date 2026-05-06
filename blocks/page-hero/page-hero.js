/**
 * page-hero block
 *
 * Authoring shape (rows):
 *   Row 0 — background image (<picture> or <img>)
 *   Row 1 — eyebrow text
 *   Row 2 — <h1> headline
 */

export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Extract content from each row's first cell
  const [imgRow, eyebrowRow, headingRow] = rows;

  // --- Build hero art (background) ---
  const art = document.createElement('div');
  art.className = 'hero-art';
  art.setAttribute('role', 'img');

  if (imgRow) {
    const imgCell = imgRow.querySelector(':scope > div');
    const picture = imgCell && imgCell.querySelector('picture');
    const img = imgCell && imgCell.querySelector('img');

    if (picture) {
      // Use <picture> directly inside art for responsive background
      const clonedPicture = picture.cloneNode(true);
      art.appendChild(clonedPicture);
      if (img) art.setAttribute('aria-label', img.alt || 'Hero image');
    } else if (img) {
      const clonedImg = img.cloneNode(true);
      art.appendChild(clonedImg);
      art.setAttribute('aria-label', img.alt || 'Hero image');
    }
  }

  // --- Build hero copy ---
  const copy = document.createElement('div');
  copy.className = 'hero-copy';

  if (eyebrowRow) {
    const eyebrowCell = eyebrowRow.querySelector(':scope > div');
    if (eyebrowCell) {
      const eyebrow = document.createElement('p');
      eyebrow.className = 'eyebrow';
      eyebrow.textContent = eyebrowCell.textContent.trim();
      copy.appendChild(eyebrow);
    }
  }

  if (headingRow) {
    const headingCell = headingRow.querySelector(':scope > div');
    if (headingCell) {
      const h1 = headingCell.querySelector('h1');
      if (h1) {
        copy.appendChild(h1.cloneNode(true));
      } else {
        // Promote plain text to h1
        const h = document.createElement('h1');
        h.textContent = headingCell.textContent.trim();
        copy.appendChild(h);
      }
    }
  }

  // --- Rebuild block DOM ---
  block.innerHTML = '';
  block.appendChild(art);
  block.appendChild(copy);

  // Mark as has-image when art has content
  if (art.querySelector('picture, img')) {
    block.classList.add('has-image');
  }
}
