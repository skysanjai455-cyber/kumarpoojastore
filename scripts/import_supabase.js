/*
Simple script to import local data/products.json into Supabase `products` table.
Usage: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env, then run:
  node scripts/import_supabase.js
*/

async function main(){
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if(!url || !key){
    console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env')
    process.exit(1)
  }
  const { createClient } = require('@supabase/supabase-js')
  const sb = createClient(url, key)
  const fs = require('fs')
  const path = require('path')
  const productsPath = path.join(process.cwd(), 'data', 'products.json')
  const raw = fs.readFileSync(productsPath,'utf8')
  const products = JSON.parse(raw)
  // Format rows to match schema
  const rows = products.map(p => ({ id: p.id, slug: p.slug, name: p.name, description: p.description, images: p.images || [], stock: p.stock || 0 }))
  try{
    await sb.from('products').delete().neq('id','')
    const { data, error } = await sb.from('products').insert(rows)
    if(error) throw error
    console.log('Imported', data.length, 'products')
  }catch(e){
    console.error('import failed', e)
    process.exit(1)
  }
}

main()
