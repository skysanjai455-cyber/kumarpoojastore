export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const order = req.body || {}

  // Create a unique order id
  const orderId = 'ORDER_' + Date.now()

  // This project uses a local fallback for Paytm UPI (no merchant integration).
  // Persist the order to data/orders.json and return the saved id.
  try{
    const fs = require('fs')
    const path = require('path')
    const p = path.join(process.cwd(), 'data', 'orders.json')
    let arr = []
    try{ arr = JSON.parse(fs.readFileSync(p,'utf8')) }catch(e){ arr = [] }
    const saved = { id: orderId, created_at: new Date().toISOString(), ...order }
    arr.unshift(saved)
    fs.writeFileSync(p, JSON.stringify(arr, null, 2))
    return res.json({ ok: true, orderId, order: saved })
  }catch(e){
    console.error('paytm fallback failed', e)
    return res.status(500).json({ ok: false, error: e.message })
  }
}
