/**
 * closing-cta — large centered closing CTA with optional accent word
 *
 * Authoring rows (positional):
 *   1. Headline — use **word** to apply the trial-blue accent
 *   2. Body
 *   3. CTA link (wrap in **strong** for primary)
 */

function row(rows, i) { return rows[i]?.firstElementChild; }
function text(cell) { return cell ? cell.textContent.trim() : ''; }

function transformAccents(h) {
  if (!h) return;
  h.querySelectorAll('strong').forEach((s) => {
    const span = document.createElement('span');
    span.className = 'accent';
    span.append(...s.childNodes);
    s.replaceWith(span);
  });
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const titleCell = row(rows, 0);
  const bodyText = text(row(rows, 1));
  const ctaCell = row(rows, 2);

  const heading = titleCell?.querySelector('h2, h3') || (() => {
    const h = document.createElement('h2');
    h.textContent = text(titleCell);
    return h;
  })();
  heading.classList.add('t-title-1', 'is-upper');
  transformAccents(heading);

  const inner = document.createElement('div');
  inner.className = 'closing-inner';
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
