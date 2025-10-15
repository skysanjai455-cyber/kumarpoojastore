import HeroBanner from '../components/HeroBanner'
import CategorySection from '../components/CategorySection'
import ProductCard from '../components/ProductCard'
import products from '../data/products.json'

export default function Home() {
  return (
    <>
      <HeroBanner />
      <section className="container py-8 kp-decorative p-6">
        <h2 className="text-2xl font-semibold mb-4 heading">Featured Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.slice(0,8).map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
      <CategorySection />
    </>
  )
}
