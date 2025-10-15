import { createContext, useContext, useState, useEffect } from 'react'
import { getCart } from '../lib/storage'

const CartContext = createContext()

export function CartProvider({ children }){
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])

  useEffect(() => {
    setItems(getCart())
  }, [])

  return (
    <CartContext.Provider value={{ open, setOpen, items, setItems }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(){
  return useContext(CartContext)
}
