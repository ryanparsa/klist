#!/usr/bin/env node
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'fs'
import { join, basename, dirname } from 'path'
import { fileURLToPath } from 'url'
import yaml from 'js-yaml'
import { validate } from './validate.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const ITEM_CATEGORIES = ['cloud', 'cluster', 'container', 'code']

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readYaml(filePath) {
  try {
    return yaml.load(readFileSync(filePath, 'utf8'))
  } catch (err) {
    fatal(`Failed to parse ${filePath}: ${err.message}`)
  }
}

function fatal(msg) {
  console.error(`✖ ${msg}`)
  process.exit(1)
}

function checkIdMatchesFilename(data, filePath) {
  const expected = basename(filePath, '.yaml')
  if (data.id !== expected) {
    fatal(`ID mismatch in ${filePath}\n  expected: "${expected}"\n  got:      "${data.id}"`)
  }
}

// ---------------------------------------------------------------------------
// Step 1 — Read item files
// ---------------------------------------------------------------------------

const items = []

for (const category of ITEM_CATEGORIES) {
  const dir = join(ROOT, 'items', category)
  let files
  try {
    files = readdirSync(dir).filter(f => f.endsWith('.yaml')).sort()
  } catch {
    fatal(`Could not read items directory: ${dir}`)
  }

  for (const file of files) {
    const filePath = join(dir, file)
    const data = readYaml(filePath)
    checkIdMatchesFilename(data, filePath)
    items.push({ ...data, category })
  }
}

// ---------------------------------------------------------------------------
// Step 2 — Read config files
// ---------------------------------------------------------------------------

const configs = []
const configDir = join(ROOT, 'items', 'config')

let configFiles
try {
  configFiles = readdirSync(configDir).filter(f => f.endsWith('.yaml')).sort()
} catch {
  fatal(`Could not read config directory: ${configDir}`)
}

for (const file of configFiles) {
  const filePath = join(configDir, file)
  const data = readYaml(filePath)
  checkIdMatchesFilename(data, filePath)

  // Normalise: ensure required and suggested always exist as arrays
  data.items = {
    required: data.items?.required ?? [],
    suggested: data.items?.suggested ?? [],
  }

  configs.push(data)
}

// ---------------------------------------------------------------------------
// Step 3 — Validate
// ---------------------------------------------------------------------------

const errors = validate({ items, configs })
if (errors.length > 0) {
  console.error(`\nValidation failed with ${errors.length} error(s):\n`)
  for (const e of errors) {
    console.error(`  ✖ ${e}`)
  }
  console.error('')
  process.exit(1)
}

// ---------------------------------------------------------------------------
// Step 4 — Extract all_tags
// ---------------------------------------------------------------------------

const allTagsSet = new Set()
for (const item of items) {
  for (const tag of item.tags ?? []) {
    allTagsSet.add(tag)
  }
}
const allTags = [...allTagsSet].sort()

// ---------------------------------------------------------------------------
// Step 5 — Write public/checklist.json
// ---------------------------------------------------------------------------

const output = {
  generated_at: new Date().toISOString(),
  all_tags: allTags,
  configs,
  items,
}

const publicDir = join(ROOT, 'public')
mkdirSync(publicDir, { recursive: true })

const outPath = join(publicDir, 'checklist.json')
writeFileSync(outPath, JSON.stringify(output, null, 2))

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

const byCategory = ITEM_CATEGORIES.reduce((acc, cat) => {
  acc[cat] = items.filter(i => i.category === cat).length
  return acc
}, {})

console.log('')
console.log(`✔ ${items.length} items loaded`)
for (const [cat, count] of Object.entries(byCategory)) {
  console.log(`    ${cat.padEnd(12)} ${count}`)
}
console.log(`✔ ${configs.length} configs loaded`)
console.log(`✔ ${allTags.length} unique tags extracted`)
console.log(`✔ public/checklist.json written`)
console.log('')
