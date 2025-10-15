export const CART_KEY = 'kp_cart'

// server-safe helper: localStorage is only available in browser
function hasLocalStorage(){
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

// in-memory fallback used during SSR or if localStorage is unavailable
let memoryCart = []

export function getCart(){
  try{
    if(hasLocalStorage()){
      const raw = window.localStorage.getItem(CART_KEY)
      return raw ? JSON.parse(raw) : []
    }
    return memoryCart
  }catch(e){
    console.error('getCart error', e)
    return []
  }
}

export function saveCart(cart){
  try{
    if(hasLocalStorage()){
      window.localStorage.setItem(CART_KEY, JSON.stringify(cart))
    }else{
      memoryCart = cart
    }
  }catch(e){
    console.error('saveCart error', e)
  }
}

export function addToCart(item){
  const cart = getCart()
  const existing = cart.find(c => c.id === item.id)
  if(existing){
    existing.quantity = (existing.quantity || 1) + (item.quantity || 1)
  }else{
    cart.push({ ...item, quantity: item.quantity || 1 })
  }
  saveCart(cart)
  return cart
}

export function removeFromCart(id){
  const cart = getCart().filter(i => i.id !== id)
  saveCart(cart)
  return cart
}

export function clearCart(){
  saveCart([])
}

export function cartTotal(){
  const cart = getCart()
  return cart.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 1), 0)
}
