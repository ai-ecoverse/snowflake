/**
 * Topic Band block — full-bleed ink band with topic grid
 *
 * Authoring shape:
 *   Row 1: eyebrow | h2 heading | "All sections" link text | link URL
 *   Row 2+: topic cells
 *     Cell 1: number (01)
 *     Cell 2: topic name
 *     Cell 3: count text (e.g. "36 articles" or "Programme")
 *   Optional: if a row has a link anchor in any cell, use it as the topic cell href.
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Row 1 — section header
  const headerCells = [...rows[0].children];
  const eyebrowText = headerCells[0]?.textContent?.trim() || 'By Topic';
  const headingText = headerCells[1]?.textContent?.trim() || 'Across the channel';
  const allLinkText = headerCells[2]?.textContent?.trim() || 'All sections →';
  const allLinkHref = headerCells[3]?.textContent?.trim()
    || headerCells[3]?.querySelector('a')?.href
    || '/sitemap';

  const inner = document.createElement('div');
  inner.className = 'topic-band-inner';

  // Topic head
  const topicHead = document.createElement('div');
  topicHead.className = 'topic-head';

  const headLeft = document.createElement('div');
  headLeft.innerHTML = `
    <span class="ds-eyebrow ds-eyebrow--brass">${eyebrowText}</span>
    <h2>${headingText}</h2>
  `;

  const allLink = document.createElement('a');
  allLink.className = 'ds-link-arrow ds-link-arrow--on-ink';
  allLink.style.color = 'var(--brass-soft)';
  allLink.href = allLinkHref;
  allLink.textContent = allLinkText;

  topicHead.append(headLeft, allLink);
  inner.append(topicHead);

  // Topic row
  const topicRow = document.createElement('div');
  topicRow.className = 'topic-row';

  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    const numText = cells[0]?.textContent?.trim() || '';
    const nameText = cells[1]?.textContent?.trim() || '';
    const countText = cells[2]?.textContent?.trim() || '';

    // Detect link — cell may contain an anchor
    const anchor = row.querySelector('a');
    const href = anchor?.href || '#';

    const cell = document.createElement('a');
    cell.className = 'topic-cell';
    cell.href = href;

    const num = document.createElement('span');
    num.className = 'topic-num';
    num.textContent = numText;

    const name = document.createElement('span');
    name.className = 'topic-name';
    name.textContent = nameText;

    const count = document.createElement('span');
    count.className = 'topic-count';
    count.textContent = countText;

    cell.append(num, name, count);
    topicRow.append(cell);
  });

  inner.append(topicRow);
  block.innerHTML = '';
  block.append(inner);

  // Delight: count tick-up on scroll-into-view
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            [...topicRow.querySelectorAll('.topic-cell')].forEach((cell, i) => {
              setTimeout(() => cell.classList.add('is-counting'), i * 80);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(topicRow);
  }
}
