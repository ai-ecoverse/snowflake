/**
 * flow-4-step — 4-step numbered flow with hairline connector track.
 * Authoring rows:
 *   1: Section heading
 *   2-5: Step rows — Cell 1=step number (e.g. "/ 01"), Cell 2=image, Cell 3=title, Cell 4=link URL
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const fragments = [];

  // Row 1 — heading
  if (rows[0]) {
    const heading = document.createElement('h2');
    heading.textContent = rows[0].firstElementChild?.textContent.trim() ?? '';
    fragments.push(heading);
  }

  const ol = document.createElement('ol');
  ol.className = 'flow-grid';

  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    const stepNum = cells[0]?.textContent.trim() ?? '';
    const picture = cells[1]?.querySelector('picture, img');
    const titleText = cells[2]?.textContent.trim() ?? '';
    const url = cells[3]?.textContent.trim() ?? '#';

    const li = document.createElement('li');
    li.className = 'flow-step';

    const a = document.createElement('a');
    a.className = 'flow-step-link';
    a.href = url;

    const numEl = document.createElement('span');
    numEl.className = 'flow-step-number';
    numEl.textContent = stepNum;

    const photoWrap = document.createElement('div');
    photoWrap.className = 'flow-step-photo';
    if (picture) photoWrap.append(picture);

    const titleEl = document.createElement('h3');
    titleEl.className = 'flow-step-title';
    titleEl.textContent = titleText;

    a.append(numEl, photoWrap, titleEl);
    li.append(a);
    ol.append(li);
  });

  fragments.push(ol);
  block.replaceChildren(...fragments);
}
