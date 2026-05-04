/**
 * cta-band — Centered conversion handoff band on dark ground.
 * Authoring rows:
 *   1: h2 headline
 *   2: CTA link (primary — clone child nodes)
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const h2 = document.createElement('h2');
  h2.textContent = rows[0]?.firstElementChild?.textContent.trim() ?? '';

  const actions = document.createElement('div');
  actions.className = 'actions';
  const ctaCell = rows[1]?.firstElementChild;
  if (ctaCell) {
    [...ctaCell.childNodes].forEach((node) => actions.append(node.cloneNode(true)));
  }

  block.replaceChildren(h2, actions);
}
