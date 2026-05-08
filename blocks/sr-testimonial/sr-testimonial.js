export default async function decorate(block) {
  const rows = [...block.children];

  // Row 1: eyebrow
  // Row 2: h2 heading
  // Row 3: quote text
  // Row 4: portrait picture | person name | person role
  // Row 5: company logo picture
  // Row 6: metric value
  // Row 7: metric label

  const eyebrowText = rows[0]?.querySelector('div')?.textContent?.trim() || '';
  const headingEl = rows[1]?.querySelector('h2');
  const quoteText = rows[2]?.querySelector('div')?.textContent?.trim() || '';

  const bylineRow = rows[3];
  const bylineCells = bylineRow ? [...bylineRow.querySelectorAll(':scope > div')] : [];
  const portraitImg = bylineCells[0]?.querySelector('img');
  const personName = bylineCells[1]?.textContent?.trim() || '';
  const personRole = bylineCells[2]?.textContent?.trim() || '';

  const logoImg = rows[4]?.querySelector('img');
  const metricValue = rows[5]?.querySelector('div')?.textContent?.trim() || '';
  const metricLabel = rows[6]?.querySelector('div')?.textContent?.trim() || '';

  // Build copy column
  const copy = document.createElement('div');
  copy.className = 'sr-testimonial__copy';

  const eyebrow = document.createElement('span');
  eyebrow.className = 'sr-testimonial__eyebrow';
  eyebrow.textContent = eyebrowText;
  copy.appendChild(eyebrow);

  if (headingEl) {
    const heading = document.createElement('h2');
    heading.className = 'sr-testimonial__heading';
    heading.innerHTML = headingEl.innerHTML;
    copy.appendChild(heading);
  }

  const quote = document.createElement('blockquote');
  quote.className = 'sr-testimonial__quote';
  quote.textContent = quoteText;
  copy.appendChild(quote);

  const byline = document.createElement('div');
  byline.className = 'sr-testimonial__byline';

  if (portraitImg) {
    const portrait = document.createElement('div');
    portrait.className = 'sr-testimonial__portrait';
    portrait.appendChild(portraitImg.cloneNode(true));
    byline.appendChild(portrait);
  }

  const nameRole = document.createElement('div');
  const name = document.createElement('div');
  name.className = 'sr-testimonial__name';
  name.textContent = personName;
  const role = document.createElement('div');
  role.className = 'sr-testimonial__role';
  role.textContent = personRole;
  nameRole.appendChild(name);
  nameRole.appendChild(role);
  byline.appendChild(nameRole);

  if (logoImg) {
    const logo = document.createElement('div');
    logo.className = 'sr-testimonial__logo';
    logo.appendChild(logoImg.cloneNode(true));
    byline.appendChild(logo);
  }

  copy.appendChild(byline);

  // Build metric column
  const metric = document.createElement('div');
  metric.className = 'sr-testimonial__metric';

  const mValue = document.createElement('div');
  mValue.className = 'sr-testimonial__metric-value';
  mValue.textContent = metricValue;
  metric.appendChild(mValue);

  const mLabel = document.createElement('div');
  mLabel.className = 'sr-testimonial__metric-label';
  mLabel.textContent = metricLabel;
  metric.appendChild(mLabel);

  // Assemble
  const inner = document.createElement('div');
  inner.className = 'sr-testimonial__inner';
  inner.appendChild(copy);
  inner.appendChild(metric);

  block.innerHTML = '';
  block.appendChild(inner);
}
