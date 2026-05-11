/**
 * semrush-one-promo — bento promo card with offset side aside
 *
 * Authoring rows (positional):
 *   1. Cover eyebrow (small caps)
 *   2. Cover headline
 *   3. Cover body
 *   4. Primary CTA (wrap in **strong**)
 *   5. Aside eyebrow
 *   6. Aside body
 */

function row(rows, i) { return rows[i]?.firstElementChild; }
function text(cell) { return cell ? cell.textContent.trim() : ''; }

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const eyebrow = text(row(rows, 0));
  const titleCell = row(rows, 1);
  const bodyText = text(row(rows, 2));
  const ctaCell = row(rows, 3);
  const sideEyebrow = text(row(rows, 4));
  const sideBody = text(row(rows, 5));

  const heading = titleCell?.querySelector('h2, h3') || (() => {
    const h = document.createElement('h2');
    h.textContent = text(titleCell);
    return h;
  })();
  heading.classList.add('t-title-2');

  const card = document.createElement('div');
  card.className = 'so-card';

  const cover = document.createElement('article');
  cover.className = 'so-card-cover';
  cover.innerHTML = `
    <p class="stat-eyebrow t-eyebrow is-upper">${eyebrow}</p>
  `;
  cover.append(heading);
  if (bodyText) {
    const body = document.createElement('p');
    body.className = 'body t-body-m';
    body.textContent = bodyText;
    cover.append(body);
  }
  if (ctaCell && ctaCell.querySelector('a')) {
    const actions = document.createElement('div');
    actions.className = 'actions';
    [...ctaCell.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
    cover.append(actions);
  }

  const side = document.createElement('aside');
  side.className = 'so-card-side';
  side.innerHTML = `
    <p class="t-eyebrow">${sideEyebrow}</p>
    <p class="body t-body-m">${sideBody}</p>
  `;

  card.append(cover, side);
  block.replaceChildren(card);
}
