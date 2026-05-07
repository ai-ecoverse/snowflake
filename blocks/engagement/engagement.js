/**
 * Engagement block — centered newsletter sign-up
 *
 * Authoring shape (positional rows):
 *   Row 1: eyebrow text
 *   Row 2: h2 headline
 *   Row 3: description paragraph
 *   Row 4: form action URL
 *   Row 5: terms link | privacy link
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const eyebrowText = rows[0]?.firstElementChild?.textContent?.trim() ?? 'Newsletters';
  const headlineText = rows[1]?.firstElementChild?.textContent?.trim() ?? '';
  const descHTML = rows[2]?.firstElementChild?.innerHTML ?? '';
  const formAction = rows[3]?.firstElementChild?.textContent?.trim()
    || 'https://pages.thechannelco.com/index.php/form/XDFrame';

  // Row 5 — terms / privacy links (may be anchor elements)
  const linkCells = rows[4] ? [...rows[4].children] : [];
  const termsLink = linkCells[0]?.querySelector('a') ?? null;
  const privacyLink = linkCells[1]?.querySelector('a') ?? null;
  const termsHref = termsLink?.href ?? 'https://pages.thechannelco.com/terms-of-service-INTL.html';
  const termsText = termsLink?.textContent?.trim() ?? 'terms of service';
  const privacyHref = privacyLink?.href ?? 'https://pages.thechannelco.com/standard-policies-INTL-Privacy.html';
  const privacyText = privacyLink?.textContent?.trim() ?? 'privacy policy';

  // Build DOM
  const inner = document.createElement('div');
  inner.className = 'engagement-inner';

  const narrow = document.createElement('div');
  narrow.className = 'newsletter-narrow';
  narrow.id = 'engagement';

  if (eyebrowText) {
    const eyebrow = document.createElement('span');
    eyebrow.className = 'ds-eyebrow ds-eyebrow--brass-deep';
    eyebrow.textContent = eyebrowText;
    narrow.append(eyebrow);
  }

  if (headlineText) {
    const h2 = document.createElement('h2');
    h2.textContent = headlineText;
    narrow.append(h2);
  }

  if (descHTML) {
    const p = document.createElement('p');
    p.innerHTML = descHTML;
    narrow.append(p);
  }

  // Form
  const form = document.createElement('form');
  form.className = 'newsletter-form';
  form.action = formAction;
  form.method = 'post';
  form.setAttribute('aria-label', 'Subscribe to the ETP newsletter');

  const emailInput = document.createElement('input');
  emailInput.className = 'ds-input';
  emailInput.type = 'email';
  emailInput.name = 'email';
  emailInput.placeholder = 'you@company.com';
  emailInput.required = true;
  emailInput.setAttribute('aria-label', 'Email address');

  const submitBtn = document.createElement('button');
  submitBtn.className = 'ds-button-primary';
  submitBtn.type = 'submit';
  submitBtn.innerHTML = '<span class="ds-btn-lab">Subscribe</span><span class="ds-btn-arrow" aria-hidden="true">\u2192</span>';

  form.append(emailInput, submitBtn);
  narrow.append(form);

  // Footer
  const foot = document.createElement('div');
  foot.className = 'newsletter-foot';
  foot.innerHTML = `By subscribing you agree to our <a href="${termsHref}">${termsText}</a> and <a href="${privacyHref}">${privacyText}</a>.`;
  narrow.append(foot);

  inner.append(narrow);
  block.innerHTML = '';
  block.append(inner);
}
