#!/usr/bin/env node
/**
 * sanitise.js — rewrite non-ASCII code points to named/numeric HTML entities.
 * DA strips <head> on ingestion without a charset declaration, corrupting any
 * multibyte UTF-8 sequence. This script makes uploads idempotent-safe.
 * Usage: node tools/da/sanitise.js <file>  (in-place)
 */
const fs = require('fs');
const path = require('path');

const file = process.argv[2];
if (!file) { console.error('Usage: node sanitise.js <file>'); process.exit(1); }

const named = {
  '\u00A0': '&nbsp;', '\u00A9': '&copy;', '\u00AE': '&reg;',
  '\u2013': '&ndash;', '\u2014': '&mdash;', '\u2018': '&lsquo;',
  '\u2019': '&rsquo;', '\u201C': '&ldquo;', '\u201D': '&rdquo;',
  '\u2026': '&hellip;', '\u2122': '&trade;', '\u00B7': '&middot;',
  '\u2192': '&rarr;', '\u2190': '&larr;', '\u00D7': '&times;',
  '\u00F7': '&divide;', '\u00B1': '&plusmn;',
};

let src = fs.readFileSync(file, 'utf8');
let out = '';
for (const ch of src) {
  const cp = ch.codePointAt(0);
  if (cp <= 127) { out += ch; continue; }
  if (named[ch]) { out += named[ch]; continue; }
  out += `&#${cp};`;
}
fs.writeFileSync(file, out, 'utf8');
console.log(`sanitised: ${path.basename(file)}`);
