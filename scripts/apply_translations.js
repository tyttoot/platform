#!/usr/bin/env node
// Simple translation applier: copies translated JSON files from a translations folder into
// the project's locale docs folder. Usage: node scripts/apply_translations.js <locale> <translationsDir>

const fs = require('fs');
const path = require('path');

if (process.argv.length < 4) {
  console.error('Usage: node apply_translations.js <locale> <translationsDir>');
  process.exit(2);
}

const repoRoot = path.resolve(__dirname, '..');
const projectData = path.join(repoRoot, 'projects', 'doc-site', 'data');
const locale = process.argv[2];
const srcDir = path.resolve(process.argv[3]);
const destDir = path.join(projectData, 'locales', locale, 'docs');

if (!fs.existsSync(srcDir)) { console.error('Translations dir not found:', srcDir); process.exit(1); }
if (!fs.existsSync(destDir)) { fs.mkdirSync(destDir, { recursive: true }); }

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    const files = fs.readdirSync(src);
    files.forEach(f => copyRecursive(path.join(src, f), path.join(dest, f)));
  } else {
    fs.copyFileSync(src, dest);
    console.log('Copied', src, '->', dest);
  }
}

try {
  copyRecursive(srcDir, destDir);
  console.log('Translations applied to', destDir);
} catch (e) {
  console.error('Error applying translations:', e.message);
  process.exit(1);
}
