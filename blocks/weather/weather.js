/**
 * Weather block
 * Authoring rows (positional):
 *   1. eyebrow
 *   2. h2
 *   3. paragraph
 *   4. thresholds panel eyebrow label
 *   5+. threshold rows: 2 cells each [temp | description]
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const eyebrowText = rows[0]?.querySelector('p, div')?.textContent?.trim() ?? '';
  const headingText = rows[1]?.querySelector('p, div, h2')?.textContent?.trim() ?? '';
  const bodyText = rows[2]?.querySelector('p, div')?.textContent?.trim() ?? '';
  const thresholdsLabel = rows[3]?.querySelector('p, div')?.textContent?.trim() ?? '';

  // Left column
  const left = document.createElement('div');
  left.className = 'weather-left';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = eyebrowText;

  const h2 = document.createElement('h2');
  h2.textContent = headingText;

  const p = document.createElement('p');
  p.textContent = bodyText;

  left.append(eyebrow, h2, p);

  // Right column (thresholds panel)
  const right = document.createElement('div');
  right.className = 'thresholds';

  if (thresholdsLabel) {
    const label = document.createElement('p');
    label.className = 'thresholds-eyebrow';
    label.textContent = thresholdsLabel;
    right.append(label);
  }

  rows.slice(4).forEach((row) => {
    const cells = [...row.children];
    const temp = cells[0]?.textContent?.trim() ?? '';
    const desc = cells[1]?.textContent?.trim() ?? '';

    const rowEl = document.createElement('div');
    rowEl.className = 'row';

    const tempEl = document.createElement('span');
    tempEl.className = 'temp';
    tempEl.textContent = temp;

    const descEl = document.createElement('span');
    descEl.className = 'desc';
    descEl.textContent = desc;

    rowEl.append(tempEl, descEl);
    right.append(rowEl);
  });

  const inner = document.createElement('div');
  inner.className = 'weather-inner';
  inner.append(left, right);

  block.replaceChildren(inner);
}
