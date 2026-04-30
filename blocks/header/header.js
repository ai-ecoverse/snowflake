import { getConfig, getMetadata } from '../../scripts/ak.js';
import { loadFragment } from '../fragment/fragment.js';

const { locale } = getConfig();

const FRAGMENT_NAME = 'nav';

/**
 * Derive the nav fragment path, branch-aware.
 * DA normalises our "header" metadata key to "nav" and strips /fragments/ from the value.
 * Fall back to deriving the branch from the page pathname so branch-scoped pages always
 * load the right fragment even when metadata is missing or rewritten.
 */
function getNavPath() {
  // DA stores the key as "nav" (the fragment filename) — try that first
  const fromMeta = getMetadata('nav') || getMetadata('header');
  if (fromMeta) {
    // DA strips /fragments/ from the path; reconstruct it if needed
    return fromMeta.includes('/fragments/') ? fromMeta : fromMeta.replace(
      /^(\/[^/]+)(\/nav)?$/,
      (_, prefix) => `${prefix}/fragments/${FRAGMENT_NAME}`,
    );
  }
  // Derive branch from pathname: /6f0c0a99/faq → prefix = /6f0c0a99
  const segments = window.location.pathname.split('/').filter(Boolean);
  const prefix = segments.length > 1 ? `/${segments[0]}` : '';
  return `${prefix}/fragments/${FRAGMENT_NAME}`;
}

/**
 * header — The Road Home site nav
 *
 * Fragment shape (nav.html):
 *   1. <picture>/<a><picture> — logo (first picture in fragment)
 *   2. <ul> — nav links
 *   3. Last <a> not inside logo or nav — ghost CTA (Find a Shelter)
 *   4. <strong><a> — primary CTA (Donate)
 */
export default async function init(el) {
  const path = getNavPath();

  let fragment;
  try {
    fragment = await loadFragment(`${locale.prefix}${path}`);
  } catch (e) {
    throw Error(e);
  }

  const root = fragment.querySelector('main') || fragment;

  // Logo: first <picture>; preserve wrapping <a>
  const picture = root.querySelector('picture, img');
  const logoAnchor = picture?.closest('a');
  const logoEl = logoAnchor || picture;

  // Nav list: first <ul>
  const list = root.querySelector('ul');

  // All anchors for CTA detection (exclude logo + nav)
  const allAnchors = [...root.querySelectorAll('a')];
  const ghostCta = allAnchors.find((a) => (
    !a.querySelector('picture, img') && !a.closest('ul') && !a.closest('strong') && a !== logoAnchor
  ));
  const primaryCta = allAnchors.find((a) => a.closest('strong'));

  // Build nav
  const nav = document.createElement('nav');
  nav.className = 'topnav';

  const inner = document.createElement('div');
  inner.className = 'nav-inner';

  if (logoEl) {
    const logoWrap = document.createElement('a');
    logoWrap.className = 'nav-logo';
    logoWrap.href = logoAnchor?.href || '/';
    logoWrap.setAttribute('aria-label', 'Home');
    if (picture) logoWrap.append(picture.cloneNode(true));
    inner.append(logoWrap);
  }

  if (list) {
    const links = document.createElement('div');
    links.className = 'nav-links';
    [...list.querySelectorAll('a')].forEach((a) => {
      const link = a.cloneNode(true);
      links.append(link);
    });
    inner.append(links);
  }

  const right = document.createElement('div');
  right.className = 'nav-right';

  if (ghostCta) {
    const ghost = ghostCta.cloneNode(true);
    ghost.className = 'btn-ghost';
    right.append(ghost);
  }
  if (primaryCta) {
    const primary = primaryCta.cloneNode(true);
    primary.className = 'btn';
    right.append(primary);
  }

  inner.append(right);
  nav.append(inner);
  el.replaceChildren(nav);
}
