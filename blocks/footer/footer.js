import { getConfig, getMetadata } from '../../scripts/ak.js';
import { loadFragment } from '../fragment/fragment.js';

const { locale } = getConfig();
const FOOTER_PATH = '/fragments/footer';

// Social icon SVGs (keyed by aria-label substring)
const SOCIAL_ICONS = {
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" width="16" height="16"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" width="16" height="16"><rect x="2" y="5" width="20" height="14" rx="3"/><path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none"/></svg>`,
  twitter: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="16" height="16"><path d="M17.7 3h3l-6.6 7.6L22 21h-6.2l-4.9-6.4L5.3 21H2.3l7.1-8.1L2 3h6.3l4.4 5.8L17.7 3zm-1.1 16h1.7L7.5 5H5.7l10.9 14z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="16" height="16"><rect x="3" y="9" width="4" height="12"/><circle cx="5" cy="5" r="2"/><path d="M10 9h4v2c.7-1.3 2.2-2.2 4-2.2 3.3 0 5 2 5 5.5V21h-4v-6c0-1.7-.7-2.8-2.3-2.8-1.6 0-2.7 1.1-2.7 2.8v6h-4z"/></svg>`,
  x: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="16" height="16"><path d="M17.7 3h3l-6.6 7.6L22 21h-6.2l-4.9-6.4L5.3 21H2.3l7.1-8.1L2 3h6.3l4.4 5.8L17.7 3zm-1.1 16h1.7L7.5 5H5.7l10.9 14z"/></svg>`,
};

function getSocialIcon(label, href) {
  const t = (label + ' ' + href).toLowerCase();
  if (t.includes('instagram')) return SOCIAL_ICONS.instagram;
  if (t.includes('youtube')) return SOCIAL_ICONS.youtube;
  if (t.includes('twitter') || t.includes(' x ') || t.includes('/x.com') || t.includes('/twitter')) return SOCIAL_ICONS.x;
  if (t.includes('linkedin')) return SOCIAL_ICONS.linkedin;
  return '';
}

function buildFooter(el, fragment) {
  if (!fragment) return;

  const root = fragment.querySelector('.default-content-wrapper') || fragment;

  // The fragment has a <div> wrapping 4 column <div>s
  const colsWrapper = root.querySelector('div');
  const cols = colsWrapper ? [...colsWrapper.querySelectorAll(':scope > div')] : [];

  el.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'ds-container';

  // 4-column grid
  const grid = document.createElement('div');
  grid.className = 'ds-footer-grid';

  cols.forEach((col) => {
    const colDiv = document.createElement('div');
    colDiv.className = 'ds-footer-col';

    const h3El = col.querySelector('h3');
    if (h3El) {
      const h3 = document.createElement('h3');
      h3.textContent = h3El.textContent.trim();
      colDiv.append(h3);
    }

    const ul = col.querySelector('ul');
    if (ul) {
      const links = [...ul.querySelectorAll('a')];
      const isFollow = h3El?.textContent.trim().toLowerCase() === 'follow';

      if (isFollow) {
        // Social icons
        const socialDiv = document.createElement('div');
        socialDiv.className = 'ds-social';
        links.forEach((a) => {
          const icon = getSocialIcon(a.getAttribute('aria-label') || a.textContent, a.href);
          const link = document.createElement('a');
          link.href = a.href;
          link.rel = 'noopener';
          link.target = '_blank';
          link.setAttribute('aria-label', a.getAttribute('aria-label') || a.textContent.trim());
          if (icon) link.innerHTML = icon;
          socialDiv.append(link);
        });
        colDiv.append(socialDiv);
      } else {
        const newUl = document.createElement('ul');
        links.forEach((a) => {
          const li = document.createElement('li');
          const link = document.createElement('a');
          link.href = a.href;
          link.textContent = a.textContent.trim();
          if (a.target) link.target = a.target;
          if (a.rel) link.rel = a.rel;
          li.append(link);
          newUl.append(li);
        });
        colDiv.append(newUl);
      }
    }

    grid.append(colDiv);
  });

  container.append(grid);

  // Legal row (hardcoded — rarely changes)
  const legal = document.createElement('div');
  legal.className = 'ds-legal';
  legal.innerHTML = `
    <a href="https://pages.thechannelco.com/standard-policies-INTL-Privacy.html" target="_blank" rel="noopener">The Channel Company Privacy Policy</a>
    <a href="https://pages.thechannelco.com/standard-policies-Global-cookies" target="_blank" rel="noopener">The Channel Company Cookie Policy</a>
    <a href="https://www.thechannelco.com/privacy-choices" target="_blank" rel="noopener">Do Not Sell or Share My Personal Information</a>
  `;
  container.append(legal);

  // Cobrand row
  const cobrand = document.createElement('div');
  cobrand.className = 'ds-cobrand';

  const dellMark = document.createElement('span');
  dellMark.className = 'ds-cobrand-mark';
  const dellImg = document.createElement('img');
  dellImg.src = 'https://main--snowflake--ai-ecoverse.aem.page/stardust/current/assets/media/dell_logo_white_160px-764d5064.png';
  dellImg.alt = 'Dell Technologies (sponsor)';
  dellImg.width = 160;
  dellImg.height = 28;
  dellMark.append(dellImg);

  const tccMark = document.createElement('span');
  tccMark.className = 'ds-cobrand-mark';
  tccMark.textContent = 'The Channel Company';

  cobrand.append(dellMark, tccMark);
  container.append(cobrand);

  el.append(container);
}

/**
 * Loads and decorates the footer.
 * @param {Element} el The footer element
 */
export default async function init(el) {
  const footerMeta = getMetadata('footer');
  const path = footerMeta || FOOTER_PATH;
  try {
    const fragment = await loadFragment(`${locale.prefix}${path}`);
    buildFooter(el, fragment);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Footer block failed:', e);
  }
}
