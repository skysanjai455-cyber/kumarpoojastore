import fs from 'fs'
import path from 'path'

let supabase = null
export function initSupabase(){
  if(supabase) return supabase
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if(url && key){
    try{
      // lazy require so project can run without supabase installed
      // caller must install @supabase/supabase-js when enabling Supabase
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { createClient } = require('@supabase/supabase-js')
      supabase = createClient(url, key)
      return supabase
    }catch(e){
      console.warn('Supabase client not available (optional).', e.message)
      return null
    }
  }
  return null
}

const dataDir = path.join(process.cwd(), 'data')
const productsPath = path.join(dataDir, 'products.json')
const ordersPath = path.join(dataDir, 'orders.json')

function readJSON(p){
  try{ return JSON.parse(fs.readFileSync(p,'utf8')) }catch(e){ return [] }
}
function writeJSON(p, data){
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8')
}

export async function getProducts(){
  const sb = initSupabase()
  if(sb){
    const { data, error } = await sb.from('products').select('*')
    if(error) throw error
    return data
  }
  return readJSON(productsPath)
}

export async function saveProducts(products){
  const sb = initSupabase()
  if(sb){
    // replace table contents: simple approach - delete all then insert
    await sb.from('products').delete().neq('id','')
    const { error } = await sb.from('products').insert(products)
    if(error) throw error
    return true
  }
  writeJSON(productsPath, products)
  return true
}

export async function getOrders(){
  const sb = initSupabase()
  if(sb){
    const { data, error } = await sb.from('orders').select('*').order('created_at', { ascending: false })
    if(error) throw error
    return data
  }
  return readJSON(ordersPath)
}

export async function saveOrder(order){
  const sb = initSupabase()
  if(sb){
    const { data, error } = await sb.from('orders').insert(order).select()
    if(error) throw error
    return data && data[0]
  }
  const arr = readJSON(ordersPath)
  arr.unshift(order)
  writeJSON(ordersPath, arr)
  return order
}

export async function updateOrderStatus(id, status){
  const sb = initSupabase()
  if(sb){
    const { data, error } = await sb.from('orders').update({ status }).eq('id', id).select()
    if(error) throw error
    return data && data[0]
  }
  const arr = readJSON(ordersPath)
  const idx = arr.findIndex(a => a.id === id)
  if(idx === -1) return null
  arr[idx].status = status
  writeJSON(ordersPath, arr)
  return arr[idx]
}
