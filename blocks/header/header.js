import { getConfig, getMetadata } from '../../scripts/ak.js';
import { loadFragment } from '../fragment/fragment.js';

const { locale } = getConfig();
const HEADER_PATH = '/fragments/nav';

const SEARCH_SVG = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
  <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.6"/>
  <path d="M11 11l3 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
</svg>`;

const MENU_SVG = `<svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
  <path d="M1 1h16M1 7h16M1 13h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
</svg>`;

const CLOSE_SVG = `✕`;

/**
 * Build the sticky header nav from the loaded fragment.
 * Fragment structure (EDS default-content in <main>):
 *   <p><a ...><picture>…</picture></a></p>   — logo
 *   <ul>…</ul>                                — nav links
 *   <p><a href="#engagement">…</a></p>        — CTA
 */
function buildHeader(el, fragment) {
  if (!fragment) return;

  const root = fragment.querySelector('.default-content-wrapper') || fragment;

  // Logo
  const logoPic = root.querySelector('picture, img');
  const logoAnchor = logoPic?.closest('a') || root.querySelector('a');

  // Nav list
  const navList = root.querySelector('ul');

  // CTA — last anchor not inside logo or nav
  const allAnchors = [...root.querySelectorAll('a')];
  const ctaAnchor = allAnchors.find((a) => {
    const pic = a.querySelector('picture, img');
    return !pic && !a.closest('ul');
  });

  // ── Build inner ──
  const inner = document.createElement('div');
  inner.className = 'ds-container ds-header-inner';

  // Logo
  if (logoAnchor) {
    const logoWrap = document.createElement('a');
    logoWrap.className = 'ds-sitemark';
    logoWrap.href = logoAnchor.href || 'https://www.thechannelco.com/';
    logoWrap.rel = 'noopener';
    logoWrap.target = '_blank';
    logoWrap.setAttribute('aria-label', 'The Channel Company');

    const picClone = logoPic?.closest('picture')?.cloneNode(true) || logoPic?.cloneNode(true);
    if (picClone) {
      const img = picClone.querySelector ? picClone.querySelector('img') || picClone : picClone;
      img.className = 'ds-sitemark-mark';
      img.removeAttribute('width');
      img.removeAttribute('height');
      img.setAttribute('width', '116');
      img.setAttribute('height', '24');
    }
    if (picClone) logoWrap.append(picClone);
    inner.append(logoWrap);
  }

  // Nav
  if (navList) {
    const nav = document.createElement('nav');
    nav.className = 'ds-nav';
    nav.setAttribute('aria-label', 'Primary');
    [...navList.querySelectorAll('a')].forEach((a) => {
      const link = document.createElement('a');
      link.className = 'ds-nav-link';
      link.href = a.href;
      link.textContent = a.textContent.trim();
      nav.append(link);
    });
    inner.append(nav);
  }

  // Actions: search + hamburger
  const actions = document.createElement('div');
  actions.className = 'ds-header-actions';

  const searchForm = document.createElement('form');
  searchForm.className = 'ds-search-form';
  searchForm.action = '/search/node';
  searchForm.setAttribute('role', 'search');
  searchForm.innerHTML = SEARCH_SVG;

  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.name = 'keys';
  searchInput.className = 'ds-search-input';
  searchInput.placeholder = 'Search articles';
  searchInput.setAttribute('aria-label', 'Search articles');
  searchForm.append(searchInput);
  actions.append(searchForm);

  const menuBtn = document.createElement('button');
  menuBtn.className = 'ds-menu-toggle';
  menuBtn.type = 'button';
  menuBtn.setAttribute('aria-label', 'Open menu');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-controls', 'ds-drawer');
  menuBtn.innerHTML = MENU_SVG;
  actions.append(menuBtn);

  inner.append(actions);
  el.append(inner);

  // ── Build mobile drawer (injected into body) ──
  const drawerNavItems = navList
    ? [...navList.querySelectorAll('a')].map((a) => ({ href: a.href, text: a.textContent.trim() }))
    : [];

  const ctaHref = ctaAnchor?.href || '#engagement';
  const ctaText = ctaAnchor?.textContent.trim() || 'Subscribe to the newsletter';

  const backdrop = document.createElement('div');
  backdrop.className = 'ds-drawer-backdrop';
  backdrop.dataset.open = 'false';
  backdrop.id = 'ds-drawer-backdrop';
  backdrop.setAttribute('aria-hidden', 'true');

  const drawer = document.createElement('aside');
  drawer.className = 'ds-drawer';
  drawer.dataset.open = 'false';
  drawer.id = 'ds-drawer';
  drawer.setAttribute('aria-hidden', 'true');
  drawer.setAttribute('aria-labelledby', 'ds-drawer-title');
  drawer.setAttribute('role', 'dialog');

  drawer.innerHTML = `
    <div class="ds-drawer-head">
      <span class="ds-sitemark" id="ds-drawer-title" style="font-family:var(--display);font-weight:700;font-size:18px;color:var(--ink);">Enterprise Tech Provider</span>
      <button class="ds-drawer-close" type="button" aria-label="Close menu" id="ds-drawer-close">Close ${CLOSE_SVG}</button>
    </div>
    <div class="ds-drawer-body">
      <form class="ds-drawer-search" action="/search/node" role="search">
        ${SEARCH_SVG}
        <input type="search" name="keys" placeholder="Search articles" aria-label="Search articles">
      </form>
      <nav class="ds-drawer-nav" aria-label="Primary (mobile)">
        <span class="ds-drawer-eyebrow">By Topic</span>
        ${drawerNavItems.map((item) => `<a class="ds-drawer-link" href="${item.href}">${item.text}</a>`).join('')}
      </nav>
    </div>
    <div class="ds-drawer-foot">
      <a class="ds-button-primary" href="${ctaHref}">
        <span class="ds-btn-lab">${ctaText}</span>
        <span class="ds-btn-arrow" aria-hidden="true">&rarr;</span>
      </a>
      <small>Produced by The Channel Company &middot; Sponsored by Dell Technologies</small>
    </div>
  `;

  document.body.append(backdrop, drawer);

  // ── Drawer open/close logic ──
  let isOpen = false;
  let lastFocus = null;

  const closeBtn = drawer.querySelector('#ds-drawer-close');

  function open() {
    if (isOpen) return;
    isOpen = true;
    lastFocus = document.activeElement;
    drawer.dataset.open = 'true';
    drawer.setAttribute('aria-hidden', 'false');
    backdrop.dataset.open = 'true';
    backdrop.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('ds-drawer-open');
    setTimeout(() => closeBtn?.focus(), 60);
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    drawer.dataset.open = 'false';
    drawer.setAttribute('aria-hidden', 'true');
    backdrop.dataset.open = 'false';
    backdrop.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('ds-drawer-open');
    if (lastFocus?.focus) lastFocus.focus();
  }

  menuBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (isOpen) close();
    else open();
  });

  closeBtn?.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen) close(); });

  // Close drawer when a nav link is tapped
  drawer.querySelectorAll('a[href]').forEach((a) => {
    a.addEventListener('click', () => setTimeout(close, 60));
  });

  // Close at desktop breakpoint
  const mq = window.matchMedia('(min-width: 1400px)');
  if (mq.addEventListener) mq.addEventListener('change', (e) => { if (e.matches) close(); });
}

/**
 * loads and decorates the header
 * @param {Element} el The header element
 */
export default async function init(el) {
  const headerMeta = getMetadata('header');
  const path = headerMeta || HEADER_PATH;
  try {
    const fragment = await loadFragment(`${locale.prefix}${path}`);
    buildHeader(el, fragment);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Header block failed:', e);
  }
}
