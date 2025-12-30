#!/usr/bin/env node
// Simple validator for doc-site JSON files.
// Checks required fields: id, category, title. Ensures items is array if present.

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const docsDir = path.join(root, 'projects', 'doc-site', 'data', 'docs');

let failed = false;

function validateFile(filePath) {
  const rel = path.relative(root, filePath);
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);
    if (!data.id) throw new Error('Missing id');
    if (!data.category) throw new Error('Missing category');
    if (!data.title) throw new Error('Missing title');
    if (data.items && !Array.isArray(data.items)) throw new Error('items must be array');
    console.log('OK  ', rel);
  } catch (err) {
    failed = true;
    console.error('FAIL', rel, '-', err.message);
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir);
  entries.forEach((name) => {
    const fp = path.join(dir, name);
    const stat = fs.statSync(fp);
    if (stat.isDirectory()) walk(fp);
    else if (name.endsWith('.json')) validateFile(fp);
  });
}

if (!fs.existsSync(docsDir)) {
  console.error('Docs directory not found:', docsDir);
  process.exit(1);
}

walk(docsDir);

process.exit(failed ? 1 : 0);
