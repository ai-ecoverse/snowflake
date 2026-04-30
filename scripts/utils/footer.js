import { getMetadata, loadBlock } from '../ak.js';

export default async function loadFooter() {
  const footer = document.querySelector('footer');
  if (!footer) return;
  const meta = getMetadata('footer');
  if (meta === 'off') {
    footer.remove();
    return;
  }
  // Always use 'footer' as className so loadBlock finds blocks/footer/footer.js.
  // The fragment path is resolved inside the footer block itself.
  footer.className = 'footer';
  footer.dataset.status = 'decorated';
  loadBlock(footer);
}
