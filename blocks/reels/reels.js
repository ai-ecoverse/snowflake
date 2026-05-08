/**
 * reels — Watch & Learn: YouTube featured player + sidebar playlist
 *
 * Section head row (row 0):
 *   Cell 1: eyebrow
 *   Cell 2: h2
 *   Cell 3: YouTube playlist URL (for "Open playlist" link)
 *
 * Playlist rows (rows 1…N):
 *   Cell 1: YouTube video ID
 *   Cell 2: eyebrow label (e.g. "Now playing", "ETP Ep. 9")
 *   Cell 3: video title
 *
 * The first playlist row is auto-set as active and loaded in the featured player.
 */

function text(cell) { return cell ? cell.textContent.trim() : ''; }

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'ds-container';

  // Head row
  const cells0 = [...(rows[0]?.children || [])];
  const eyebrow = text(cells0[0]);
  const heading = text(cells0[1]);
  const playlistUrl = text(cells0[2]);

  const head = document.createElement('div');
  head.className = 'ds-section-head';
  const headLeft = document.createElement('div');
  headLeft.innerHTML = `<span class="ds-eyebrow ds-eyebrow--brass-deep">${eyebrow}</span><h2>${heading}</h2>`;
  head.append(headLeft);
  if (playlistUrl) {
    const link = document.createElement('a');
    link.className = 'ds-link-arrow';
    link.href = playlistUrl;
    link.rel = 'noopener';
    link.target = '_blank';
    link.textContent = 'Open playlist on YouTube →';
    head.append(link);
  }
  wrapper.append(head);

  // Build playlist items
  const videos = rows.slice(1).map((row) => {
    const cells = [...row.children];
    return {
      id: text(cells[0]),
      eyebrow: text(cells[1]),
      title: text(cells[2]),
    };
  }).filter((v) => v.id);

  if (!videos.length) {
    block.replaceChildren(wrapper);
    return;
  }

  // Extract playlist ID from first URL or use default
  const playlistId = playlistUrl ? new URL(playlistUrl).searchParams.get('list') || '' : '';

  const grid = document.createElement('div');
  grid.className = 'reels-grid';

  // Featured iframe
  const featured = document.createElement('div');
  featured.className = 'reels-featured';
  const iframeId = 'reels-iframe-' + Math.random().toString(36).slice(2, 7);
  const firstId = videos[0].id;
  const srcBase = `https://www.youtube.com/embed/${firstId}?${playlistId ? `list=${playlistId}&` : ''}rel=0&modestbranding=1`;
  featured.innerHTML = `<iframe id="${iframeId}"
    src="${srcBase}"
    title="Enterprise Tech Provider video playlist"
    frameborder="0"
    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
    loading="lazy"></iframe>`;

  // Sidebar
  const side = document.createElement('div');
  side.className = 'reels-side';
  side.setAttribute('aria-label', 'Playlist videos');

  videos.forEach((v, i) => {
    const a = document.createElement('a');
    a.className = 'reel-item' + (i === 0 ? ' is-active' : '');
    a.href = `https://www.youtube.com/watch?v=${v.id}${playlistId ? `&list=${playlistId}` : ''}`;
    a.rel = 'noopener';
    a.target = '_blank';
    a.dataset.videoId = v.id;

    a.innerHTML = `
      <span class="reel-thumb">
        <img src="https://i.ytimg.com/vi/${v.id}/mqdefault.jpg" alt="" loading="lazy" width="120" height="68">
        <span class="reel-play" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="currentColor"><path d="M5 3l8 5-8 5z"/></svg>
        </span>
      </span>
      <span class="reel-meta">
        <span class="reel-eyebrow">${v.eyebrow}</span>
        <span class="reel-title">${v.title}</span>
      </span>`;

    side.append(a);
  });

  grid.append(featured, side);
  wrapper.append(grid);
  block.replaceChildren(wrapper);

  // Click handler: swap iframe src
  side.addEventListener('click', (e) => {
    const a = e.target.closest('[data-video-id]');
    if (!a) return;
    e.preventDefault();
    const id = a.dataset.videoId;
    const iframe = document.getElementById(iframeId);
    if (iframe) {
      iframe.src = `https://www.youtube.com/embed/${id}?${playlistId ? `list=${playlistId}&` : ''}rel=0&modestbranding=1&autoplay=1`;
    }
    side.querySelectorAll('.reel-item').forEach((el) => el.classList.remove('is-active'));
    a.classList.add('is-active');
  });
}
