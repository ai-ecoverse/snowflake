/**
 * Topic Band block — "Across the channel" — full-width ink band, 7 topic cells.
 *
 * Authoring: 7 rows, each = one topic cell.
 *   Cell A: number (e.g. "01")
 *   Cell B: topic name
 *   Cell C: count text (e.g. "36 articles") — may include link
 *
 * Or a single row containing all 7 items (unlikely — use 7 rows).
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  block.innerHTML = '';

  const outer = document.createElement('div');
  outer.className = 'ds-container';

  // Section head
  const head = document.createElement('div');
  head.className = 'ds-topic-head';

  const headInner = document.createElement('div');
  const ew = document.createElement('span');
  ew.className = 'ds-eyebrow ds-eyebrow--brass';
  ew.textContent = 'By Topic';
  const h2 = document.createElement('h2');
  h2.textContent = 'Across the channel';
  headInner.append(ew, h2);
  head.append(headInner);

  const allLink = document.createElement('a');
  allLink.className = 'ds-link-arrow ds-link-arrow--on-ink';
  allLink.href = '/sitemap';
  allLink.style.color = 'var(--brass-soft)';
  allLink.textContent = 'All sections →';
  head.append(allLink);

  outer.append(head);

  // Topic row
  const topicRow = document.createElement('div');
  topicRow.className = 'ds-topic-row';

  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (!cells.length) return;

    // Extract: num | name | count  (3 cells) or try to get from single anchor
    let num = '';
    let name = '';
    let count = '';
    let href = '#';

    // Check if there's a direct anchor in this row (single-cell rows with full link)
    const rowAnchor = row.querySelector('a');

    if (cells.length >= 3) {
      num = cells[0].textContent.trim();
      name = cells[1].textContent.trim();
      count = cells[2].textContent.trim();
      href = cells[1].querySelector('a')?.href || cells[0].querySelector('a')?.href || href;
    } else if (cells.length === 2) {
      num = cells[0].textContent.trim();
      const nameAndCount = cells[1].textContent.split(/[\n|]/).map((s) => s.trim()).filter(Boolean);
      name = nameAndCount[0] || '';
      count = nameAndCount[1] || '';
      href = cells[1].querySelector('a')?.href || href;
    } else if (rowAnchor) {
      href = rowAnchor.href;
      const parts = rowAnchor.textContent.split(/[\n|]/).map((s) => s.trim()).filter(Boolean);
      num = parts[0] || '';
      name = parts[1] || '';
      count = parts[2] || '';
    }

    const targetCount = parseInt(count.match(/\d+/)?.[0] || '0', 10);
    const countSuffix = count.replace(/\d+/, '').trim() || '';

    const cell = document.createElement('a');
    cell.className = 'ds-topic-cell';
    cell.href = href;

    const numSpan = document.createElement('span');
    numSpan.className = 'ds-topic-num';
    numSpan.textContent = num;

    const nameSpan = document.createElement('span');
    nameSpan.className = 'ds-topic-name';
    nameSpan.textContent = name;

    const countSpan = document.createElement('span');
    countSpan.className = 'ds-topic-count';
    countSpan.textContent = targetCount ? `0 ${countSuffix}`.trim() : count;

    cell.append(numSpan, nameSpan, countSpan);

    if (targetCount) {
      cell.dataset.targetCount = String(targetCount);
      cell.dataset.countSuffix = countSuffix;
    }

    topicRow.append(cell);
  });

  outer.append(topicRow);
  block.append(outer);

  // Count tick-up delight
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const cells2 = block.querySelectorAll('.ds-topic-cell[data-target-count]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        const cell = entry.target;
        observer.unobserve(cell);
        const target = parseInt(cell.dataset.targetCount, 10);
        const suffix = cell.dataset.countSuffix || '';
        const countEl = cell.querySelector('.ds-topic-count');
        if (!target || !countEl) return;
        const stagger = i * 90;
        cell.classList.add('is-counting');
        setTimeout(() => {
          const start = performance.now();
          const duration = 1100;
          function step(now) {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - (1 - t) ** 4;
            const val = Math.round(target * eased);
            countEl.textContent = suffix ? `${val} ${suffix}` : String(val);
            if (t < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        }, stagger);
      });
    }, { threshold: 0.4, rootMargin: '0px 0px -10% 0px' });

    cells2.forEach((c) => observer.observe(c));
  }
}
