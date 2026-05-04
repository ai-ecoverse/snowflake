#!/usr/bin/env node
/**
 * sanitise.js — Replace non-ASCII characters with HTML entities in-place.
 * DA strips <head> on ingestion and parses without a charset declaration,
 * so multibyte UTF-8 sequences get corrupted. Entities survive the round-trip.
 *
 * Usage: node tools/da/sanitise.js <file>
 * Idempotent — running twice is a no-op.
 */

import { readFileSync, writeFileSync } from 'fs';

const file = process.argv[2];
if (!file) { console.error('Usage: node sanitise.js <file>'); process.exit(1); }

const NAMED = {
  '\u00A0': '&nbsp;', '\u00A9': '&copy;', '\u00AE': '&reg;',
  '\u2013': '&ndash;', '\u2014': '&mdash;', '\u2018': '&lsquo;',
  '\u2019': '&rsquo;', '\u201C': '&ldquo;', '\u201D': '&rdquo;',
  '\u2022': '&bull;', '\u2026': '&hellip;', '\u2122': '&trade;',
  '\u00B7': '&middot;', '\u2192': '&rarr;', '\u2190': '&larr;',
  '\u00D7': '&times;', '\u2032': '&prime;', '\u2033': '&Prime;',
  '\u00AB': '&laquo;', '\u00BB': '&raquo;',
};

let src = readFileSync(file, 'utf8');
let out = '';
for (const ch of src) {
  const code = ch.codePointAt(0);
  if (code > 127) {
    out += NAMED[ch] || `&#${code};`;
  } else {
    out += ch;
  }
}
if (out !== src) writeFileSync(file, out, 'utf8');
