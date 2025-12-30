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
const localesDir = args.locales || 'projects/doc-site/data/locales/en'
const write = args.write === 'true' || args.write === true

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

function findLiteralsInFile(file) {
  const txt = fs.readFileSync(file, 'utf8')
  const lines = txt.split(/\r?\n/)
  const stringRegex = /(["'])(.{3,}?)\1/g
  const results = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (/\b(t|i18n\.t|translate)\s*\(/.test(line)) continue
    let m
    while ((m = stringRegex.exec(line)) !== null) {
      const content = m[2]
      if (content.length >= 3 && /[a-zA-Z]/.test(content)) {
        results.push({ line: i + 1, text: content })
      }
    }
  }
  return results
}

if (!fs.existsSync(testsDir)) {
  console.error('Tests dir not found:', testsDir)
  process.exit(1)
}

const files = walk(testsDir).filter(f => /\.(js|html|htm)$/.test(f))
const globalLocaleFile = path.join(localesDir, 'tests.json')
let globalLocale = {}
if (fs.existsSync(globalLocaleFile)) {
  try { globalLocale = JSON.parse(fs.readFileSync(globalLocaleFile,'utf8')) } catch(e){}
}

let totalReplacements = 0
for (const file of files) {
  if (file.includes(path.join('tests','index.html'))) continue
  const literals = findLiteralsInFile(file)
  if (!literals.length) continue
  const content = fs.readFileSync(file, 'utf8')
  const rel = path.relative(testsDir, file).replace(/\\/g,'/')
  const keyBase = 'tests.' + rel.replace(/[^a-zA-Z0-9]/g,'_')
  const mapping = {}
  let idx = 1
  // dedupe by text
  const seen = {}
  for (const lit of literals) {
    const txt = lit.text
    if (seen[txt]) continue
    const key = keyBase + '.' + idx++
    mapping[txt] = key
    // put into globalLocale if not present
    if (!globalLocale[key]) globalLocale[key] = txt
    seen[txt] = key
  }

  // insert mapping object at top of file after any shebang or file comment block
  let newContent = content
  const varName = 'S'
  const insertion = 'var ' + varName + ' = ' + JSON.stringify(mapping, null, 2).replace(/"([^\"]+)":/g, "'$1':") + ';// test i18n mapping\n\n'
  // if file already has S mapping, skip insertion
  if (!/var\s+S\s*=/.test(content)) {
    // find first non-comment line
    const parts = newContent.split(/\r?\n/)
    let insertAt = 0
    // skip initial comments
    while (insertAt < parts.length && /^\s*(\/\/|\/\*|\*)/.test(parts[insertAt])) insertAt++
    parts.splice(insertAt, 0, insertion)
    newContent = parts.join('\n')
  }

  // replace literal occurrences with S['key']
  for (const [txt, key] of Object.entries(mapping)) {
    function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }
    const esc = escapeRegExp(txt)
    newContent = newContent.replace(new RegExp('"' + esc + '"', 'g'), varName + '["' + key + '"]')
    newContent = newContent.replace(new RegExp("'" + esc + "'", 'g'), varName + '["' + key + '"]')
    totalReplacements++
  }

  if (write) {
    fs.writeFileSync(file, newContent, 'utf8')
    console.log('Updated', file)
  } else {
    console.log('Would update', file)
  }
}

if (write) {
  fs.writeFileSync(globalLocaleFile, JSON.stringify(globalLocale, null, 2) + '\n', 'utf8')
  console.log('Wrote global locale:', globalLocaleFile)
}

console.log('Total replacements:', totalReplacements)
