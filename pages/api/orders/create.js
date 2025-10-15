// Simple orders/create API: persist orders locally to data/orders.json
// External integrations (Google Sheets / SendGrid / Razorpay) removed per project request.

import { saveOrder } from '../../../lib/db'

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const order = req.body || {}
  try{
    const saved = { id: Date.now().toString(), created_at: new Date().toISOString(), ...order }
    const out = await saveOrder(saved)
    return res.json({ ok: true, order: out })
  }catch(e){
    console.error('order create failed', e)
    return res.status(500).json({ ok: false, error: e.message })
  }
}
