const fs = require('fs')
const path = require('path')

const dataPath = path.join(__dirname, '..', 'data', 'products.json')
const categoriesPath = path.join(__dirname, '..', 'data', 'categories.json')

const products = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8')).map(c => c.slug)

let changed = false
for(let i=0;i<products.length;i++){
  const p = products[i]
  if(!p.images || p.images.length === 0){
    p.images = ['/hero-banner.jpg']
    changed = true
  }
  if(!p.category){
    p.category = categories[i % categories.length] || 'agarbathis'
    changed = true
  }
}

if(changed){
  fs.writeFileSync(dataPath, JSON.stringify(products, null, 2), 'utf8')
  console.log('Updated products.json — set placeholder images and categories')
} else {
  console.log('No changes needed')
}
