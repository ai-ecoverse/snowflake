/**
 * sticky-cta — floating sticky bar + plan-picker modal
 *
 * Authoring rows (positional):
 *   1. Label text
 *   2. Price hint text
 *   3..N Plan rows — 5 cells: tier-eyebrow | tier-name | price | features (newline-separated) | CTA
 *
 * Button convention: clone CTA cell children — do NOT manufacture anchors.
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const cell = (row, i) => [...row.children][i];

  // Header rows
  const labelText     = cell(rows[0], 0)?.textContent?.trim() || 'Start free trial';
  const priceHintText = cell(rows[1], 0)?.textContent?.trim() || 'See plans';

  // Plan rows
  const planRows = rows.slice(2);

  // ---- Sticky bar ----
  const sticky = document.createElement('div');
  sticky.className = 'sticky-cta-bar';
  sticky.setAttribute('role', 'button');
  sticky.setAttribute('tabindex', '0');
  sticky.setAttribute('aria-haspopup', 'dialog');
  sticky.setAttribute('aria-controls', 'sticky-cta-modal');

  const icon = document.createElement('span');
  icon.className = 'icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.innerHTML = '&#9733;';

  const label = document.createElement('span');
  label.className = 'label';
  label.textContent = labelText;

  const priceHint = document.createElement('span');
  priceHint.className = 'price-hint';
  priceHint.textContent = priceHintText;

  sticky.append(icon, label, priceHint);

  // ---- Modal backdrop ----
  const backdrop = document.createElement('div');
  backdrop.className = 'cta-modal-backdrop';
  backdrop.id = 'sticky-cta-backdrop';
  backdrop.setAttribute('aria-hidden', 'true');

  // ---- Modal ----
  const modal = document.createElement('div');
  modal.className = 'cta-modal';
  modal.id = 'sticky-cta-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'sticky-cta-modal-title');
  modal.setAttribute('aria-hidden', 'true');

  const modalHeader = document.createElement('header');
  modalHeader.className = 'cta-modal-header';
  const modalTitle = document.createElement('h3');
  modalTitle.id = 'sticky-cta-modal-title';
  modalTitle.textContent = 'Pick a plan to start your trial.';
  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'cta-modal-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.innerHTML = '&times;';
  modalHeader.append(modalTitle, closeBtn);

  // Plan cards
  const planCards = document.createElement('div');
  planCards.className = 'plan-cards';

  planRows.forEach((row, i) => {
    const tierEyebrowEl = cell(row, 0);
    const tierNameEl    = cell(row, 1);
    const priceEl       = cell(row, 2);
    const featuresEl    = cell(row, 3);
    const ctaCell       = cell(row, 4);

    const card = document.createElement('article');
    card.className = 'plan-card';

    const planHeader = document.createElement('div');
    planHeader.className = 'plan-header';

    if (tierEyebrowEl) {
      const eyebrow = document.createElement('span');
      eyebrow.className = 't-eyebrow';
      eyebrow.innerHTML = tierEyebrowEl.innerHTML;
      planHeader.appendChild(eyebrow);
    } else {
      const eyebrow = document.createElement('span');
      eyebrow.className = 't-eyebrow';
      eyebrow.textContent = `Plan tier ${i + 1}`;
      planHeader.appendChild(eyebrow);
    }

    if (tierNameEl) {
      const h4 = document.createElement('h4');
      h4.innerHTML = tierNameEl.innerHTML;
      planHeader.appendChild(h4);
    }

    if (priceEl) {
      const price = document.createElement('div');
      price.className = 'plan-price';
      price.innerHTML = priceEl.innerHTML;
      planHeader.appendChild(price);
    }

    card.appendChild(planHeader);

    // Features list
    if (featuresEl) {
      const features = featuresEl.textContent.split(/[,\n]+/).map((f) => f.trim()).filter(Boolean);
      if (features.length) {
        const ul = document.createElement('ul');
        ul.className = 'plan-features';
        features.forEach((f) => {
          const li = document.createElement('li');
          li.textContent = f;
          ul.appendChild(li);
        });
        card.appendChild(ul);
      }
    }

    // CTA
    if (ctaCell && ctaCell.querySelector('a')) {
      const actions = document.createElement('div');
      actions.className = 'plan-cta';
      [...ctaCell.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
      card.appendChild(actions);
    }

    planCards.appendChild(card);
  });

  modal.append(modalHeader, planCards);

  // ---- Interaction ----
  function openModal() {
    modal.classList.add('is-open');
    backdrop.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    sticky.focus();
  }

  sticky.addEventListener('click', openModal);
  sticky.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); }
  });
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  block.replaceChildren(sticky, backdrop, modal);
}
