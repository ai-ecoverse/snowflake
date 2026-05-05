export default async function decorate(block) {
  const rows = [...block.children];

  // Row 0: eyebrow
  // Row 1: headline
  // Row 2: description
  // Row 3: form action URL
  // Row 4: legal links (one or two anchors)

  const getCell = (row, idx = 0) => row?.children[idx];
  const getText = (row, idx = 0) => getCell(row, idx)?.textContent.trim() || '';

  const eyebrowText = getText(rows[0]);
  const headlineText = getText(rows[1]);
  const descText = getText(rows[2]);
  const formAction = getCell(rows[3])?.querySelector('a')?.href || getText(rows[3]);
  const legalLinks = rows[4] ? [...rows[4].querySelectorAll('a')] : [];

  const narrow = document.createElement('div');
  narrow.className = 'engagement-narrow';

  if (eyebrowText) {
    const eyebrow = document.createElement('span');
    eyebrow.className = 'engagement-eyebrow';
    eyebrow.textContent = eyebrowText;
    narrow.append(eyebrow);
  }

  if (headlineText) {
    const h2 = document.createElement('h2');
    h2.textContent = headlineText;
    narrow.append(h2);
  }

  if (descText) {
    const desc = document.createElement('p');
    desc.className = 'engagement-desc';
    desc.textContent = descText;
    narrow.append(desc);
  }

  // Form
  const form = document.createElement('form');
  form.action = formAction || '#';
  form.method = 'post';
  form.setAttribute('aria-label', 'Subscribe to the ETP newsletter');

  const input = document.createElement('input');
  input.className = 'engagement-input';
  input.type = 'email';
  input.name = 'email';
  input.placeholder = 'you@company.com';
  input.required = true;
  input.setAttribute('aria-label', 'Email address');

  const btn = document.createElement('button');
  btn.className = 'engagement-btn';
  btn.type = 'submit';
  const lab = document.createElement('span');
  lab.className = 'engagement-btn-lab';
  lab.textContent = 'Subscribe';
  const arrow = document.createElement('span');
  arrow.className = 'engagement-btn-arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '→';
  btn.append(lab, arrow);

  form.append(input, btn);
  narrow.append(form);

  // Legal
  if (legalLinks.length) {
    const foot = document.createElement('div');
    foot.className = 'engagement-foot';
    foot.append(document.createTextNode('By subscribing you agree to our '));
    legalLinks.forEach((a, i) => {
      const link = document.createElement('a');
      link.href = a.href;
      link.textContent = a.textContent.trim();
      foot.append(link);
      if (i < legalLinks.length - 1) {
        foot.append(document.createTextNode(' and '));
      }
    });
    foot.append(document.createTextNode('.'));
    narrow.append(foot);
  }

  block.innerHTML = '';
  block.append(narrow);
}
