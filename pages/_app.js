import '../styles/globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { CartProvider } from '../components/CartContext'
import CartSlideOver from '../components/CartSlideOver'

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <Component {...pageProps} />
        </main>
        <Footer />
        <CartSlideOver />
      </div>
    </CartProvider>
  )
}
