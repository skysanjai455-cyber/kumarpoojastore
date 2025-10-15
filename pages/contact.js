import config from '../site.config.json'

export default function Contact() {
  const number = config.whatsapp.replace('+','')
  const message = encodeURIComponent(`Hi, I would like to place an order from ${config.name}. Here are the items:`)
  const waLink = `https://wa.me/${number}?text=${message}`

  return (
    <div className="kp-decorative p-6 decorative-corner">
      <h1 className="text-3xl font-bold mb-4 heading">Contact / Order via WhatsApp</h1>
      <p className="mb-2">Address: {config.address}</p>
      <p className="mb-4">Phone: {config.phones.join(' | ')}</p>
      <div className="mb-4">Delivery area: {config.delivery_area}. Shipping: {config.shipping === 'local_pickup' ? 'Local pickup only' : config.shipping}</div>
      <a href={waLink} target="_blank" rel="noreferrer" className="inline-block bg-maroon text-white px-4 py-2 rounded">Order on WhatsApp</a>
    </div>
  )
}
