/**
 * page-hero — Full-width dark hero with eyebrow, h1, subhead, and meta stat strip.
 * Authoring rows:
 *   1: Eyebrow text (mono, accent color)
 *   2: h1 headline
 *   3: Subhead paragraph
 *   4: Meta strip — pipe-separated stat items e.g. "25 blocks | 5 tiers | 15 built | 10 v0 drafts"
 */
export default async function decorate(block) {
  const rows = [...block.children];

  // Row 1 — eyebrow
  const eyebrow = document.createElement('p');
  eyebrow.className = 'page-hero-eyebrow';
  eyebrow.textContent = rows[0]?.firstElementChild?.textContent.trim() ?? '';

  // Row 2 — h1 headline
  const h1 = document.createElement('h1');
  h1.textContent = rows[1]?.firstElementChild?.textContent.trim() ?? '';

  // Row 3 — subhead
  const subhead = document.createElement('p');
  subhead.className = 'page-hero-subhead';
  subhead.textContent = rows[2]?.firstElementChild?.textContent.trim() ?? '';

  // Row 4 — meta strip
  const metaRaw = rows[3]?.firstElementChild?.textContent.trim() ?? '';
  const meta = document.createElement('div');
  meta.className = 'page-hero-meta';
  if (metaRaw) {
    metaRaw.split(' | ').forEach((item) => {
      const span = document.createElement('span');
      // Wrap leading number in <strong>
      span.innerHTML = item.replace(/^(\d[\d,.+x%]*)/, '<strong>$1</strong>');
      meta.append(span);
    });
  }

  block.replaceChildren(eyebrow, h1, subhead, meta);
}
