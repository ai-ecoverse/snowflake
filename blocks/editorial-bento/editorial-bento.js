/**
 * editorial-bento — Two-panel trust bento (standard home-proposed only)
 *
 * Authoring rows (positional):
 *   1. eyebrow
 *   2. h2 headline
 *   3. Left panel stat eyebrow   (e.g. "By the numbers")
 *   4. Left panel stat figure    (e.g. "4.6 stars")
 *   5. Left panel stat body      (supporting text)
 *   6. Right panel image label   (descriptive alt/label)
 *   7. Right panel eyebrow       (e.g. "AI Visibility Index")
 *   8. Right panel h3 headline
 *   9. Right panel body
 */

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  function cell(row) { return row?.firstElementChild || null; }

  const [
    eyebrowRow, headlineRow,
    leftEyebrowRow, leftFigureRow, leftBodyRow,
    rightImageLabelRow, rightEyebrowRow, rightHeadlineRow, rightBodyRow,
  ] = rows;

  const header = document.createElement('header');
  header.className = 'section-header';

  if (eyebrowRow) {
    const p = document.createElement('p');
    p.className = 't-eyebrow';
    p.textContent = cell(eyebrowRow)?.textContent.trim() || '';
    header.append(p);
  }

  if (headlineRow) {
    const h2 = document.createElement('h2');
    h2.className = 't-title-2 section-headline';
    h2.innerHTML = cell(headlineRow)?.innerHTML || '';
    header.append(h2);
  }

  // Left panel (stat card)
  const left = document.createElement('article');
  left.className = 'bento-left';

  if (leftEyebrowRow) {
    const p = document.createElement('p');
    p.className = 'stat-eyebrow';
    p.textContent = cell(leftEyebrowRow)?.textContent.trim() || '';
    left.append(p);
  }

  if (leftFigureRow) {
    const div = document.createElement('div');
    div.className = 'stat-figure-wrap';
    div.innerHTML = cell(leftFigureRow)?.innerHTML || '';
    left.append(div);
  }

  if (leftBodyRow) {
    const div = document.createElement('div');
    div.className = 'stat-body-wrap';
    div.innerHTML = cell(leftBodyRow)?.innerHTML || '';
    left.append(div);
  }

  // Right panel (image + copy)
  const right = document.createElement('div');
  right.className = 'bento-right';

  const imgWrap = document.createElement('div');
  imgWrap.className = 'bento-right-image';
  imgWrap.setAttribute('aria-hidden', 'true');
  if (rightImageLabelRow) {
    imgWrap.textContent = cell(rightImageLabelRow)?.textContent.trim() || '';
  }
  right.append(imgWrap);

  const copy = document.createElement('div');
  copy.className = 'bento-right-copy';

  if (rightEyebrowRow) {
    const p = document.createElement('p');
    p.className = 'ai-eyebrow';
    p.textContent = cell(rightEyebrowRow)?.textContent.trim() || '';
    copy.append(p);
  }

  if (rightHeadlineRow) {
    const h3 = document.createElement('h3');
    h3.className = 't-title-3';
    h3.innerHTML = cell(rightHeadlineRow)?.innerHTML || '';
    copy.append(h3);
  }

  if (rightBodyRow) {
    const p = document.createElement('p');
    p.innerHTML = cell(rightBodyRow)?.innerHTML || '';
    copy.append(p);
  }

  right.append(copy);

  const bentoRow = document.createElement('div');
  bentoRow.className = 'bento-row';
  bentoRow.append(left, right);

  block.replaceChildren(header, bentoRow);
}
