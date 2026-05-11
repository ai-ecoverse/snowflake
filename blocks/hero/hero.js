/**
 * hero — pinned cinematic hero (static mosaic + headline + search + CTAs)
 *
 * Authoring rows (positional):
 *   1. Eyebrow text
 *   2. <h1> headline (use **word** for the trial-blue accent span)
 *   3. Body paragraph
 *   4. Search button label + href: "Get insights" / /signup/
 *   5. CTA links — wrap primary in **strong**, secondary in *em*
 */

function row(rows, i) { return rows[i]?.firstElementChild; }
function text(cell) { return cell ? cell.textContent.trim() : ''; }

function buildMosaic() {
  const wrap = document.createElement('div');
  wrap.className = 'hero-mosaic-wrap';
  wrap.setAttribute('aria-hidden', 'true');
  const mosaic = document.createElement('div');
  mosaic.className = 'hero-mosaic';
  for (let c = 0; c < 5; c += 1) {
    const col = document.createElement('div');
    col.className = 'mosaic-col';
    for (let r = 0; r < 3; r += 1) {
      const card = document.createElement('div');
      card.className = 'mosaic-card';
      col.append(card);
    }
    mosaic.append(col);
  }
  wrap.append(mosaic);
  return wrap;
}

function buildSearch(cell) {
  if (!cell) return null;
  const link = cell.querySelector('a');
  const search = document.createElement('div');
  search.className = 'hero-search';
  search.setAttribute('role', 'search');
  search.innerHTML = `
    <span class="geo-pill" aria-label="Region: United States"><span class="flag" aria-hidden="true"></span>US</span>
    <input type="text" placeholder="Enter your website" aria-label="Enter your website">
  `;
  if (link) {
    link.classList.add('hero-search-cta');
    search.append(link);
  }
  return search;
}

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

  const eyebrowText = text(row(rows, 0));
  const titleCell = row(rows, 1);
  const bodyText = text(row(rows, 2));
  const searchCell = row(rows, 3);
  const ctaCell = row(rows, 4);

  const heading = titleCell?.querySelector('h1, h2, h3') || (() => {
    const h = document.createElement('h1');
    h.textContent = text(titleCell);
    return h;
  })();
  heading.classList.add('hero-title', 't-title-1');
  transformAccents(heading);

  const sticky = document.createElement('div');
  sticky.className = 'hero-sticky';

  const text$ = document.createElement('div');
  text$.className = 'hero-text';
  text$.setAttribute('data-ta-group', '');

  if (eyebrowText) {
    const eb = document.createElement('div');
    eb.className = 'hero-eyebrow';
    eb.setAttribute('data-ta-unit', '');
    eb.innerHTML = `<span class="glyph" aria-hidden="true">A</span><span class="wordmark-eyebrow">${eyebrowText}</span>`;
    text$.append(eb);
  }

  heading.setAttribute('data-ta', '');
  text$.append(heading);

  if (bodyText) {
    const body = document.createElement('p');
    body.className = 'hero-body t-body-m';
    body.setAttribute('data-ta', '');
    body.textContent = bodyText;
    text$.append(body);
  }

  const search = buildSearch(searchCell);
  if (search) {
    search.setAttribute('data-ta-unit', '');
    text$.append(search);
  }

  if (ctaCell && ctaCell.querySelector('a')) {
    const actions = document.createElement('div');
    actions.className = 'hero-ctas';
    actions.setAttribute('data-ta-unit', '');
    [...ctaCell.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
    text$.append(actions);
  }

  sticky.append(buildMosaic(), text$);
  block.replaceChildren(sticky);
}
