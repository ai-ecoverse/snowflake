/**
 * engagement — newsletter sign-up (centered, narrow)
 *
 * Authoring rows (positional):
 *   1. eyebrow text
 *   2. h2 heading
 *   3. description paragraph
 *   4. form action URL
 *   5. email input placeholder
 *   6. submit button label
 *   7. legal text (HTML allowed — links for privacy/terms)
 */

function text(cell) { return cell ? cell.textContent.trim() : ''; }
function html(cell) { return cell ? cell.innerHTML : ''; }

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const container = document.createElement('div');
  container.className = 'ds-container';

  const narrow = document.createElement('div');
  narrow.className = 'newsletter-narrow';
  narrow.id = 'engagement';

  const eyebrow = text(rows[0]?.firstElementChild);
  const heading = text(rows[1]?.firstElementChild);
  const desc = html(rows[2]?.firstElementChild);
  const formAction = text(rows[3]?.firstElementChild) || '#';
  const placeholder = text(rows[4]?.firstElementChild) || 'you@company.com';
  const btnLabel = text(rows[5]?.firstElementChild) || 'Subscribe';
  const legalHtml = html(rows[6]?.firstElementChild);

  if (eyebrow) {
    const ey = document.createElement('span');
    ey.className = 'ds-eyebrow ds-eyebrow--brass-deep';
    ey.textContent = eyebrow;
    narrow.append(ey);
  }

  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading;
    narrow.append(h2);
  }

  if (desc) {
    const p = document.createElement('p');
    p.innerHTML = desc;
    narrow.append(p);
  }

  // Form
  const form = document.createElement('form');
  form.action = formAction;
  form.method = 'post';
  form.className = 'newsletter-form';
  form.setAttribute('aria-label', 'Subscribe to the ETP newsletter');

  const input = document.createElement('input');
  input.className = 'ds-input';
  input.type = 'email';
  input.name = 'email';
  input.placeholder = placeholder;
  input.required = true;
  input.setAttribute('aria-label', 'Email address');

  const btn = document.createElement('button');
  btn.className = 'btn-primary';
  btn.type = 'submit';
  btn.innerHTML = `<span class="btn-lab">${btnLabel}</span><span class="btn-arrow" aria-hidden="true">&rarr;</span>`;

  form.append(input, btn);
  narrow.append(form);

  if (legalHtml) {
    const foot = document.createElement('div');
    foot.className = 'newsletter-foot';
    foot.innerHTML = legalHtml;
    narrow.append(foot);
  }

  container.append(narrow);
  block.replaceChildren(container);
}
