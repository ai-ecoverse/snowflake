/**
 * Engagement block — Newsletter sign-up.
 *
 * Authoring:
 *   Row 0, cell 0: eyebrow text | <h2> | description paragraph
 *   Row 1, cell 0: form action URL (plain text or link)
 *   Row 2, cell 0: legal text with inline links
 *
 * If only 1 row: parse from that row's cells:
 *   cell 0: eyebrow, cell 1: h2, cell 2: description, cell 3: form URL, cell 4: legal
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  block.innerHTML = '';

  const outer = document.createElement('div');
  outer.className = 'ds-container';

  const narrow = document.createElement('div');
  narrow.className = 'ds-newsletter-narrow';

  // Parse content rows
  let eyebrowText = 'Newsletters';
  let headlineText = 'Get next week\u2019s first.';
  let descText = '';
  let formAction = 'https://pages.thechannelco.com/index.php/form/XDFrame';
  let legalNodes = null;

  if (rows.length >= 2) {
    // Multi-row: row 0 = content block, row 1 = form URL, row 2 = legal
    const contentCell = rows[0]?.querySelector(':scope > div');
    if (contentCell) {
      const h2El = contentCell.querySelector('h2');
      const pEls = [...contentCell.querySelectorAll('p')];

      // eyebrow = text node / span before h2
      const walker = document.createTreeWalker(contentCell, NodeFilter.SHOW_TEXT);
      const preParts = [];
      let node = walker.nextNode();
      while (node) {
        if (h2El && h2El.contains(node)) break;
        const t = node.textContent.trim();
        if (t) preParts.push(t);
        node = walker.nextNode();
      }
      eyebrowText = preParts.join(' ') || eyebrowText;
      headlineText = h2El?.textContent.trim() || headlineText;
      descText = pEls[0]?.textContent.trim() || '';
    }

    // Form action
    const actionCell = rows[1]?.querySelector(':scope > div');
    formAction = actionCell?.querySelector('a')?.href || actionCell?.textContent.trim() || formAction;

    // Legal
    const legalCell = rows[2]?.querySelector(':scope > div');
    if (legalCell) legalNodes = legalCell.cloneNode(true);
  } else if (rows.length === 1) {
    // Single row, multiple cells or parse paragraph elements
    const cells = [...rows[0].querySelectorAll(':scope > div')];
    if (cells.length >= 3) {
      eyebrowText = cells[0]?.textContent.trim() || eyebrowText;
      const h2El = cells[1]?.querySelector('h2');
      headlineText = h2El?.textContent.trim() || cells[1]?.textContent.trim() || headlineText;
      descText = cells[2]?.textContent.trim() || descText;
      formAction = cells[3]?.querySelector('a')?.href || cells[3]?.textContent.trim() || formAction;
      if (cells[4]) legalNodes = cells[4].cloneNode(true);
    } else {
      // Try to parse from paragraphs / h2 inside single cell
      const singleCell = cells[0] || rows[0];
      const h2El = singleCell.querySelector('h2');
      headlineText = h2El?.textContent.trim() || headlineText;
      const pEls = [...singleCell.querySelectorAll('p')];
      descText = pEls[0]?.textContent.trim() || descText;
    }
  }

  // Build
  const ewSpan = document.createElement('span');
  ewSpan.className = 'ds-eyebrow ds-eyebrow--brass-deep';
  ewSpan.textContent = eyebrowText;
  narrow.append(ewSpan);

  const h2 = document.createElement('h2');
  h2.textContent = headlineText;
  narrow.append(h2);

  if (descText) {
    const desc = document.createElement('p');
    desc.textContent = descText;
    narrow.append(desc);
  }

  // Form
  const form = document.createElement('form');
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
  form.append(emailInput);

  const submitBtn = document.createElement('button');
  submitBtn.className = 'ds-button-primary';
  submitBtn.type = 'submit';

  const lab = document.createElement('span');
  lab.className = 'ds-btn-lab';
  lab.textContent = 'Subscribe';

  const arrow = document.createElement('span');
  arrow.className = 'ds-btn-arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '→';

  submitBtn.append(lab, arrow);
  form.append(submitBtn);
  narrow.append(form);

  // Legal foot
  const foot = document.createElement('div');
  foot.className = 'ds-newsletter-foot';

  if (legalNodes) {
    foot.append(...legalNodes.childNodes);
  } else {
    foot.innerHTML = 'By subscribing you agree to our '
      + '<a href="https://pages.thechannelco.com/terms-of-service-INTL.html">terms of service</a>'
      + ' and '
      + '<a href="https://pages.thechannelco.com/standard-policies-INTL-Privacy.html">privacy policy</a>.';
  }

  narrow.append(foot);
  outer.append(narrow);
  block.append(outer);
}
