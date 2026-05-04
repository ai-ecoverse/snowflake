import { getMetadata, loadBlock } from '../ak.js';

export default async function loadFooter() {
  const footer = document.querySelector('footer');
  if (!footer) return;
  const meta = getMetadata('footer');
  if (meta === 'off') {
    footer.remove();
    return;
  }
  footer.className = 'footer';
  // Store the resolved path as a data attribute so the block can read it
  if (meta && meta.startsWith('/')) {
    footer.dataset.fragmentPath = meta;
  } else {
    // Derive from page URL
    const segs = window.location.pathname.split('/').filter(Boolean);
    if (segs.length >= 1) {
      footer.dataset.fragmentPath = `/${segs[0]}/fragments/footer`;
    }
  }
  loadBlock(footer);
}
