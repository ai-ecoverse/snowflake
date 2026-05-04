/**
 * footer — NVIDIA mega-footer (C2)
 *
 * Fragment shape (content/fragments/footer.html):
 *   Multiple <div> columns in default-content:
 *     - Link columns: <h3> heading + <ul> of links
 *     - Subscribe column: <h3> + <p> description + <form>
 *   Footer bottom row inferred from last elements.
 */

import { getConfig, getMetadata } from '../../scripts/ak.js';
import { loadFragment } from '../fragment/fragment.js';

const { locale } = getConfig();

function resolveFragmentPath(name) {
  // Try metadata first (set by the metadata block)
  const meta = getMetadata(name);
  if (meta) return meta;
  // Derive from current page path: /nvidia/page → /nvidia/fragments/<name>
  const segs = window.location.pathname.split('/').filter(Boolean);
  if (segs.length >= 1 && segs[0] !== 'fragments') {
    return `/${segs[0]}/fragments/${name === 'header' ? 'nav' : name}`;
  }
  return `${locale.prefix || ''}/fragments/${name === 'header' ? 'nav' : name}`;
}

export default async function decorate(block) {
  const footer = block.closest('footer') || block;
  footer.className = 'site-footer';

  const footerPath = footer.dataset.fragmentPath || resolveFragmentPath('footer');
  let fragment;
  try {
    fragment = await loadFragment(footerPath);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(`footer: failed to load ${footerPath}`, e);
    return;
  }
  if (!fragment) return;

  const root = fragment.querySelector('.default-content') || fragment;
  const cols = [...root.children].filter((c) => c.tagName === 'DIV' || c.tagName === 'UL' || c.tagName === 'P');

  const container = document.createElement('div');
  container.className = 'container';

  const columns = document.createElement('div');
  columns.className = 'footer-columns';

  // Build columns from fragment structure
  const headings = root.querySelectorAll('h3, h2');
  headings.forEach((h) => {
    const col = document.createElement('div');
    col.className = 'footer-column';
    const title = document.createElement('h3');
    title.textContent = h.textContent;
    col.append(title);
    // Collect following siblings until next heading
    let sib = h.nextElementSibling;
    while (sib && !['H2', 'H3'].includes(sib.tagName)) {
      col.append(sib.cloneNode(true));
      sib = sib.nextElementSibling;
    }
    columns.append(col);
  });

  // Footer bottom
  const bottom = document.createElement('div');
  bottom.className = 'footer-bottom';
  bottom.innerHTML = `
    <span class="footer-copyright">© ${new Date().getFullYear()} NVIDIA Corporation</span>
    <div class="footer-legal">
      <a href="#">Privacy Policy</a>
      <a href="#">Manage Cookies</a>
      <a href="#">Terms of Service</a>
      <a href="#">Accessibility</a>
    </div>
    <div class="footer-social" aria-label="NVIDIA on social media">
      <a class="icon-btn" href="https://www.linkedin.com/company/nvidia" aria-label="LinkedIn">in</a>
      <a class="icon-btn" href="https://twitter.com/nvidia" aria-label="X / Twitter">𝕏</a>
      <a class="icon-btn" href="https://www.youtube.com/user/nvidia" aria-label="YouTube">▶</a>
    </div>
  `;

  container.append(columns, bottom);
  footer.replaceChildren(container);
}
