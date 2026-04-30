/**
 * Landlord block
 * Authoring rows (positional):
 *   1. eyebrow
 *   2. h2
 *   3. paragraph 1
 *   4. paragraph 2 (may be empty)
 *   5. CTA — <strong><a> for primary button
 *   6+. Benefit rows — single cell per row with benefit text
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const eyebrowText = rows[0]?.querySelector('p, div')?.textContent?.trim() ?? '';
  const headlineText = rows[1]?.querySelector('p, div, h2')?.textContent?.trim() ?? '';
  const para1Text = rows[2]?.querySelector('p, div')?.textContent?.trim() ?? '';
  const para2Text = rows[3]?.querySelector('p, div')?.textContent?.trim() ?? '';

  // Clone CTA anchor from row 4 (wrapped in <strong><a>)
  const ctaAnchor = rows[4]?.querySelector('a');

  // Build left column
  const left = document.createElement('div');
  left.className = 'l-left';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = eyebrowText;

  const h2 = document.createElement('h2');
  h2.textContent = headlineText;

  const p1 = document.createElement('p');
  p1.textContent = para1Text;

  left.append(eyebrow, h2, p1);

  if (para2Text) {
    const p2 = document.createElement('p');
    p2.textContent = para2Text;
    left.append(p2);
  }

  if (ctaAnchor) {
    const cta = ctaAnchor.cloneNode(true);
    const strong = document.createElement('strong');
    strong.append(cta);
    left.append(strong);
  }

  // Build benefits panel from rows 5+
  const benefits = document.createElement('div');
  benefits.className = 'benefits';

  rows.slice(5).forEach((row) => {
    const text = row.querySelector('p, div')?.textContent?.trim() ?? '';
    if (!text) return;

    const benefitRow = document.createElement('div');
    benefitRow.className = 'row';

    const check = document.createElement('span');
    check.className = 'c';
    check.setAttribute('aria-hidden', 'true');
    check.textContent = '✓';

    const label = document.createElement('span');
    label.textContent = text;

    benefitRow.append(check, label);
    benefits.append(benefitRow);
  });

  const inner = document.createElement('div');
  inner.className = 'l-inner';
  inner.append(left, benefits);

  block.replaceChildren(inner);
}
