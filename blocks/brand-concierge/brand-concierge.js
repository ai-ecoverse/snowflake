/**
 * brand-concierge — black search section with AI chat chips
 *
 * Authoring rows (positional):
 *   1. section title (h2)
 *   2. body text
 *   3. search placeholder text
 *   4–N. chip text rows
 *   last row. disclaimer HTML/text
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const inner = document.createElement('div');
  inner.className = 'search-section__inner';

  // Copy
  const copy = document.createElement('div');
  copy.className = 'search-section__copy';
  const titleCell = rows[0]?.firstElementChild;
  if (titleCell) {
    const h = document.createElement('h2');
    h.className = 'title-2 search-section__title';
    h.textContent = titleCell.textContent.trim();
    copy.append(h);
  }
  const bodyCell = rows[1]?.firstElementChild;
  if (bodyCell) {
    const p = document.createElement('p');
    p.className = 'search-section__body';
    p.textContent = bodyCell.textContent.trim();
    copy.append(p);
  }
  inner.append(copy);

  // Search bar
  const placeholder = rows[2]?.firstElementChild?.textContent.trim() || 'Explore what\'s possible';
  const form = document.createElement('form');
  form.className = 'search-bar';
  form.addEventListener('submit', e => e.preventDefault());
  form.innerHTML = `
    <div class="search-bar__icon-left">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="7" cy="7" r="5"/><path d="M14 14L10.5 10.5" stroke-linecap="round"/></svg>
    </div>
    <input class="search-bar__input" type="text" placeholder="${placeholder}">
    <button type="submit" class="search-bar__btn" aria-label="Send">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 8L14 8M9 3L14 8L9 13"/></svg>
    </button>
  `;
  inner.append(form);

  // Chips (rows 3..N-1)
  const chipRows = rows.slice(3, rows.length - 1);
  if (chipRows.length) {
    const chips = document.createElement('div');
    chips.className = 'search-section__chips';
    chipRows.forEach(row => {
      const text = row.firstElementChild?.textContent.trim();
      if (text) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'search-section__chip';
        btn.textContent = text;
        chips.append(btn);
      }
    });
    inner.append(chips);
  }

  // Disclaimer (last row)
  const disclaimerRow = rows[rows.length - 1];
  if (disclaimerRow) {
    const d = document.createElement('p');
    d.className = 'search-section__disclaimer';
    d.innerHTML = disclaimerRow.firstElementChild?.innerHTML || disclaimerRow.textContent.trim();
    inner.append(d);
  }

  block.replaceChildren(inner);
}
