import { useCart } from './CartContext'
import { removeFromCart, clearCart, cartTotal } from '../lib/storage'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

export default function CartSlideOver(){
  const { open, setOpen, items, setItems } = useCart()
  const panelRef = useRef(null)
  const previousActiveRef = useRef(null)

  if(!open) return null

  function handleRemove(id){
    const newCart = removeFromCart(id)
    setItems(newCart)
  }

  function handleClear(){
    clearCart()
    setItems([])
  }

  const total = cartTotal()

  useEffect(() => {
    // focus trap: save previously focused element
    previousActiveRef.current = document.activeElement
    const panel = panelRef.current
    if(!panel) return
    const focusable = panel.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])')
    const focusableEls = Array.from(focusable).filter(el => !el.hasAttribute('disabled'))
    if(focusableEls.length) focusableEls[0].focus()

    function onKeyDown(e){
      if(e.key === 'Escape') { setOpen(false) }
      if(e.key !== 'Tab') return
      const first = focusableEls[0]
      const last = focusableEls[focusableEls.length - 1]
      if(e.shiftKey){
        if(document.activeElement === first){
          e.preventDefault(); last.focus()
        }
      } else {
        if(document.activeElement === last){
          e.preventDefault(); first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      // restore focus
      try{ previousActiveRef.current && previousActiveRef.current.focus() }catch(e){}
    }
  }, [setOpen])

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1" onClick={() => setOpen(false)} />
  <div ref={panelRef} className="w-96 p-4 kp-decorative" role="dialog" aria-modal="true">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold heading">Your cart</h2>
          <button onClick={() => setOpen(false)} className="text-gray-600">Close</button>
        </div>
        <div className="space-y-2 mb-4">
          {items.length === 0 && <div>Your cart is empty.</div>}
          {items.map((it, idx) => (
            <div key={idx} className="flex justify-between">
              <div>{it.name} x {it.quantity}</div>
              <div className="flex gap-2"><div className="font-semibold">₹{it.price * it.quantity}</div><button onClick={() => handleRemove(it.id)} className="text-sm text-maroon">Remove</button></div>
            </div>
          ))}
        </div>
        <div className="mb-4 font-semibold">Total: <span className="kp-gold-text">₹{total}</span></div>
        <div className="flex gap-2">
          <Link href="/checkout" className="bg-maroon text-white px-4 py-2 rounded">Checkout</Link>
          {/* WhatsApp order: build message from cart items */}
          <a href={`https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP || '919489657260')}?text=${encodeURIComponent(items.map(i => `${i.name} x ${i.quantity}`).join('%0A'))}`} target="_blank" rel="noreferrer" className="bg-green-600 text-white px-4 py-2 rounded">Order on WhatsApp</a>
          <button onClick={handleClear} className="bg-gray-200 px-3 py-2 rounded">Clear</button>
        </div>
      </div>
    </div>
  )
}
