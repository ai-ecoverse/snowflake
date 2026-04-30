import { getConfig, getMetadata } from '../../scripts/ak.js';
import { loadFragment } from '../fragment/fragment.js';

const { locale } = getConfig();

const HEADER_PATH = '/fragments/nav';

/**
 * Builds the nav chrome structure from raw fragment default-content.
 * Identifies elements structurally (not by class — EDS strips classes from
 * non-block default content in fragments).
 *
 * Fragment shape expected:
 *   <p><a href="/"><picture|img></a></p>   — logo
 *   <ul>…</ul>                              — nav links
 *   <p><a href="…">Find a Shelter</a></p>  — ghost CTA
 *   <p><a href="…">Donate</a></p>          — primary CTA
 */
function buildNav(el, fragment) {
  const root = fragment.querySelector('.default-content') || fragment;

  // Logo: first anchor wrapping a picture or img
  const logoPicture = root.querySelector('picture, img');
  const logoAnchor = logoPicture ? logoPicture.closest('a') : null;

  // Nav list: first <ul>
  const navList = root.querySelector('ul');

  // CTAs: anchors NOT inside the logo and NOT inside the nav list
  const allAnchors = [...root.querySelectorAll('a')];
  const ctaAnchors = allAnchors.filter((a) => (
    a !== logoAnchor
    && !a.querySelector('picture, img')
    && !a.closest('ul')
  ));

  // Build nav structure
  const nav = document.createElement('div');
  nav.className = 'header-nav';

  // Logo
  if (logoAnchor) {
    const logoWrap = document.createElement('a');
    logoWrap.className = 'header-logo';
    logoWrap.href = logoAnchor.href || '/';
    logoWrap.setAttribute('aria-label', 'The Road Home');
    const img = logoPicture.cloneNode(true);
    logoWrap.append(img);
    nav.append(logoWrap);
  }

  // Nav links
  if (navList) {
    const links = document.createElement('nav');
    links.className = 'header-links';
    [...navList.querySelectorAll('a')].forEach((a) => {
      const link = document.createElement('a');
      link.href = a.href;
      link.textContent = a.textContent.trim();
      links.append(link);
    });
    nav.append(links);
  }

  // Action buttons (ghost + primary CTA)
  if (ctaAnchors.length) {
    const actions = document.createElement('div');
    actions.className = 'header-actions';
    ctaAnchors.forEach((a, i) => {
      const btn = document.createElement('a');
      btn.href = a.href;
      btn.textContent = a.textContent.trim();
      if (i === ctaAnchors.length - 1) {
        // Last anchor = primary CTA (Donate)
        btn.className = 'btn btn-primary';
      } else {
        btn.className = 'btn-ghost';
      }
      actions.append(btn);
    });
    nav.append(actions);
  }

  el.append(nav);
}

/**
 * loads and decorates the header
 * @param {Element} el The header element
 */
export default async function init(el) {
  const headerMeta = getMetadata('header-path');
  const path = headerMeta || HEADER_PATH;
  try {
    const fragment = await loadFragment(`${locale.prefix}${path}`);
    buildNav(el, fragment);
  } catch (e) {
    throw Error(e);
  }
}
