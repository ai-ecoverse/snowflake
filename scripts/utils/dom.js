/**
 * Lightweight DOM helpers shared across blocks.
 * Ported from stardust/scripts.js.
 */

export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props || {})) {
    if (value === null || value === undefined || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key === 'dataset') Object.assign(node.dataset, value);
    else if (key === 'style' && typeof value === 'object') Object.assign(node.style, value);
    else if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      node.setAttribute(key, value);
    }
  }
  appendAll(node, children);
  return node;
}

export const rows = (block) => Array.from(block.children);
export const cells = (row) => Array.from(row.children);

export function resetBlock(block, className) {
  for (const attr of Array.from(block.attributes)) {
    if (attr.name !== 'class') block.removeAttribute(attr.name);
  }
  if (className) block.className = className;
  while (block.firstChild) block.removeChild(block.firstChild);
  return block;
}

function appendAll(parent, children) {
  for (const c of children.flat(Infinity)) {
    if (c === null || c === undefined || c === false) continue;
    parent.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
}
