/**
 * faq-hero — page-specific intro hero with eyebrow, h1, and subtitle
 *
 * Authoring rows (positional):
 *   1. Eyebrow text  (e.g. "Help · FAQ")
 *   2. <h1> heading
 *   3. Subtitle paragraph
 */

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const eyebrowText = rows[0]?.querySelector('div')?.textContent?.trim() ?? '';
  const headingEl = rows[1]?.querySelector('div')?.querySelector('h1')
    ?? (() => {
      const h1 = document.createElement('h1');
      h1.textContent = rows[1]?.querySelector('div')?.textContent?.trim() ?? '';
      return h1;
    })();
  const subText = rows[2]?.querySelector('div')?.textContent?.trim() ?? '';

  const inner = document.createElement('div');
  inner.className = 'faq-hero-inner';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = eyebrowText;

  const sub = document.createElement('p');
  sub.className = 'sub';
  sub.textContent = subText;

  inner.append(eyebrow, headingEl, sub);
  block.replaceChildren(inner);
}
