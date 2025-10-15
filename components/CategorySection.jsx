import Link from 'next/link'

export default function CategorySection(){
  const categories = [
    { id: 'c1', name: 'Agarbathis', slug: 'agarbathis' },
    { id: 'c2', name: 'Kits & Packages', slug: 'kits' },
    { id: 'c3', name: 'Lamps', slug: 'lamps' }
  ]

  return (
    <section className="container py-8 kp-decorative p-4">
      <h2 className="text-2xl font-semibold mb-4 heading">Categories</h2>
      <div className="decorative-sep mb-4" />
      <div className="flex gap-4">
        {categories.map(c => (
          <Link key={c.id} href={`/category/${c.slug}`} className="bg-cream px-4 py-3 rounded shadow text-maroon">{c.name}</Link>
        ))}
      </div>
    </section>
  )
}
