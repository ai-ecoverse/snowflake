#!/usr/bin/env node
// Sanitise non-ASCII characters in an HTML file by replacing them with
// numeric HTML entities. Idempotent — safe to run multiple times.
// Usage: node sanitise.js <file>
const { readFileSync, writeFileSync } = require('fs');

const file = process.argv[2];
if (!file) {
  process.stderr.write('Usage: node sanitise.js <file>\n');
  process.exit(1);
}

let src = readFileSync(file, 'utf8');
src = src.replace(/[^\x00-\x7F]/g, function(c) { return '&#' + c.codePointAt(0) + ';'; });
writeFileSync(file, src, 'utf8');
process.stdout.write('sanitised ' + file + '\n');
