/**
 * faq-accordion — Two-column FAQ layout with sticky category nav and accordion Q&A
 *
 * Authoring rows (positional):
 *   1. Nav label | comma-separated list of "anchor:Label" pairs
 *      e.g. "On this page" | "donations:Donations, volunteering:Volunteering, shelter:Shelter & services, community:Community"
 *   Then repeating groups of:
 *   - Category row: category heading | anchor-id (e.g. "Donations" | "donations")
 *   - Q&A rows: question text | answer HTML/content (repeat per question in this category)
 *   - Empty row signals next category
 *
 * Simplified authoring: each row after the nav row is either:
 *   - A "category" row: first cell is h2-level category name (marked as strong), second cell is the anchor id
 *   - A "qa" row: first cell is question, second cell is answer content
 */

function text(cell) { return cell ? cell.textContent.trim() : ''; }
function html(cell) { return cell ? cell.innerHTML : ''; }

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Row 0: nav label | nav items (pipe-separated "anchor:Label" pairs)
  const navLabelCell = rows[0]?.firstElementChild;
  const navItemsCell = rows[0]?.children[1];
  const navLabel = text(navLabelCell) || 'On this page';
  const navItemsRaw = text(navItemsCell);

  // Parse nav items: "donations:Donations, volunteering:Volunteering, ..."
  const navItems = navItemsRaw.split(',').map((s) => {
    const [anchor, ...labelParts] = s.trim().split(':');
    return { anchor: anchor.trim(), label: labelParts.join(':').trim() };
  }).filter((n) => n.anchor && n.label);

  // Build cat-nav
  const catNav = document.createElement('aside');
  catNav.className = 'cat-nav';

  const navEyebrow = document.createElement('p');
  navEyebrow.className = 'eyebrow';
  navEyebrow.textContent = navLabel;
  catNav.append(navEyebrow);

  const navOl = document.createElement('ol');
  navItems.forEach(({ anchor, label }) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${anchor}`;
    a.textContent = label;
    li.append(a);
    navOl.append(li);
  });
  catNav.append(navOl);

  // Process remaining rows as category + Q&A pairs
  // Row format: if second cell has an id-style string and first cell looks like a heading → category
  //             otherwise → Q&A pair
  const questionsArea = document.createElement('div');
  questionsArea.className = 'questions-area';

  let currentSection = null;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const cellA = row.firstElementChild;
    const cellB = row.children[1];

    if (!cellA) continue;

    const aText = text(cellA);
    const bText = text(cellB);
    const bContent = html(cellB);

    // Detect category row: second cell is a short anchor id (no spaces, lowercase)
    const isCategory = bText && /^[a-z0-9-]+$/.test(bText) && !bText.includes(' ') && bText.length < 40;

    if (isCategory) {
      currentSection = document.createElement('div');
      currentSection.className = 'q-section';
      currentSection.id = bText;

      const h2 = document.createElement('h2');
      h2.textContent = aText;
      currentSection.append(h2);
      questionsArea.append(currentSection);
    } else {
      // Q&A row
      if (!currentSection) {
        currentSection = document.createElement('div');
        currentSection.className = 'q-section';
        questionsArea.append(currentSection);
      }

      const details = document.createElement('details');
      const summary = document.createElement('summary');
      summary.textContent = aText;
      details.append(summary);

      const answerDiv = document.createElement('div');
      answerDiv.className = 'answer';
      // Clone content from cell B
      if (cellB) {
        [...cellB.childNodes].forEach((n) => answerDiv.append(n.cloneNode(true)));
      }
      details.append(answerDiv);
      currentSection.append(details);
    }
  }

  // Build layout
  const layout = document.createElement('div');
  layout.className = 'faq-layout';
  layout.append(catNav, questionsArea);

  block.replaceChildren(layout);
}
