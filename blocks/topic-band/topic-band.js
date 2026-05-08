/**
 * topic-band — "Across the channel" full-bleed ink taxonomy band
 *
 * Section head row (row 0):
 *   Cell 1: eyebrow
 *   Cell 2: h2
 *   Cell 3: "All sections" link URL
 *
 * Topic rows (rows 1…N):
 *   Cell 1: number label (01, 02 …)
 *   Cell 2: topic name
 *   Cell 3: count text (e.g. "36 articles")
 *   Cell 4: topic URL (href)
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
  const allHref = text(cells0[2]);

  const head = document.createElement('div');
  head.className = 'topic-head';
  const headLeft = document.createElement('div');
  headLeft.innerHTML = `<span class="ds-eyebrow ds-eyebrow--brass">${eyebrow}</span><h2>${heading}</h2>`;
  head.append(headLeft);
  if (allHref) {
    const link = document.createElement('a');
    link.className = 'ds-link-arrow ds-link-arrow--on-ink';
    link.style.color = 'var(--brass-soft)';
    link.href = allHref;
    link.textContent = 'All sections →';
    head.append(link);
  }
  wrapper.append(head);

  // Topic row
  const row = document.createElement('div');
  row.className = 'topic-row';

  rows.slice(1).forEach((r) => {
    const cells = [...r.children];
    const num = text(cells[0]);
    const name = text(cells[1]);
    const count = text(cells[2]);
    const href = text(cells[3]) || '#';

    const cell = document.createElement('a');
    cell.className = 'topic-cell';
    cell.href = href;
    cell.innerHTML = `
      <span class="topic-num">${num}</span>
      <span class="topic-name">${name}</span>
      <span class="topic-count">${count}</span>`;

    row.append(cell);
  });

  wrapper.append(row);
  block.replaceChildren(wrapper);

  // Delight: count tick-up on scroll
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const cells = block.querySelectorAll('.topic-cell');
    cells.forEach((cell) => {
      const countEl = cell.querySelector('.topic-count');
      if (!countEl) return;
      const match = countEl.textContent.match(/(\d+)/);
      if (!match) return;
      cell.dataset.targetCount = match[1];
      cell.dataset.countSuffix = countEl.textContent.replace(match[1], '');
      countEl.textContent = `0${cell.dataset.countSuffix}`;
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        const cell = entry.target;
        observer.unobserve(cell);
        const target = parseInt(cell.dataset.targetCount || '0', 10);
        const suffix = cell.dataset.countSuffix || '';
        const countEl = cell.querySelector('.topic-count');
        if (!target || !countEl) return;
        cell.classList.add('is-counting');
        setTimeout(() => {
          const start = performance.now();
          const duration = 1100;
          function step(now) {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - (1 - t) ** 4;
            countEl.textContent = Math.round(target * eased) + suffix;
            if (t < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        }, i * 90);
      });
    }, { threshold: 0.4, rootMargin: '0px 0px -10% 0px' });

    cells.forEach((c) => observer.observe(c));
  }
}
