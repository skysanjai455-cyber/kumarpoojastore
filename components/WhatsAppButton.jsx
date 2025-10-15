import config from '../site.config.json'

export default function WhatsAppButton({ number = null, text = '' }){
  // Render WhatsApp button unless specifically disabled by config.hide_whatsapp
  if(config.hide_whatsapp) return null
  const num = (number || config.whatsapp).replace('+','')
  const href = `https://wa.me/${num}?text=${encodeURIComponent(text)}`
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-block px-3 py-2 rounded border-2 kp-wa-btn">Order on WhatsApp</a>
  )
}
