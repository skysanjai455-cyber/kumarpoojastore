import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function ThankYou(){
  const router = useRouter()
  const { id } = router.query
  const [order, setOrder] = useState(null)

  useEffect(()=>{
    if(!id) return
    fetch('/api/orders/local').then(r=>r.json()).then(arr=>{
      const found = arr.find(o=>o.id === id)
      setOrder(found || null)
    })
  },[id])

  if(!id) return <p>Loading...</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Thank you for your order</h1>
      <p className="mb-2">Order ID: <strong>{id}</strong></p>
      {order ? (
        <div>
          <p>Name: {order.name}</p>
          <p>Phone: {order.phone}</p>
          <p>Total: ₹{order.total}</p>
          <ul className="mt-2">
            {order.items.map((it,idx)=>(<li key={idx}>{it.name} x {it.quantity}</li>))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-gray-600">Order details not found locally yet. Please check back or contact the store.</p>
      )}
      <div className="mt-4">
        <a href="/" className="text-saffron underline">Back to store</a>
      </div>
    </div>
  )
}
