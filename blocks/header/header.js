import { getConfig, getMetadata } from '../../scripts/ak.js';

const HEADER_PATH = '/fragments/nav';

/**
 * Loads the static header fragment and injects its rendered HTML directly.
 * The fragment is a self-contained HTML file with inline <style> —
 * we extract the <style> and <body> content and inject both for pixel-perfect rendering.
 */
export default async function init(el) {
  const { locale } = getConfig();
  const headerMeta = getMetadata('header');
  const path = headerMeta || HEADER_PATH;

  try {
    const resp = await fetch(`${locale.prefix}${path}.plain.html`);
    if (!resp.ok) throw new Error(`Failed to load header fragment: ${resp.status}`);
    const html = await resp.text();

    // Parse the fragment
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Extract <style> if present and inject into document head
    const styles = doc.querySelectorAll('style');
    styles.forEach((style) => {
      if (!document.querySelector(`style[data-source="header-fragment"]`)) {
        const s = document.createElement('style');
        s.setAttribute('data-source', 'header-fragment');
        s.textContent = style.textContent;
        document.head.append(s);
      }
    });

    // Inject body content directly
    const body = doc.body;
    if (body) {
      el.innerHTML = body.innerHTML;
    }
  } catch (e) {
    // Fallback: silent fail — page still works without chrome
    // eslint-disable-next-line no-console
    console.warn('Header fragment load failed:', e);
  }
}
