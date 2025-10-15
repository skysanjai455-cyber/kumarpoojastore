/**
 * scripts/import_images_csv.js
 *
 * CSV format: idOrSlug,imagePath
 * imagePath can be:
 *  - /images/foo.jpg   (already a public path, will be used as-is)
 *  - ./local/path.jpg   (filesystem path; will be copied to public/images/<basename>)
 *
 * Behavior:
 *  - For each row, find product by id or slug in data/products.json
 *  - If imagePath starts with '/', set product.images = [imagePath]
 *  - If it's a filesystem path, copy to public/images and set product.images accordingly
 *
 * Usage:
 *   node scripts/import_images_csv.js path/to/mapping.csv
 */

const fs = require('fs')
const path = require('path')
// Minimal CSV parsing (no external dependency). We only expect two columns per row.

const repoRoot = path.join(__dirname, '..')
const productsFile = path.join(repoRoot, 'data', 'products.json')
const publicImagesDir = path.join(repoRoot, 'public', 'images')

const args = process.argv.slice(2)
if(args.length < 1){
  console.log('Usage: node scripts/import_images_csv.js mapping.csv [--dry-run]')
  process.exit(1)
}

const csvPath = path.resolve(args[0])
const dryRun = args.includes('--dry-run')
const mergeMode = args.includes('--merge')
if(!fs.existsSync(csvPath)){
  console.error('CSV file not found:', csvPath)
  process.exit(2)
}

if(!fs.existsSync(publicImagesDir)) fs.mkdirSync(publicImagesDir, { recursive: true })

const raw = fs.readFileSync(csvPath, 'utf8')
// Split into lines, ignore empty lines and comments starting with '#'
const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith('#'))
// Each line: idOrSlug,image1[;image2;...],optionalImage3,...
const records = lines.map(l => {
  // split by comma, but allow commas inside quoted fields (very simple support)
  const parts = []
  let cur = ''
  let inQuotes = false
  for(let i=0;i<l.length;i++){
    const ch = l[i]
    if(ch === '"') { inQuotes = !inQuotes; cur += ch; continue }
    if(ch === ',' && !inQuotes){ parts.push(cur.trim()); cur = ''; continue }
    cur += ch
  }
  if(cur !== '') parts.push(cur.trim())

  const unquote = s => {
    if(!s) return ''
    s = s.trim()
    if((s.startsWith('"') && s.endsWith('"')) || (s.startsWith('\'') && s.endsWith('\''))) return s.slice(1, -1)
    return s
  }
  const id = unquote(parts[0] || '')
  // collect all remaining parts and if any part contains semicolons, split them too
  const images = []
  for(let i=1;i<parts.length;i++){
    const p = unquote(parts[i])
    if(!p) continue
    if(p.includes(';')){
      p.split(';').map(x => x.trim()).filter(Boolean).forEach(x => images.push(x))
    } else {
      images.push(p)
    }
  }
  return [id, images]
})

const origProductsJson = fs.readFileSync(productsFile, 'utf8')
const products = JSON.parse(origProductsJson)
let changed = false
const plannedChanges = []

for(const r of records){
  const [idOrSlug, imagePaths] = r
  if(!idOrSlug || !imagePaths || imagePaths.length === 0) continue
  const product = products.find(p => p.id === idOrSlug || p.slug === idOrSlug)
  if(!product){
    console.warn('No product found for', idOrSlug)
    continue
  }
  // process each image path in this row
  const toPublicPaths = []
  for(const imagePath of imagePaths){
    if(imagePath.startsWith('/')){
      toPublicPaths.push(imagePath)
      plannedChanges.push({ id: product.id, slug: product.slug, from: product.images, to: [imagePath], action: 'set-public-path' })
      if(!dryRun) console.log(`Updated ${product.id} -> ${imagePath}`)
      else console.log(`[dry-run] Would update ${product.id} -> ${imagePath}`)
      continue
    }
    const abs = path.isAbsolute(imagePath) ? imagePath : path.join(process.cwd(), imagePath)
    if(!fs.existsSync(abs)){
      console.warn('Local image not found:', abs)
      continue
    }
    const destName = `${product.slug || product.id}${path.extname(abs)}`
    const destPath = path.join(publicImagesDir, destName)
    const publicPath = `/images/${destName}`
    toPublicPaths.push(publicPath)
    plannedChanges.push({ id: product.id, slug: product.slug, from: product.images, to: [publicPath], action: 'copy-local', local: abs, dest: destPath })
    if(!dryRun){
      fs.copyFileSync(abs, destPath)
      console.log(`Copied ${abs} -> ${publicPath}`)
    } else {
      console.log(`[dry-run] Would copy ${abs} -> ${publicPath}`)
    }
  }

  if(toPublicPaths.length === 0) continue
  if(mergeMode){
    // merge with existing images, keep order and dedupe
    const existing = Array.isArray(product.images) ? product.images.slice() : []
    const merged = existing.concat(toPublicPaths).filter((v,i,a) => a.indexOf(v) === i)
    plannedChanges.push({ id: product.id, slug: product.slug, from: product.images, to: merged, action: 'merge' })
    if(!dryRun){ product.images = merged; changed = true }
    else { /* dry-run message already printed for copies */ }
  } else {
    plannedChanges.push({ id: product.id, slug: product.slug, from: product.images, to: toPublicPaths, action: 'set' })
    if(!dryRun){ product.images = toPublicPaths; changed = true }
  }
}

if(plannedChanges.length === 0){
  console.log('No changes planned')
  process.exit(0)
}

if(dryRun){
  console.log('\nDry-run summary:')
  plannedChanges.forEach(c => {
    console.log(` - [${c.action}] ${c.id} : ${JSON.stringify(c.from)} -> ${JSON.stringify(c.to)}`)
  })
  process.exit(0)
}

// create backup
const bakPath = productsFile + '.bak.' + Date.now()
fs.writeFileSync(bakPath, origProductsJson, 'utf8')
console.log('Backup created:', bakPath)

if(changed){
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2), 'utf8')
  console.log('products.json updated')
} else {
  console.log('No changes made')
}
