import products from '../../data/products.json'
import { useRouter } from 'next/router'
import WhatsAppButton from '../../components/WhatsAppButton'

export default function ProductPage({ product }){
  const router = useRouter()
  if(router.isFallback) return <div>Loading...</div>

  if(!product) return <div>Product not found</div>

  const waText = `I'd like to order: ${product.name} (₹${product.price})`;

  const ld = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description,
    "sku": product.id,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "INR",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  }

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="grid md:grid-cols-2 gap-6 kp-decorative p-4">
        <img src={product.images?.[0] || '/hero-banner.jpg'} alt={product.name} className="w-full h-96 object-cover rounded" />
        <div>
          <h1 className="text-2xl font-bold heading">{product.name}</h1>
          <p className="text-kp-gold text-xl font-semibold mt-2 kp-gold-text">₹{product.price}</p>
          {product.compareAt && <p className="text-gray-400 line-through">₹{product.compareAt}</p>}
          <p className="mt-4 lead">{product.description}</p>
          <div className="mt-6">
            <WhatsAppButton text={waText} />
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getStaticPaths(){
  const paths = products.map(p => ({ params: { slug: p.slug } }))
  return { paths, fallback: true }
}

export async function getStaticProps({ params }){
  const product = products.find(p => p.slug === params.slug) || null
  return { props: { product } }
}
