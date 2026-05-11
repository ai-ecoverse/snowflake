/**
 * enterprise-band — dark full-bleed band with light-leak conic + gradient text fill
 *
 * Authoring rows (positional):
 *   1. Eyebrow
 *   2. Headline (gradient text fill applied via CSS)
 *   3. Body
 *   4. CTA link (wrap in *em* for ghost-on-dark secondary)
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

  const heading = titleCell?.querySelector('h2, h3') || (() => {
    const h = document.createElement('h2');
    h.textContent = text(titleCell);
    return h;
  })();
  heading.classList.add('t-title-2');

  const inner = document.createElement('div');
  inner.className = 'enterprise-inner';
  inner.innerHTML = `<p class="t-eyebrow">${eyebrow}</p>`;
  inner.append(heading);

  if (bodyText) {
    const body = document.createElement('p');
    body.className = 'body t-body-m';
    body.textContent = bodyText;
    inner.append(body);
  }

  if (ctaCell && ctaCell.querySelector('a')) {
    const actions = document.createElement('div');
    actions.className = 'actions';
    [...ctaCell.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
    inner.append(actions);
  }

  block.replaceChildren(inner);
}
