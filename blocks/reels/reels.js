/**
 * Reels block — "Watch & learn" featured iframe + sidebar.
 *
 * Authoring rows:
 *   Row 0: embed URL (e.g. https://www.youtube.com/embed/VIDEO_ID?list=...)
 *   Row 1–4: sidebar items. Each row:
 *     Cell A: watch URL (https://www.youtube.com/watch?v=VIDEO_ID&list=...)
 *     Cell B: eyebrow text
 *     Cell C: title text
 *     Cell D: (optional) thumbnail img URL override
 *
 *   If each sidebar row has only 2 cells, first cell = watch URL, second = title.
 *   Eye-brow is extracted from cell B if present; otherwise inferred.
 */

const PLAYLIST = 'PLwSFLsD6NhIjdM5ncVJxfcOCYsCuOmGey';

function extractVideoId(url) {
  try {
    const u = new URL(url);
    return u.searchParams.get('v') || u.pathname.split('/').pop();
  } catch {
    const m = url.match(/(?:v=|embed\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
  }
}

const PLAY_SVG = `<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" width="14" height="14"><path d="M5 3l8 5-8 5z"/></svg>`;

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  block.innerHTML = '';

  const outer = document.createElement('div');
  outer.className = 'ds-container';

  // Section head
  const secHead = document.createElement('div');
  secHead.className = 'ds-section-head';
  const secHeadInner = document.createElement('div');
  const ew = document.createElement('span');
  ew.className = 'ds-eyebrow ds-eyebrow--brass-deep';
  ew.textContent = 'Reels';
  const h2 = document.createElement('h2');
  h2.textContent = 'Watch & learn';
  secHeadInner.append(ew, h2);
  secHead.append(secHeadInner);

  const playlistLink = document.createElement('a');
  playlistLink.className = 'ds-link-arrow';
  playlistLink.href = `https://www.youtube.com/playlist?list=${PLAYLIST}`;
  playlistLink.rel = 'noopener';
  playlistLink.target = '_blank';
  playlistLink.textContent = 'Open playlist on YouTube →';
  secHead.append(playlistLink);
  outer.append(secHead);

  // Reels grid
  const reelsGrid = document.createElement('div');
  reelsGrid.className = 'ds-reels-grid';

  // Featured player
  const featured = document.createElement('div');
  featured.className = 'ds-reels-featured';

  // Row 0: embed URL
  const embedUrlCell = rows[0]?.querySelector(':scope > div');
  let embedUrl = embedUrlCell?.querySelector('a')?.href || embedUrlCell?.textContent.trim() || '';
  const firstVideoId = extractVideoId(embedUrl);
  if (firstVideoId && !embedUrl.includes('embed')) {
    embedUrl = `https://www.youtube.com/embed/${firstVideoId}?list=${PLAYLIST}&rel=0&modestbranding=1`;
  }

  const iframe = document.createElement('iframe');
  iframe.id = 'ds-reels-iframe';
  iframe.className = 'ds-reels-player';
  iframe.src = embedUrl || `https://www.youtube.com/embed/?list=${PLAYLIST}&rel=0&modestbranding=1`;
  iframe.title = 'Enterprise Tech Provider video playlist';
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allow', 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
  iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('loading', 'lazy');
  featured.append(iframe);
  reelsGrid.append(featured);

  // Sidebar
  const side = document.createElement('div');
  side.className = 'ds-reels-side';
  side.id = 'ds-reels-list';
  side.setAttribute('aria-label', 'Playlist videos');

  const sideRows = rows.slice(1);
  sideRows.forEach((row, idx) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (!cells.length) return;

    // Try to get watch URL from link in first cell
    const urlAnchor = cells[0]?.querySelector('a');
    const watchUrl = urlAnchor?.href || cells[0]?.textContent.trim() || '';
    const videoId = extractVideoId(watchUrl);

    let eyebrowText = '';
    let titleText = '';

    if (cells.length >= 3) {
      eyebrowText = cells[1]?.textContent.trim() || '';
      titleText = cells[2]?.textContent.trim() || '';
    } else if (cells.length === 2) {
      // Check if cell B has both eyebrow and title separated by newline
      const b = cells[1]?.textContent.trim() || '';
      const bLines = b.split(/\n/).map((s) => s.trim()).filter(Boolean);
      if (bLines.length >= 2) {
        eyebrowText = bLines[0];
        titleText = bLines.slice(1).join(' ');
      } else {
        titleText = b;
        eyebrowText = idx === 0 ? 'Now playing' : `Reel ${idx + 1}`;
      }
    } else {
      titleText = urlAnchor?.textContent.trim() || '';
      eyebrowText = idx === 0 ? 'Now playing' : `Reel ${idx + 1}`;
    }

    const reel = document.createElement('a');
    reel.className = 'ds-reel' + (idx === 0 ? ' is-active' : '');
    reel.href = watchUrl || '#';
    reel.rel = 'noopener';
    reel.target = '_blank';
    if (videoId) reel.dataset.videoId = videoId;

    // Thumb
    const thumbSpan = document.createElement('span');
    thumbSpan.className = 'ds-reel-thumb';

    const thumbImg = document.createElement('img');
    thumbImg.src = videoId ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` : '';
    thumbImg.alt = '';
    thumbImg.setAttribute('loading', 'lazy');
    thumbImg.width = 120;
    thumbImg.height = 68;
    thumbSpan.append(thumbImg);

    const playSpan = document.createElement('span');
    playSpan.className = 'ds-reel-play';
    playSpan.setAttribute('aria-hidden', 'true');
    playSpan.innerHTML = PLAY_SVG;
    thumbSpan.append(playSpan);

    reel.append(thumbSpan);

    // Meta
    const metaSpan = document.createElement('span');
    metaSpan.className = 'ds-reel-meta';

    const ewSpan = document.createElement('span');
    ewSpan.className = 'ds-reel-eyebrow';
    ewSpan.textContent = eyebrowText || (idx === 0 ? 'Now playing' : '');

    const titleSpan = document.createElement('span');
    titleSpan.className = 'ds-reel-title';
    titleSpan.textContent = titleText;

    metaSpan.append(ewSpan, titleSpan);
    reel.append(metaSpan);
    side.append(reel);
  });

  reelsGrid.append(side);
  outer.append(reelsGrid);
  block.append(outer);

  // Click-to-swap behavior
  side.addEventListener('click', (e) => {
    const a = e.target.closest('[data-video-id]');
    if (!a) return;
    e.preventDefault();
    const id = a.dataset.videoId;
    iframe.src = `https://www.youtube.com/embed/${id}?list=${PLAYLIST}&rel=0&modestbranding=1&autoplay=1`;
    side.querySelectorAll('.ds-reel').forEach((el) => el.classList.remove('is-active'));
    a.classList.add('is-active');
  });
}
