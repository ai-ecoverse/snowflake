import { getConfig, getMetadata } from '../../scripts/ak.js';
import { loadFragment } from '../fragment/fragment.js';

const FOOTER_PATH = '/fragments/footer';

/**
 * Clark County footer — two-tier: gray top (brand + contact + links + newsletter)
 * and brick-red bottom (copyright + accolade).
 *
 * Fragment shape expected (structural identification):
 *   Section 1 (top tier):
 *     - First div with <picture|img> = brand column (logo + tagline + social links)
 *     - Div with multiple <p> not containing <ul> = contact column
 *     - Div with <ul> = quick links column
 *     - Div containing <form> or last div = newsletter/stay-informed
 *   Section 2 (bottom tier):
 *     - First <p> = copyright
 *     - Remaining content = accolade
 */
function buildFooter(el, fragment) {
  if (!fragment) return;

  const sections = fragment.querySelectorAll(':scope > .section, :scope > div');

  // Top tier
  const topSection = sections[0];
  const bottomSection = sections[1];

  const footerTop = document.createElement('div');
  footerTop.className = 'footer-top';

  const topInner = document.createElement('div');
  topInner.className = 'footer-top-inner';

  if (topSection) {
    const defaultContent = topSection.querySelector('.default-content') || topSection;
    // Clone all content from top section
    [...defaultContent.children].forEach((child) => {
      topInner.append(child.cloneNode(true));
    });
  }

  footerTop.append(topInner);
  el.append(footerTop);

  // Bottom tier
  const footerBottom = document.createElement('div');
  footerBottom.className = 'footer-bottom';

  const bottomInner = document.createElement('div');
  bottomInner.className = 'footer-bottom-inner';

  if (bottomSection) {
    const defaultContent = bottomSection.querySelector('.default-content') || bottomSection;
    [...defaultContent.children].forEach((child) => {
      bottomInner.append(child.cloneNode(true));
    });
  }

  footerBottom.append(bottomInner);
  el.append(footerBottom);
}

export default async function init(el) {
  const { locale } = getConfig();
  const footerMeta = getMetadata('footer');
  const path = footerMeta || FOOTER_PATH;
  try {
    const fragment = await loadFragment(`${locale.prefix}${path}`);
    buildFooter(el, fragment);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Footer load failed:', e);
  }
}
