import Link from 'next/link'
import { addToCart } from '../lib/storage'
import { useState } from 'react'
import config from '../site.config.json'

export default function ProductCard({ product }){
  const [added, setAdded] = useState(false)

  function handleAdd(){
    addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1 })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  async function quickWhatsAppOrder(){
    // create a minimal order record then open WhatsApp with a prefilled message
    try{
      const payload = { items: [{ id: product.id, name: product.name, qty: 1 }], total: product.price || 0, payment: 'whatsapp' }
      const r = await fetch('/api/orders/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await r.json()
      const num = (config.whatsapp || '').replace('+','')
      const orderId = data && data.order && data.order.id ? `\nOrder ID: ${data.order.id}` : ''
      const priceText = product.price ? `\nPrice: ₹${product.price}` : ''
      const upiInfo = []
      if(config.payment === 'gpay' && config.upi_vpa) upiInfo.push(`GPay UPI: ${config.upi_vpa}`)
      if(config.paytm && config.paytm.upi_vpa) upiInfo.push(`Paytm UPI: ${config.paytm.upi_vpa}`)
      const upiText = upiInfo.length ? `\nPayment options:\n${upiInfo.join('\n')}` : ''
      const msg = encodeURIComponent(`Hello, I'd like to order:${product.name} x1${priceText}${orderId}${upiText}`)
      window.open(`https://wa.me/${num}?text=${msg}`, '_blank')
    }catch(e){
      console.error('quick order failed', e)
      alert('Unable to start WhatsApp order. You can still add to cart and order from checkout.')
    }
  }

  function openUpiLink(vpa){
    const amount = product.price ? String(product.price) : ''
    const upi = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(config.name)}&tn=${encodeURIComponent(product.name)}&am=${encodeURIComponent(amount)}&cu=INR`
    window.location.href = upi
  }

  return (
    <div className="kp-decorative overflow-hidden transform hover:-translate-y-1 transition-all duration-200">
      <div className="bg-gray-100 overflow-hidden flex items-center justify-center relative">
        <div className="kp-aspect-4-3 w-full overflow-hidden">
          <img src={product.images?.[0] || '/hero-banner.jpg'}
               alt={product.name || 'Product image'}
               className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300" />
        </div>
        {product.price && (
          <div className="absolute left-3 top-3 bg-white/90 text-xs text-maroon px-2 py-1 rounded shadow kp-price-badge">₹{product.price}</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-2 text-maroon">{product.name}</h3>
        <p className="text-sm text-gray-700 mb-3 line-clamp-3">{product.description || ''}</p>

        <div className="flex items-center justify-between">
          <div>
            {!product.price && <div className="text-sm text-gray-600">Contact for price</div>}
            {product.compareAt && <div className="text-sm text-gray-400 line-through">₹{product.compareAt}</div>}
          </div>

          <div className="flex flex-col items-end gap-2">
            <Link href={`/product/${product.slug || product.id}`} className="text-sm text-maroon underline">View</Link>
            <div className="flex gap-2 mt-2">
              <button onClick={handleAdd}
                      aria-label="Add to cart"
                      className="bg-maroon hover:opacity-95 text-white rounded px-3 py-1 text-sm shadow-sm transition-colors">
                {added ? 'Added' : 'Add'}
              </button>
              <button onClick={quickWhatsAppOrder}
                      aria-label="Order via WhatsApp"
                      className="bg-green-600 hover:bg-green-700 text-white rounded px-3 py-1 text-sm shadow-sm transition-colors">
                WhatsApp
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          {config.payment === 'gpay' && config.upi_vpa ? (
            <button onClick={() => openUpiLink(config.upi_vpa)} className="text-sm px-3 py-1 border rounded">GPay</button>
          ) : null}
          {config.paytm && config.paytm.upi_vpa ? (
            <button onClick={() => openUpiLink(config.paytm.upi_vpa)} className="text-sm px-3 py-1 border rounded">Paytm</button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
