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

const localesDir = args.locales || 'projects/doc-site/data/locales'
const base = args.base || 'en'
const dryRun = !(args.write === 'true' || args.write === true)
const apiUrl = args.apiUrl || null
const apiKey = args.apiKey || null

function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch (e) {
    return null
  }
}

function writeJSON(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + '\n', 'utf8')
}

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

function getAt(obj, pathStr) {
  const parts = pathStr.split('.')
  let cur = obj
  for (const p of parts) {
    if (!cur || typeof cur !== 'object' || !(p in cur)) return undefined
    cur = cur[p]
  }
  return cur
}

function setAt(obj, pathStr, value) {
  const parts = pathStr.split('.')
  let cur = obj
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i]
    if (i === parts.length - 1) {
      cur[p] = value
    } else {
      if (!cur[p] || typeof cur[p] !== 'object') cur[p] = {}
      cur = cur[p]
    }
  }
}

async function translateText(text, sourceLang, targetLang) {
  if (!apiUrl) {
    // No API configured: return source text prefixed as machine-translated placeholder
    return `@@MACHINE_TRANSLATED:${targetLang}@@ ${text}`
  }
  // try a generic POST to provided apiUrl expecting {q, source, target} -> {translatedText}
  try {
    const body = JSON.stringify({ q: text, source: sourceLang, target: targetLang })
    const headers = { 'Content-Type': 'application/json' }
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`
    const res = await fetch(apiUrl, { method: 'POST', headers, body })
    if (!res.ok) {
      return `@@MACHINE_TRANSLATED:${targetLang}:ERROR ${res.status}@@ ${text}`
    }
    const data = await res.json()
    // data may be {translatedText} or array—be permissive
    if (typeof data === 'string') return `@@MACHINE_TRANSLATED:${targetLang}@@ ${data}`
    if (data.translatedText) return `@@MACHINE_TRANSLATED:${targetLang}@@ ${data.translatedText}`
    if (Array.isArray(data) && data[0] && data[0][0]) return `@@MACHINE_TRANSLATED:${targetLang}@@ ${data[0][0][0]}`
    return `@@MACHINE_TRANSLATED:${targetLang}:UNKNOWN@@ ${text}`
  } catch (e) {
    return `@@MACHINE_TRANSLATED:${targetLang}:ERROR@@ ${text}`
  }
}

async function run() {
  if (!fs.existsSync(localesDir)) {
    console.error('Locales dir not found:', localesDir)
    process.exit(1)
  }
  const entries = fs.readdirSync(localesDir)
  if (!entries.includes(base)) {
    console.error('Base locale dir not found:', base)
    process.exit(1)
  }

  const baseDir = path.join(localesDir, base)
  const baseFiles = fs.readdirSync(baseDir).filter(f => f.endsWith('.json'))
  const report = {}

  for (const name of entries) {
    if (name === base) continue
    const locDir = path.join(localesDir, name)
    if (!fs.statSync(locDir).isDirectory()) continue
    let changedFiles = []
    for (const bf of baseFiles) {
      const baseFile = path.join(baseDir, bf)
      const baseObj = readJSON(baseFile) || {}
      const targetFile = path.join(locDir, bf)
      const targetObj = readJSON(targetFile) || {}

      const baseKeys = flatten(baseObj)
      const targetKeys = new Set(flatten(targetObj))
      const missing = baseKeys.filter(k => !targetKeys.has(k))
      if (missing.length === 0) continue

      for (const key of missing) {
        const src = getAt(baseObj, key)
        const translated = await translateText(String(src), base, name)
        setAt(targetObj, key, translated)
      }

      if (dryRun) {
        changedFiles.push({ file: path.relative(process.cwd(), targetFile), missingAdded: missing.length })
      } else {
        // ensure target dir exists
        if (!fs.existsSync(locDir)) fs.mkdirSync(locDir, { recursive: true })
        writeJSON(targetFile, targetObj)
        changedFiles.push({ file: path.relative(process.cwd(), targetFile), missingAdded: missing.length })
      }
    }
    report[name] = changedFiles
  }

  console.log(JSON.stringify({ base, localesDir, dryRun, apiUrl: !!apiUrl, report }, null, 2))
  // exit code non-zero if we would write and there are changes and --write not provided? here follow dryRun
}

// node v18 has global fetch; if not, warn
if (typeof fetch === 'undefined') {
  global.fetch = (...args) => import('node-fetch').then(m => m.default(...args))
}

run().catch(e => { console.error(e); process.exit(2) })
