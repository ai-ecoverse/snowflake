import { getConfig, getMetadata } from '../../scripts/ak.js';
import { loadFragment } from '../fragment/fragment.js';

const { locale } = getConfig();
const HEADER_PATH = '/fragments/nav';

/**
 * Clark County header — brick-red bar with logo, nav links, and search.
 *
 * Fragment shape expected (structural identification — no classes survive EDS):
 *   <p><a href="/"><picture|img></a></p>   — logo (first picture/img)
 *   <ul>…</ul>                              — nav links (first <ul>)
 *   <p>Search</p>                           — search label (last <p> without an anchor)
 */
function buildNav(el, fragment) {
  if (!fragment) return;
  const root = fragment.querySelector('.default-content') || fragment;

  // Logo: first <picture> or <img>, preserve wrapping <a>
  const picture = root.querySelector('picture, img');
  const logoAnchor = picture ? picture.closest('a') : null;

  // Nav list: first <ul>
  const navList = root.querySelector('ul');

  // Build header structure
  const inner = document.createElement('div');
  inner.className = 'header-inner';

  // Logo
  if (logoAnchor) {
    const logoWrap = document.createElement('div');
    logoWrap.className = 'header-logo';
    const link = document.createElement('a');
    link.href = logoAnchor.href || '/';
    link.setAttribute('aria-label', 'Clark County Home');
    const img = picture.cloneNode(true);
    link.append(img);
    logoWrap.append(link);
    inner.append(logoWrap);
  }

  // Nav links
  if (navList) {
    const nav = document.createElement('nav');
    nav.className = 'header-nav';
    nav.setAttribute('aria-label', 'Primary navigation');
    [...navList.querySelectorAll('a')].forEach((a) => {
      const link = document.createElement('a');
      link.href = a.href;
      link.textContent = a.textContent.trim();
      nav.append(link);
    });
    inner.append(nav);
  }

  // Search button
  const actions = document.createElement('div');
  actions.className = 'header-actions';
  const searchBtn = document.createElement('button');
  searchBtn.className = 'header-search-btn';
  searchBtn.setAttribute('aria-label', 'Search Clark County');
  searchBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><span>Search</span>`;
  actions.append(searchBtn);

  // Hamburger (mobile)
  const hamburger = document.createElement('button');
  hamburger.className = 'header-hamburger';
  hamburger.setAttribute('aria-label', 'Open navigation menu');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
  actions.append(hamburger);
  inner.append(actions);

  el.append(inner);

  // Mobile nav overlay
  if (navList) {
    const mobileNav = document.createElement('nav');
    mobileNav.className = 'mobile-nav';
    mobileNav.setAttribute('aria-label', 'Mobile navigation');
    [...navList.querySelectorAll('a')].forEach((a) => {
      const link = document.createElement('a');
      link.href = a.href;
      link.textContent = a.textContent.trim();
      mobileNav.append(link);
    });
    el.append(mobileNav);

    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }
}

export default async function init(el) {
  const headerMeta = getMetadata('header');
  const path = headerMeta || HEADER_PATH;
  try {
    const fragment = await loadFragment(`${locale.prefix}${path}`);
    buildNav(el, fragment);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Header load failed:', e);
  }
}
