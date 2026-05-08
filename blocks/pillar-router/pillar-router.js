/**
 * pillar-router — value proposition; 5-card interactive accordion
 *
 * Authoring rows (positional):
 *   1. Eyebrow text
 *   2. h2 headline
 *   3..N Card rows — 3 cells: label | tagline | body text
 *
 * No button CTAs in this block — cards are interactive accordion items.
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Row 0: eyebrow
  const eyebrowText = rows[0]?.firstElementChild?.textContent?.trim() || '';

  // Row 1: headline
  const headlineEl = rows[1]?.firstElementChild;

  // Rows 2+: card rows
  const cardRows = rows.slice(2);

  // Section header
  const header = document.createElement('header');
  header.className = 'section-header';

  if (eyebrowText) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 't-eyebrow';
    eyebrow.textContent = eyebrowText;
    header.appendChild(eyebrow);
  }

  if (headlineEl) {
    const h2 = document.createElement('h2');
    h2.className = 't-title-2';
    h2.innerHTML = headlineEl.innerHTML;
    header.appendChild(h2);
  }

  // Hub router
  const router = document.createElement('div');
  router.className = 'hub-router';
  router.setAttribute('role', 'tablist');
  router.setAttribute('aria-label', 'Product pillars');

  cardRows.forEach((row, i) => {
    const cells = [...row.children];
    const labelText = cells[0]?.textContent?.trim() || '';
    const taglineEl = cells[1];
    const bodyEl = cells[2];

    const card = document.createElement('article');
    card.className = i === 0 ? 'hub-card is-active' : 'hub-card';
    card.setAttribute('tabindex', '0');

    const label = document.createElement('p');
    label.className = 'hub-label';
    label.textContent = labelText;
    card.appendChild(label);

    if (taglineEl) {
      const tagline = document.createElement('h3');
      tagline.className = 'hub-tagline t-title-3';
      tagline.innerHTML = taglineEl.innerHTML;
      card.appendChild(tagline);
    }

    if (bodyEl) {
      const body = document.createElement('p');
      body.className = 'hub-body t-body-m';
      body.innerHTML = bodyEl.innerHTML;
      card.appendChild(body);
    }

    const cta = document.createElement('span');
    cta.className = 'hub-cta';
    cta.setAttribute('aria-hidden', 'true');
    cta.textContent = '+';
    card.appendChild(cta);

    router.appendChild(card);
  });

  // Accordion interaction
  const cards = [...router.querySelectorAll('.hub-card')];
  cards.forEach((card) => {
    function activate() {
      cards.forEach((c) => c.classList.remove('is-active'));
      card.classList.add('is-active');
    }
    card.addEventListener('click', activate);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate();
      }
    });
  });

  block.replaceChildren(header, router);
}
