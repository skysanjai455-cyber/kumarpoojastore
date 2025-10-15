import categories from '../../data/categories.json'
import products from '../../data/products.json'
import ProductCard from '../../components/ProductCard'

export default function CategoryPage({ category, items }){
  if(!category) return <div>Category not found</div>
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{category.name}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(i => <ProductCard key={i.id} product={i} />)}
      </div>
    </div>
  )
}

export async function getStaticPaths(){
  const paths = categories.map(c => ({ params: { slug: c.slug } }))
  return { paths, fallback: true }
}

export async function getStaticProps({ params }){
  const category = categories.find(c => c.slug === params.slug) || null
  const items = products.filter(p => p.category === params.slug)
  return { props: { category, items } }
}
