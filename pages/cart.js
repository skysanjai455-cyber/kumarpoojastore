import { useEffect, useState } from 'react'

export default function Cart() {
  const [cart, setCart] = useState([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('kp_cart')
      if (raw) setCart(JSON.parse(raw))
    } catch (e) {
      console.error(e)
    }
  }, [])

  if (!cart || cart.length === 0) return <p>Your cart is empty.</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      <ul>
        {cart.map((item, idx) => (
          <li key={idx} className="mb-2">{item.name} x {item.quantity}</li>
        ))}
      </ul>
    </div>
  )
}
