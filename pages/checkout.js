import { useEffect, useState } from 'react'
import { getCart, cartTotal, clearCart } from '../lib/storage'
import config from '../site.config.json'
import WhatsAppButton from '../components/WhatsAppButton'
import QrCode from '../components/QrCode'

export default function Checkout(){
  const [cart, setCart] = useState([])
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setCart(getCart())
    // prefill customer info from localStorage
    try{
      const n = localStorage.getItem('kp_customer_name')
      const p = localStorage.getItem('kp_customer_phone')
      if(n) setCustomerName(n)
      if(p) setCustomerPhone(p)
    }catch(e){}
  }, [])

  const total = cartTotal()

  const [payNotify, setPayNotify] = useState(false)

  const upiVpa = config.upi_vpa
  const upiLink = `upi://pay?pa=${encodeURIComponent(upiVpa)}&pn=${encodeURIComponent(config.name)}&tn=Order%20from%20${encodeURIComponent(config.name)}&am=${encodeURIComponent(total)}&cu=INR`

  const paytmUpi = config.paytm && config.paytm.upi_vpa ? config.paytm.upi_vpa : null

  if(!cart || cart.length === 0) return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
      <p className="text-sm text-gray-600">Browse products and add items to the cart to place an order.</p>
    </div>
  )

  function validate(){
    const e = {}
    if(!customerName || customerName.trim().length < 2) e.name = 'Please enter your name'
    const phoneDigits = (customerPhone || '').replace(/\D/g,'')
    // basic international-friendly check: between 9 and 15 digits
    if(phoneDigits.length < 9 || phoneDigits.length > 15) e.phone = 'Please enter a valid phone number (9-15 digits)'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-maroon">Checkout</h1>
      <div className="mb-3 text-sm text-gray-700">Pickup address: {config.address}</div>
      <div className="mb-4 text-sm text-gray-700">Contact: {config.phones.join(' | ')}</div>

      <div className="p-4 mb-4 kp-decorative">
        <h2 className="font-semibold mb-2">Items in your cart</h2>
        <ul>
          {cart.map((it, idx) => (
            <li key={idx} className="py-3 border-b last:border-b-0 flex justify-between items-center">
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-sm text-gray-500">Qty: {it.quantity}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">₹{(it.price || 0) * (it.quantity || 1)}</div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-3 text-right font-bold text-lg">Total: <span className="kp-gold-text">₹{total}</span></div>
      </div>

      <div className="p-4 mb-4 kp-decorative">
        <h2 className="font-semibold mb-2">Your details</h2>
        <label className="block mb-1 text-sm">Name</label>
        <input value={customerName} onChange={e=>setCustomerName(e.target.value)} className="border px-3 py-2 w-full mb-2 rounded" />
        {errors.name && <div className="text-red-600 text-sm mb-2">{errors.name}</div>}
        <label className="block mb-1 text-sm">Phone</label>
        <input value={customerPhone} onChange={e=>setCustomerPhone(e.target.value)} className="border px-3 py-2 w-full mb-2 rounded" />
        {errors.phone && <div className="text-red-600 text-sm mb-2">{errors.phone}</div>}
      </div>

  <div className="flex flex-col md:flex-row gap-3">
        {config.payment === 'gpay' && upiVpa ? (
          <button onClick={async (e) => {
            e.preventDefault()
            if(!validate()) return
            setSaving(true)
            const payload = { items: cart, total, contact: config.phones.join(' | '), name: customerName, phone: customerPhone, payment: 'upi' }
            const r = await fetch('/api/orders/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
            const data = await r.json()
            try{ localStorage.setItem('kp_customer_name', customerName); localStorage.setItem('kp_customer_phone', customerPhone) }catch(e){}
            setSaving(false)
            // open UPI intent
            window.location.href = upiLink
          }} className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:opacity-95">Pay with GPay</button>
        ) : null}

        {paytmUpi ? (
          <button disabled={saving} onClick={async (e) => {
            e.preventDefault()
            if(!validate()) return
            setSaving(true)
            const payload = { items: cart, total, name: customerName, phone: customerPhone, payment: 'paytm_upi' }
            const r = await fetch('/api/orders/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
            const data = await r.json()
            try{ localStorage.setItem('kp_customer_name', customerName); localStorage.setItem('kp_customer_phone', customerPhone) }catch(e){}
            setSaving(false)
            const link = `upi://pay?pa=${encodeURIComponent(paytmUpi)}&pn=${encodeURIComponent(config.name)}&tn=Order%20from%20${encodeURIComponent(config.name)}&am=${encodeURIComponent(total)}&cu=INR`
            window.location.href = link
          }} className="bg-yellow-600 text-white px-4 py-2 rounded-md shadow-sm hover:opacity-95">Pay with Paytm</button>
        ) : null}

        <WhatsAppButton className="w-full md:w-auto" text={`Order from ${config.name}:\nName: ${customerName}\nPhone: ${customerPhone}\nItems:\n${cart.map(i=>`${i.name} x ${i.quantity}`).join('\n')}\nTotal: ₹${total}`} />
      </div>

        <div className="mt-6">
          <button onClick={() => setPayNotify(p => !p)} className="px-3 py-2 border rounded">{payNotify ? 'Hide' : 'Pay & Notify'}</button>
        </div>

        {payNotify && (
          <div className="mt-4 p-4 kp-decorative">
            <h3 className="font-semibold mb-2">Pay & Notify</h3>
            <p className="text-sm text-gray-700 mb-2">Scan the QR code using your UPI app (GPay/Paytm) or use the UPI IDs shown. After paying, please share the payment screenshot on WhatsApp so we can confirm your order.</p>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="bg-gray-50 p-3 rounded flex items-center justify-center">
                {config.payment === 'gpay' && upiVpa ? <QrCode value={`upi://pay?pa=${upiVpa}&pn=${encodeURIComponent(config.name)}&am=${encodeURIComponent(total)}&cu=INR`} size={240} /> : null}
                {config.paytm && config.paytm.upi_vpa ? <QrCode value={`upi://pay?pa=${config.paytm.upi_vpa}&pn=${encodeURIComponent(config.name)}&am=${encodeURIComponent(total)}&cu=INR`} size={240} /> : null}
              </div>
              <div>
                <div className="mb-2"><strong>Amount:</strong> <span className="kp-gold-text">₹{total}</span></div>
                {upiVpa && <div className="mb-1">GPay: <code className="bg-gray-100 px-1 rounded">{upiVpa}</code></div>}
                {paytmUpi && <div className="mb-1">Paytm UPI: <code className="bg-gray-100 px-1 rounded">{paytmUpi}</code></div>}
                <div className="mt-3">
                  <WhatsAppButton text={`I have paid ₹${total} for my order at ${config.name}. Here is the screenshot:`} />
                </div>
              </div>
            </div>
          </div>
        )}

      <div className="mt-4">
        <button onClick={() => { clearCart(); setCart([]) }} className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">Clear cart</button>
      </div>
    </div>
  )
}
