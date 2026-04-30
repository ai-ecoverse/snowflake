import { getConfig, getMetadata } from '../../scripts/ak.js';
import { loadFragment } from '../fragment/fragment.js';

const FOOTER_PATH = '/fragments/footer';

/**
 * footer — The Road Home site footer
 *
 * Fragment shape (footer.html):
 *   Columns are direct children of the wrapping <div> inside <main>.
 *   - Lockup col: contains <picture>/<img>, brand copy, phone <ul>
 *   - Link cols: each has a heading <p> + <ul> of links
 *   - Last <p> siblings at end: copyright line and legal links
 */
export default async function init(el) {
  const { locale } = getConfig();
  const footerMeta = getMetadata('footer');
  const path = footerMeta || FOOTER_PATH;

  let fragment;
  try {
    fragment = await loadFragment(`${locale.prefix}${path}`);
  } catch (e) {
    throw Error(e);
  }

  const wrapper = fragment.querySelector('main > div') || fragment;
  const cols = [...wrapper.children].filter((c) => c.tagName === 'DIV');

  const lockupCol  = cols.find((c) => c.querySelector('picture, img'));
  const linkCols   = cols.filter((c) => c !== lockupCol);

  // Copyright + legal are bare <p> elements (not in divs) at the end of wrapper
  const bareParagraphs = [...wrapper.children].filter((c) => c.tagName === 'P');

  const footer = document.createElement('footer');
  footer.className = 'site';

  const inner = document.createElement('div');
  inner.className = 'footer-inner';

  const top = document.createElement('div');
  top.className = 'footer-top';

  // Brand column
  if (lockupCol) {
    const brand = document.createElement('div');
    brand.className = 'footer-brand';
    const img = lockupCol.querySelector('picture, img');
    if (img) brand.append(img.cloneNode(true));
    const desc = lockupCol.querySelector('p:not(:first-child)');
    if (desc) brand.append(desc.cloneNode(true));

    // Phone list
    const phoneUl = lockupCol.querySelector('ul');
    if (phoneUl) {
      const phonesDiv = document.createElement('div');
      phonesDiv.className = 'footer-phones';
      [...phoneUl.querySelectorAll('li')].forEach((li) => {
        const row = document.createElement('div');
        row.className = 'footer-phone-row';
        // Format: "Label · <a href>"
        const text = li.childNodes[0]?.textContent?.replace('·', '').trim() || '';
        const a = li.querySelector('a');
        if (text) {
          const label = document.createElement('span');
          label.className = 'l';
          label.textContent = text;
          row.append(label);
        }
        if (a) row.append(a.cloneNode(true));
        phonesDiv.append(row);
      });
      brand.append(phonesDiv);
    }

    top.append(brand);
  }

  // Link columns
  linkCols.forEach((col) => {
    const colEl = document.createElement('div');
    colEl.className = 'footer-col';
    const heading = col.querySelector('p');
    if (heading) {
      const h = document.createElement('h4');
      h.textContent = heading.textContent;
      colEl.append(h);
    }
    const ul = col.querySelector('ul');
    if (ul) colEl.append(ul.cloneNode(true));
    top.append(colEl);
  });

  inner.append(top);

  // Footer bottom
  const bottom = document.createElement('div');
  bottom.className = 'footer-bottom';
  bareParagraphs.forEach((p) => bottom.append(p.cloneNode(true)));
  inner.append(bottom);

  footer.append(inner);
  el.replaceChildren(footer);
}
