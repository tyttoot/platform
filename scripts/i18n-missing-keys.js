#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

function flatten(obj, prefix = '') {
  const res = []
  for (const k of Object.keys(obj)) {
    const v = obj[k]
    const key = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      res.push(...flatten(v, key))
    } else {
      res.push(key)
    }
  }
  return res
}

function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch (e) {
    console.error('Failed to read JSON', file, e.message)
    process.exit(2)
  }
}

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
const localesDir = args.locales || 'projects/doc-site/data/locales'
const base = args.base || 'en'

if (!fs.existsSync(localesDir)) {
  console.error('Locales dir not found:', localesDir)
  process.exit(1)
}

const entries = fs.readdirSync(localesDir)
function deepMerge(a, b) {
  a = Object.assign({}, a)
  for (const k of Object.keys(b)) {
    if (
      b[k] &&
      typeof b[k] === 'object' &&
      !Array.isArray(b[k]) &&
      a[k] &&
      typeof a[k] === 'object' &&
      !Array.isArray(a[k])
    ) {
      a[k] = deepMerge(a[k], b[k])
    } else {
      a[k] = b[k]
    }
  }
  return a
}

const localeObjects = {}
for (const name of entries) {
  const full = path.join(localesDir, name)
  if (fs.statSync(full).isDirectory()) {
    const jsonFiles = fs.readdirSync(full).filter(f => f.endsWith('.json'))
    let merged = {}
    for (const jf of jsonFiles) {
      const obj = readJSON(path.join(full, jf))
      merged = deepMerge(merged, obj)
    }
    localeObjects[name] = merged
  } else if (name.endsWith('.json')) {
    const loc = name.replace(/\.json$/, '')
    localeObjects[loc] = readJSON(path.join(localesDir, name))
  }
}

if (!localeObjects[base]) {
  console.error('Base locale not found for', base)
  process.exit(1)
}

const baseObj = localeObjects[base]
const baseKeys = new Set(flatten(baseObj))

const report = {}
let totalMissing = 0
for (const [loc, obj] of Object.entries(localeObjects)) {
  if (loc === base) continue
  const keys = new Set(flatten(obj))
  const missing = [...baseKeys].filter(k => !keys.has(k))
  report[loc] = { missing, missingCount: missing.length }
  totalMissing += missing.length
}

console.log(JSON.stringify({ base, localesDir, report }, null, 2))

if ((args.failOnMissing === 'true' || args.failOnMissing === true) && totalMissing > 0) {
  console.error('i18n check failed: missing keys detected')
  process.exit(3)
}
