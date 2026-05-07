/**
 * Reels block — Watch & Learn: featured iframe + sidebar playlist
 *
 * Authoring shape:
 *   Row 1: eyebrow | h2 title | playlist link text | playlist URL
 *   Row 2+: individual reels
 *     Cell 1: YouTube video ID
 *     Cell 2: eyebrow label | title (two <p> elements, or pipe-separated)
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Row 1 — section header
  const headerCells = [...rows[0].children];
  const eyebrowText = headerCells[0]?.textContent?.trim() || 'Reels';
  const headingText = headerCells[1]?.textContent?.trim() || 'Watch & learn';
  const playlistLinkText = headerCells[2]?.textContent?.trim() || 'Open playlist on YouTube →';
  const playlistURL = headerCells[3]?.textContent?.trim()
    || headerCells[3]?.querySelector('a')?.href
    || '';

  // Derive playlist ID from URL or use as-is if it's already an ID
  const playlistId = playlistURL.includes('list=')
    ? new URLSearchParams(playlistURL.split('?')[1] || '').get('list') || playlistURL
    : playlistURL;

  // Rows 2+ — reel entries
  const reelRows = rows.slice(1);

  const inner = document.createElement('div');
  inner.className = 'reels-inner';

  // Section head
  const sectionHead = document.createElement('div');
  sectionHead.className = 'section-head';

  const headLeft = document.createElement('div');
  headLeft.innerHTML = `
    <span class="ds-eyebrow ds-eyebrow--brass-deep">${eyebrowText}</span>
    <h2>${headingText}</h2>
  `;

  const playlistLink = document.createElement('a');
  playlistLink.className = 'ds-link-arrow';
  playlistLink.href = playlistId
    ? `https://www.youtube.com/playlist?list=${playlistId}`
    : '#';
  playlistLink.rel = 'noopener';
  playlistLink.target = '_blank';
  playlistLink.textContent = playlistLinkText;

  sectionHead.append(headLeft, playlistLink);
  inner.append(sectionHead);

  // Grid
  const grid = document.createElement('div');
  grid.className = 'reels-grid';

  // Featured iframe (first reel)
  const firstReel = reelRows[0];
  const firstCells = firstReel ? [...firstReel.children] : [];
  const firstVideoId = firstCells[0]?.textContent?.trim() || '';

  const featured = document.createElement('div');
  featured.className = 'reels-featured';

  if (firstVideoId) {
    const iframe = document.createElement('iframe');
    iframe.id = 'reels-iframe';
    iframe.className = 'reels-player';
    iframe.src = `https://www.youtube.com/embed/${firstVideoId}${playlistId ? `?list=${playlistId}&` : '?'}rel=0&modestbranding=1`;
    iframe.title = 'Enterprise Tech Provider video playlist';
    iframe.setAttribute('frameborder', '0');
    iframe.allow = 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    featured.append(iframe);
  }

  // Sidebar
  const side = document.createElement('div');
  side.className = 'reels-side';
  side.id = 'reels-list';
  side.setAttribute('aria-label', 'Playlist videos');

  reelRows.forEach((row, idx) => {
    const cells = [...row.children];
    const videoId = cells[0]?.textContent?.trim() || '';
    const bodyCell = cells[1];
    const bodyParas = bodyCell ? [...bodyCell.querySelectorAll('p')] : [];
    const reelEyebrow = bodyParas[0]?.textContent?.trim()
      || (bodyCell?.textContent?.split('|')[0]?.trim()) || '';
    const reelTitle = bodyParas[1]?.textContent?.trim()
      || (bodyCell?.textContent?.split('|')[1]?.trim()) || '';

    if (!videoId) return;

    const item = document.createElement('a');
    item.className = `reel-item${idx === 0 ? ' is-active' : ''}`;
    item.href = `https://www.youtube.com/watch?v=${videoId}${playlistId ? `&list=${playlistId}` : ''}`;
    item.rel = 'noopener';
    item.target = '_blank';
    item.dataset.videoId = videoId;

    item.innerHTML = `
      <span class="reel-thumb">
        <img src="https://i.ytimg.com/vi/${videoId}/mqdefault.jpg" alt="" loading="lazy" width="120" height="68">
        <span class="reel-play" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="currentColor"><path d="M5 3l8 5-8 5z"/></svg>
        </span>
      </span>
      <span class="reel-meta">
        <span class="reel-eyebrow">${reelEyebrow}</span>
        <span class="reel-title">${reelTitle}</span>
      </span>
    `;

    side.append(item);
  });

  grid.append(featured, side);
  inner.append(grid);
  block.innerHTML = '';
  block.append(inner);

  // Click to swap iframe
  const iframeEl = block.querySelector('#reels-iframe');
  const listEl = block.querySelector('#reels-list');
  if (iframeEl && listEl) {
    listEl.addEventListener('click', (e) => {
      const a = e.target.closest('[data-video-id]');
      if (!a) return;
      e.preventDefault();
      const id = a.dataset.videoId;
      iframeEl.src = `https://www.youtube.com/embed/${id}${playlistId ? `?list=${playlistId}&` : '?'}rel=0&modestbranding=1&autoplay=1`;
      [...listEl.querySelectorAll('.reel-item')].forEach((el) =>
        el.classList.remove('is-active')
      );
      a.classList.add('is-active');
    });
  }
}
