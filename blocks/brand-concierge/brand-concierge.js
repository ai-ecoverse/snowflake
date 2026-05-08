/**
 * brand-concierge — Brand Concierge agentic search (black surface).
 *
 * Authoring rows (positional):
 *   1.   Headline (h2)
 *   2.   Body paragraph
 *   3.   Placeholder text for the input
 *   4–N. Chip suggestion texts (one per row)
 *   Last row: disclaimer text (may contain links) — detected by no anchor as CTA
 *
 * Note: the last row is treated as the disclaimer because it contains
 * long legal prose with inline <a> links, not a chip suggestion.
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const headCell        = rows[0]?.firstElementChild;
  const bodyCell        = rows[1]?.firstElementChild;
  const placeholderCell = rows[2]?.firstElementChild;
  const disclaimerRow   = rows[rows.length - 1];
  const chipRows        = rows.slice(3, rows.length - 1);

  const inner = document.createElement('div');
  inner.className = 'search-section__inner';

  // ── Copy ────────────────────────────────────────────────────────────────────
  const copy = document.createElement('div');
  copy.className = 'search-section__copy';

  if (headCell) {
    const h2 = document.createElement('h2');
    h2.className = 'title-2 search-section__title';
    h2.textContent = headCell.textContent.trim();
    copy.append(h2);
  }

  if (bodyCell) {
    const p = document.createElement('p');
    p.className = 'search-section__body';
    p.textContent = bodyCell.textContent.trim();
    copy.append(p);
  }

  inner.append(copy);

  // ── Search bar ──────────────────────────────────────────────────────────────
  const form = document.createElement('form');
  form.className = 'search-bar';
  form.addEventListener('submit', (e) => e.preventDefault());

  form.innerHTML = `
    <div class="search-bar__icon-left">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <circle cx="7" cy="7" r="5"/><path d="M14 14L10.5 10.5" stroke-linecap="round"/>
      </svg>
    </div>
    <input class="search-bar__input" type="text" placeholder="${placeholderCell?.textContent.trim() || 'Explore what\'s possible'}">
    <button type="submit" class="search-bar__btn" aria-label="Send">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M2 8L14 8M9 3L14 8L9 13"/>
      </svg>
    </button>
  `;

  inner.append(form);

  // ── Chips ───────────────────────────────────────────────────────────────────
  if (chipRows.length) {
    const chips = document.createElement('div');
    chips.className = 'search-section__chips';
    chipRows.forEach((row) => {
      const text = row.firstElementChild?.textContent.trim();
      if (!text) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'search-section__chip';
      btn.textContent = text;
      btn.addEventListener('click', () => {
        const input = form.querySelector('.search-bar__input');
        if (input) input.value = text;
      });
      chips.append(btn);
    });
    inner.append(chips);
  }

  // ── Disclaimer ──────────────────────────────────────────────────────────────
  if (disclaimerRow) {
    const disc = document.createElement('p');
    disc.className = 'search-section__disclaimer';
    disc.innerHTML = disclaimerRow.firstElementChild?.innerHTML || '';
    inner.append(disc);
  }

  block.replaceChildren(inner);
}
