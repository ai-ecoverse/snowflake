/**
 * bc-final-cta — Dark closing CTA with media.
 *
 * Authoring rows (positional):
 *   1. h2 title
 *   2. CTA links (wrap primary in <strong><a>, secondary in <em><a>)
 *   3. Background image (picture)
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const titleEl = rows[0]?.querySelector('h2, div');
  const ctasCell = rows[1]?.querySelector('div');
  const mediaCell = rows[2]?.querySelector('div');

  const copy = document.createElement('div');
  copy.className = 'bc-final-cta__copy';

  const title = document.createElement('h2');
  title.className = 'bc-final-cta__title';
  const h2 = titleEl?.querySelector('h2');
  title.textContent = h2 ? h2.textContent.trim() : (titleEl?.textContent?.trim() || '');
  copy.appendChild(title);

  if (ctasCell) {
    const actions = document.createElement('div');
    actions.className = 'bc-final-cta__actions';
    [...ctasCell.childNodes].forEach((n) => actions.appendChild(n.cloneNode(true)));
    copy.appendChild(actions);
  }

  const inner = document.createElement('div');
  inner.className = 'bc-final-cta__inner';
  inner.appendChild(copy);

  const pic = mediaCell?.querySelector('picture, img');
  if (pic) {
    const media = document.createElement('div');
    media.className = 'bc-final-cta__media';
    media.appendChild(pic.cloneNode(true));
    inner.appendChild(media);
  }

  block.innerHTML = '';
  block.appendChild(inner);
}
