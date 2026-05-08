/**
 * bc-conversations — Diagram section showing Brand Concierge at the center.
 *
 * Authoring rows (positional):
 *   1. h2 title
 *   2. body text
 *   3. CTA link (plain <a>)
 *   4. Center label text (e.g. "Brand Concierge")
 *   5. Leaf 1 label
 *   6. Leaf 2 label
 *   7. Leaf 3 label
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const text = (i) => rows[i]?.querySelector('div')?.textContent?.trim() || '';

  const copy = document.createElement('div');
  copy.className = 'bc-conversations__copy';

  const title = document.createElement('h2');
  title.className = 'bc-conversations__title';
  title.textContent = text(0);
  copy.appendChild(title);

  const body = document.createElement('p');
  body.className = 'bc-conversations__body';
  body.textContent = text(1);
  copy.appendChild(body);

  const ctaCell = rows[2]?.querySelector('div');
  const ctaLink = ctaCell?.querySelector('a');
  if (ctaLink) {
    ctaLink.className = 'bc-conversations__cta';
    copy.appendChild(ctaLink.cloneNode(true));
  }

  // Diagram
  const diagram = document.createElement('div');
  diagram.className = 'bc-conversations__diagram';

  const prompt = document.createElement('div');
  prompt.className = 'bc-conv-prompt';
  prompt.textContent = '✦ Ask me anything about your brand';
  diagram.appendChild(prompt);

  const center = document.createElement('div');
  center.className = 'bc-conv-center';
  center.textContent = text(3) || 'Brand Concierge';
  diagram.appendChild(center);

  const leaves = document.createElement('div');
  leaves.className = 'bc-conv-leaves';
  [text(4) || 'Marketing', text(5) || 'Product', text(6) || 'Support'].forEach((label) => {
    const leaf = document.createElement('div');
    leaf.className = 'bc-conv-leaf';
    leaf.textContent = label;
    leaves.appendChild(leaf);
  });
  diagram.appendChild(leaves);

  const grid = document.createElement('div');
  grid.className = 'bc-conversations__grid';
  grid.appendChild(copy);
  grid.appendChild(diagram);

  block.innerHTML = '';
  block.appendChild(grid);
}
