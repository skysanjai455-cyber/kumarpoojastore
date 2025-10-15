import { getOrders, saveOrder } from '../../../lib/db'

export default async function handler(req, res){
  if(req.method === 'GET'){
    try{
      const orders = await getOrders()
      return res.json(orders)
    }catch(e){
      console.error('read orders failed', e)
      return res.json([])
    }
  }

  if(req.method === 'POST'){
    try{
      const order = req.body
      await saveOrder(order)
      return res.json({ ok: true })
    }catch(e){
      console.error('write orders failed', e)
      return res.status(500).json({ ok: false })
    }
  }

  res.status(405).end()
}
