/**
 * final-cta — two-column black closing CTA
 *
 * Authoring rows (positional):
 *   1. headline (h2)
 *   2. CTA link
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const grid = document.createElement('div');
  grid.className = 'home-final-cta__grid';

  const left = document.createElement('div');
  const titleCell = rows[0]?.firstElementChild;
  if (titleCell) {
    const h = document.createElement('h2');
    h.className = 'home-final-cta__title';
    h.textContent = titleCell.textContent.trim();
    left.append(h);
  }
  const ctaCell = rows[1]?.firstElementChild;
  if (ctaCell && ctaCell.querySelector('a')) {
    [...ctaCell.childNodes].forEach(n => left.append(n.cloneNode(true)));
  }

  // Decorative media
  const media = document.createElement('div');
  media.className = 'home-final-cta__media';
  media.innerHTML = `
    <div class="home-final-cta__stat">
      <div>
        <span class="home-final-cta__stat-eyebrow">Brand score</span>
        <span class="home-final-cta__stat-num">2,480</span>
        <span class="home-final-cta__stat-label">Engagement</span>
      </div>
    </div>
    <div class="home-final-cta__frame"></div>
    <a href="#" class="home-final-cta__action">Create customer journey</a>
  `;

  grid.append(left, media);
  block.replaceChildren(grid);
}
