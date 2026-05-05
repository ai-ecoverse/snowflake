import { getConfig, getMetadata } from '../../scripts/ak.js';

const FOOTER_PATH = '/fragments/footer';

/**
 * Loads the static footer fragment and injects its rendered HTML directly.
 * The fragment is a self-contained HTML file with inline <style> —
 * we extract the <style> and <body> content and inject both for pixel-perfect rendering.
 */
export default async function init(el) {
  const { locale } = getConfig();
  const footerMeta = getMetadata('footer');
  const path = footerMeta || FOOTER_PATH;

  try {
    const resp = await fetch(`${locale.prefix}${path}.plain.html`);
    if (!resp.ok) throw new Error(`Failed to load footer fragment: ${resp.status}`);
    const html = await resp.text();

    // Parse the fragment
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Extract <style> if present and inject into document head
    const styles = doc.querySelectorAll('style');
    styles.forEach((style) => {
      if (!document.querySelector(`style[data-source="footer-fragment"]`)) {
        const s = document.createElement('style');
        s.setAttribute('data-source', 'footer-fragment');
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
    // Fallback: silent fail
    // eslint-disable-next-line no-console
    console.warn('Footer fragment load failed:', e);
  }
}
