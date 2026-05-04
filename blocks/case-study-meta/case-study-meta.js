/**
 * case-study-meta (L4) — case-study fielded meta strip + excerpt + CTA
 *
 * Authoring rows:
 *   1. Section heading (h3)
 *   2. Meta fields — pipe-separated "Label: Value" pairs
 *      e.g. "Customer: Serve Robotics | Industry: Robotics | Use Case: Autonomous Delivery | Products: Jetson | Partner: —"
 *   3. Excerpt paragraph
 *   4. CTA links — wrap primary in <strong>, secondary in <em>
 */

export default async function decorate(block) {
  const rows = [...block.children];
  const [headingRow, metaRow, excerptRow, ctaRow] = rows;
  const out = [];

  // Heading
  if (headingRow) {
    const h3 = document.createElement('h3');
    h3.textContent = headingRow.firstElementChild?.textContent.trim() || '';
    out.push(h3);
  }

  // Meta fields
  if (metaRow) {
    const raw = metaRow.firstElementChild?.textContent.trim() || '';
    const pairs = raw.split('|').map((s) => s.trim()).filter(Boolean);
    if (pairs.length) {
      const dl = document.createElement('dl');
      dl.className = 'case-meta';
      pairs.forEach((pair) => {
        const sep = pair.indexOf(':');
        const label = sep > -1 ? pair.slice(0, sep).trim() : pair;
        const value = sep > -1 ? pair.slice(sep + 1).trim() : '—';
        const item = document.createElement('div');
        item.className = 'case-meta-item';
        const dt = document.createElement('dt');
        dt.className = 'case-meta-label';
        dt.textContent = label;
        const dd = document.createElement('dd');
        dd.className = 'case-meta-value';
        dd.textContent = value || '—';
        item.append(dt, dd);
        dl.append(item);
      });
      out.push(dl);
    }
  }

  // Excerpt
  if (excerptRow) {
    const p = document.createElement('p');
    p.className = 'case-excerpt';
    p.textContent = excerptRow.firstElementChild?.textContent.trim() || '';
    out.push(p);
  }

  // CTA
  if (ctaRow && ctaRow.querySelector('a')) {
    const actions = document.createElement('div');
    actions.className = 'actions';
    [...ctaRow.firstElementChild.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
    out.push(actions);
  }

  block.replaceChildren(...out);
}
