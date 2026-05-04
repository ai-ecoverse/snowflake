/**
 * article-body — Long-form article shell: breadcrumbs, headline, lead, H3 sections, related links.
 * Authoring rows:
 *   1: Breadcrumbs (pipe-separated "label|URL" pairs, last item = current page with no URL)
 *   2: h2 headline
 *   3: Lead paragraph
 *   4 to N-1: Section pairs — Cell 1=h3 title, Cell 2=body paragraph
 *   Last row: Related links (pipe-separated "label|URL" pairs)
 */
export default async function decorate(block) {
  const rows = [...block.children];
  const wrap = document.createElement('div');
  wrap.className = 'article-body-wrap';

  // Row 1 — breadcrumbs
  const crumbsRaw = rows[0]?.firstElementChild?.textContent.trim() ?? '';
  if (crumbsRaw) {
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Breadcrumb');
    const ol = document.createElement('ol');
    ol.className = 'breadcrumbs-list';
    const crumbs = crumbsRaw.split('|').map((c) => c.trim()).filter(Boolean);
    // Pairs: label, url, label, url ... last label (current)
    for (let i = 0; i < crumbs.length; i += 2) {
      const label = crumbs[i];
      const url = crumbs[i + 1];
      const li = document.createElement('li');
      if (url && i + 1 < crumbs.length) {
        const a = document.createElement('a');
        a.href = url;
        a.textContent = label;
        li.append(a);
        const sep = document.createElement('span');
        sep.className = 'sep';
        sep.setAttribute('aria-hidden', 'true');
        sep.textContent = '/';
        li.append(sep);
      } else {
        const cur = document.createElement('span');
        cur.setAttribute('aria-current', 'page');
        cur.textContent = label;
        li.append(cur);
      }
      ol.append(li);
    }
    nav.append(ol);
    wrap.append(nav);
  }

  // Row 2 — headline
  const headline = document.createElement('h2');
  headline.className = 'article-headline';
  headline.textContent = rows[1]?.firstElementChild?.textContent.trim() ?? '';
  wrap.append(headline);

  // Row 3 — lead
  const lead = document.createElement('p');
  lead.className = 'lead';
  lead.textContent = rows[2]?.firstElementChild?.textContent.trim() ?? '';
  wrap.append(lead);

  // Rows 4 to len-2 — section pairs (h3 + body)
  const sectionRows = rows.slice(3, rows.length - 1);
  sectionRows.forEach((row) => {
    const cells = [...row.children];
    const sectionTitle = cells[0]?.textContent.trim() ?? '';
    const sectionBody = cells[1]?.textContent.trim() ?? '';

    if (sectionTitle) {
      const h3 = document.createElement('h3');
      h3.textContent = sectionTitle;
      wrap.append(h3);
    }
    if (sectionBody) {
      const p = document.createElement('p');
      p.textContent = sectionBody;
      wrap.append(p);
    }
  });

  // Last row — related links
  const relatedRaw = rows[rows.length - 1]?.firstElementChild?.textContent.trim() ?? '';
  if (relatedRaw && rows.length > 3) {
    const related = document.createElement('aside');
    related.className = 'article-related';

    const relH3 = document.createElement('h3');
    relH3.textContent = 'Related';
    related.append(relH3);

    const ul = document.createElement('ul');
    const links = relatedRaw.split('|').map((s) => s.trim()).filter(Boolean);
    for (let i = 0; i < links.length; i += 2) {
      const label = links[i];
      const url = links[i + 1] ?? '#';
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = url;
      a.textContent = label;
      li.append(a);
      ul.append(li);
    }
    related.append(ul);
    wrap.append(related);
  }

  block.replaceChildren(wrap);
}
