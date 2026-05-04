/**
 * header — NVIDIA site header (C1)
 *
 * Fragment shape (content/fragments/nav.html):
 *   <p><a href="/" aria-label="NVIDIA home">NVIDIA</a></p>   — logo / wordmark
 *   <ul>…nav links with optional trailing caret span…</ul>   — primary nav
 *   <div> (utility buttons) — optional, rendered as icon buttons row
 */

import { getConfig, getMetadata } from '../../scripts/ak.js';
import { loadFragment } from '../fragment/fragment.js';

const { locale } = getConfig();
const NAV_PATH = getMetadata('header') || `${locale.prefix || ''}/fragments/nav`;

export default async function decorate(block) {
  const header = block.closest('header');
  if (!header) return;
  header.className = 'site-header';

  const fragment = await loadFragment(NAV_PATH);
  if (!fragment) return;

  const root = fragment.querySelector('.default-content') || fragment;

  // Logo: first anchor (text link or wrapping picture)
  const logoAnchor = root.querySelector('a');
  // Nav list: first <ul>
  const navList = root.querySelector('ul');

  // Build header inner
  const inner = document.createElement('div');
  inner.className = 'site-header-inner';

  // Logo
  if (logoAnchor) {
    const logo = logoAnchor.cloneNode(true);
    logo.className = 'site-logo';
    logo.setAttribute('aria-label', 'NVIDIA home');
    inner.append(logo);
  }

  // Nav
  if (navList) {
    const nav = document.createElement('nav');
    nav.className = 'site-nav';
    nav.setAttribute('aria-label', 'Primary');
    [...navList.querySelectorAll('li')].forEach((li) => {
      const a = li.querySelector('a');
      if (!a) return;
      const link = a.cloneNode(true);
      inner.append(link);
      nav.append(link);
    });
    inner.append(nav);
  }

  // Utility buttons (search, locale, account, menu)
  const utility = document.createElement('div');
  utility.className = 'site-utility';
  utility.innerHTML = `
    <button class="icon-btn" type="button" aria-label="Search"><span class="ic" aria-hidden="true">⌕</span></button>
    <button class="icon-btn" type="button" aria-label="Account"><span class="ic" aria-hidden="true">◯</span></button>
    <button class="icon-btn menu-toggle" type="button" aria-label="Menu"><span class="ic" aria-hidden="true">≡</span></button>
  `;
  inner.append(utility);

  header.replaceChildren(inner);
}
