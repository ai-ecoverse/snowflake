export default async function decorate(block) {
  const rows = [...block.children];

  // Row 0: embed URL | playlist URL
  // Rows 1+: eyebrow | title | video-id
  const cells0 = rows[0] ? [...rows[0].children] : [];
  const embedUrl = cells0[0]?.querySelector('a')?.href || cells0[0]?.textContent.trim();
  const playlistUrl = cells0[1]?.querySelector('a')?.href || cells0[1]?.textContent.trim();

  const reelRows = rows.slice(1);

  const wrap = document.createElement('div');
  wrap.className = 'reels-wrap';

  // Section head
  const head = document.createElement('div');
  head.className = 'reels-head';
  const headLeft = document.createElement('div');
  const eyebrow = document.createElement('span');
  eyebrow.className = 'reels-eyebrow';
  eyebrow.textContent = 'Reels';
  const h2 = document.createElement('h2');
  h2.textContent = 'Watch & learn';
  headLeft.append(eyebrow, h2);
  head.append(headLeft);
  if (playlistUrl) {
    const playlistLink = document.createElement('a');
    playlistLink.className = 'reels-playlist-link';
    playlistLink.href = playlistUrl;
    playlistLink.rel = 'noopener';
    playlistLink.target = '_blank';
    playlistLink.textContent = 'Open playlist on YouTube →';
    head.append(playlistLink);
  }
  wrap.append(head);

  // Grid: featured iframe + sidebar
  const grid = document.createElement('div');
  grid.className = 'reels-grid';

  // Featured iframe
  const featured = document.createElement('div');
  featured.className = 'reels-featured';
  const iframe = document.createElement('iframe');
  iframe.id = 'reels-iframe';
  iframe.className = 'reels-player';
  iframe.src = embedUrl || '';
  iframe.title = 'Enterprise Tech Provider video playlist';
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allow', 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
  iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  iframe.setAttribute('allowfullscreen', '');
  iframe.loading = 'lazy';
  featured.append(iframe);
  grid.append(featured);

  // Sidebar playlist
  const side = document.createElement('div');
  side.className = 'reels-side';
  side.id = 'reels-list';
  side.setAttribute('aria-label', 'Playlist videos');

  reelRows.forEach((row, i) => {
    const cells = [...row.children];
    const eyebrowText = cells[0]?.textContent.trim();
    const titleText = cells[1]?.textContent.trim();
    const videoId = cells[2]?.textContent.trim();

    if (!videoId) return;

    const reel = document.createElement('a');
    reel.className = 'reel' + (i === 0 ? ' is-active' : '');
    reel.href = `https://www.youtube.com/watch?v=${videoId}&list=${_getListId(embedUrl)}`;
    reel.rel = 'noopener';
    reel.target = '_blank';
    reel.dataset.videoId = videoId;

    const thumb = document.createElement('span');
    thumb.className = 'reel-thumb';
    const thumbImg = document.createElement('img');
    thumbImg.src = `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
    thumbImg.alt = '';
    thumbImg.loading = 'lazy';
    thumbImg.width = 120;
    thumbImg.height = 68;
    const playBtn = document.createElement('span');
    playBtn.className = 'reel-play';
    playBtn.setAttribute('aria-hidden', 'true');
    playBtn.innerHTML = '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M5 3l8 5-8 5z"/></svg>';
    thumb.append(thumbImg, playBtn);

    const meta = document.createElement('span');
    meta.className = 'reel-meta';
    const reelEyebrow = document.createElement('span');
    reelEyebrow.className = 'reel-eyebrow';
    reelEyebrow.textContent = eyebrowText || '';
    const reelTitle = document.createElement('span');
    reelTitle.className = 'reel-title';
    reelTitle.textContent = titleText || '';
    meta.append(reelEyebrow, reelTitle);

    reel.append(thumb, meta);
    side.append(reel);
  });

  grid.append(side);
  wrap.append(grid);
  block.innerHTML = '';
  block.append(wrap);

  // Playlist interaction: click sidebar reel → swap iframe
  side.addEventListener('click', (e) => {
    const reelEl = e.target.closest('[data-video-id]');
    if (!reelEl) return;
    e.preventDefault();
    const id = reelEl.dataset.videoId;
    const listId = _getListId(embedUrl);
    iframe.src = `https://www.youtube.com/embed/${id}?list=${listId}&rel=0&modestbranding=1&autoplay=1`;
    side.querySelectorAll('.reel').forEach((el) => el.classList.remove('is-active'));
    reelEl.classList.add('is-active');
  });
}

function _getListId(url) {
  if (!url) return '';
  const m = url.match(/list=([^&]+)/);
  return m ? m[1] : '';
}
