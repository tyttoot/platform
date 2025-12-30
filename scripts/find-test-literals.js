#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const argv = process.argv.slice(2)
const args = {}
for (let i = 0; i < argv.length; i++) {
  const a = argv[i]
  if (a.startsWith('--')) {
    const k = a.replace(/^--/, '')
    const v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : 'true'
    args[k] = v
  }
}
const testsDir = args.tests || 'projects/doc-site/tests'
const minLen = parseInt(args.minLength || '5', 10)

function walk(dir) {
  const out = []
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    const st = fs.statSync(full)
    if (st.isDirectory()) out.push(...walk(full))
    else out.push(full)
  }
  return out
}

if (!fs.existsSync(testsDir)) {
  console.error('Tests dir not found:', testsDir)
  process.exit(1)
}

const files = walk(testsDir).filter(f => /\.(js|html|htm|jsx|ts|tsx)$/.test(f))
const results = []
const stringRegex = /(["'])(.{5,}?)\1/g

function isLikelyUIText(s) {
  if (!s) return false
  if (!/[a-zA-Z]/.test(s)) return false
  // basic heuristics to ignore paths, filenames, code and HTML
  const rejectPatterns = ['/', '..', '.js', '.json', 'http', '://', '=', '<', '>']
  for (const p of rejectPatterns) if (s.includes(p)) return false
  if (/^[\d\-_.]+$/.test(s)) return false
  // short tokens like utf-8 are not UI
  if (/^[a-z0-9-]{1,8}$/i.test(s) && !/\s/.test(s)) return false
  return true
}

for (const file of files) {
  const txt = fs.readFileSync(file, 'utf8')
  const lines = txt.split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    // skip lines that obviously call i18n functions
    if (/\b(t|i18n\.t|translate)\s*\(/.test(line)) continue
    let m
    while ((m = stringRegex.exec(line)) !== null) {
      const content = m[2]
      if (content.length >= minLen && isLikelyUIText(content)) {
        results.push({ file, line: i + 1, text: content.trim() })
      }
    }
  }
}

console.log(JSON.stringify({ testsDir, scanned: files.length, matches: results.length, results }, null, 2))

if (args.maxAllowed) {
  const allowed = parseInt(args.maxAllowed, 10) || 0
  if (results.length > allowed && (args.failOnExcess === 'true' || args.failOnExcess === true)) {
    console.error('Literal string check failed: too many matches:', results.length)
    process.exit(4)
  }
}
