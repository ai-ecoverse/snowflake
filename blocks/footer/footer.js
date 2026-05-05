import { getConfig, loadStyle } from '../../scripts/ak.js';

/**
 * Loads the static footer HTML file from the code repo and injects it directly.
 * The file is served as a static asset from GitHub — no EDS content processing.
 */
export default async function init(el) {
  const { codeBase } = getConfig();

  try {
    const resp = await fetch(`${codeBase}/fragments/footer.html`);
    if (!resp.ok) throw new Error(`Footer fetch failed: ${resp.status}`);
    const html = await resp.text();

    // Parse and inject only the body content
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Extract style and inject to head
    const style = doc.querySelector('style');
    if (style && !document.querySelector('style[data-source="footer"]')) {
      const s = document.createElement('style');
      s.setAttribute('data-source', 'footer');
      s.textContent = style.textContent;
      document.head.append(s);
    }

    // Inject body content
    el.innerHTML = doc.body.innerHTML;
  } catch (e) {
    console.warn('Footer load failed:', e);
  }
}
