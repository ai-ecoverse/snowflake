/**
 * hero-video — Full-bleed video hero with poster image, overlay, and play button.
 * Authoring rows:
 *   1: Poster image (picture element)
 *   2: h2 headline
 *   3: Video duration / label text e.g. "Watch — 3:42"
 */
export default async function decorate(block) {
  const rows = [...block.children];

  // Poster image
  const picture = rows[0]?.querySelector('picture, img');
  if (picture) {
    const img = picture.tagName === 'IMG' ? picture : picture.querySelector('img');
    if (img) img.classList.add('hero-video-poster');
    if (picture.tagName === 'PICTURE') picture.classList.add('hero-video-poster');
  }

  // Overlay
  const overlay = document.createElement('div');
  overlay.className = 'hero-video-overlay';
  overlay.setAttribute('aria-hidden', 'true');

  // Headline
  const h2 = document.createElement('h2');
  h2.textContent = rows[1]?.firstElementChild?.textContent.trim() ?? '';

  // Play button
  const playBtn = document.createElement('button');
  playBtn.className = 'hero-video-play';
  playBtn.setAttribute('aria-label', 'Play video');
  playBtn.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>`;

  // Duration label
  const duration = document.createElement('span');
  duration.className = 'hero-video-duration';
  duration.textContent = rows[2]?.firstElementChild?.textContent.trim() ?? '';

  const playRow = document.createElement('div');
  playRow.className = 'hero-video-play-row';
  playRow.append(playBtn, duration);

  // Content container
  const content = document.createElement('div');
  content.className = 'hero-video-content';
  content.append(h2, playRow);

  // Wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'hero-video';
  if (picture) wrapper.append(picture);
  wrapper.append(overlay, content);

  block.replaceChildren(wrapper);
}
