#!/usr/bin/env node
/**
 * Sanitise non-ASCII characters to HTML entities for DA ingestion.
 * DA strips <head> and parses without charset declaration, corrupting
 * multibyte UTF-8 sequences. Named/numeric entities survive the round-trip.
 */
const fs = require('fs');
const path = process.argv[2];
if (!path) { console.error('Usage: node sanitise.js <file>'); process.exit(1); }

const NAMED = {
  '\u00A0': '&nbsp;', '\u2013': '&ndash;', '\u2014': '&mdash;',
  '\u2018': '&lsquo;', '\u2019': '&rsquo;', '\u201C': '&ldquo;',
  '\u201D': '&rdquo;', '\u2022': '&bull;', '\u2026': '&hellip;',
  '\u00AB': '&laquo;', '\u00BB': '&raquo;', '\u00B7': '&middot;',
  '\u2192': '&rarr;', '\u2190': '&larr;', '\u00A9': '&copy;',
  '\u00AE': '&reg;', '\u2122': '&trade;', '\u00D7': '&times;',
};

let content = fs.readFileSync(path, 'utf8');
content = content.replace(/[^\x00-\x7F]/g, (ch) => {
  if (NAMED[ch]) return NAMED[ch];
  return `&#${ch.codePointAt(0)};`;
});
fs.writeFileSync(path, content, 'utf8');
