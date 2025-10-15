import Link from 'next/link'
import config from '../site.config.json'
import { useCart } from './CartContext'
import { getCart } from '../lib/storage'
import { useEffect, useState } from 'react'

export default function Header(){
  const { setOpen } = useCart()
  const [count, setCount] = useState(0)

  useEffect(() => {
    const c = getCart()
    setCount(c.reduce((s, i) => s + (i.quantity || 1), 0))
  }, [])

  return (
    <header className="bg-transparent">
      <div className="container flex items-center justify-between py-3 md:py-4 kp-decorative">
        <Link href="/" className="flex items-center">
          <img src={config.logo} alt={config.name} className="h-12 w-12 mr-3 rounded-full border-2 kp-logo-gold" />
          <span className="font-bold text-xl tracking-tight text-maroon">{config.name}</span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="space-x-4 hidden md:block text-sm">
            <Link href="/products" className="hover:text-maroon">Products</Link>
            <Link href="/about" className="hover:text-maroon">About</Link>
            <Link href="/contact" className="hover:text-maroon">Contact</Link>
          </nav>
          <div className="hidden md:block text-sm text-gray-700">{config.phones.join(' | ')}</div>
          <button onClick={() => setOpen(true)} className="relative bg-maroon text-white px-3 py-1 rounded-md shadow-sm hover:opacity-95">
            <span className="sr-only">Open cart</span>
            <span className="font-medium">Cart</span>
            <span className="kp-cart-badge">{count}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
