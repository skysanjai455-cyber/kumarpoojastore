import config from '../site.config.json'
import Flourish from './Flourish'

export default function Footer(){
  return (
    <footer className="mt-8">
  <div className="container py-6 text-sm text-gray-700 kp-decorative footer-text">
        <div className="mb-3"><strong>© {new Date().getFullYear()} {config.name}</strong> — {config.address}</div>
        <div className="mb-3">WhatsApp: {config.whatsapp} | Phones: {config.phones.join(', ')}</div>
        <div className="mt-4"><Flourish className="w-48" /></div>
      </div>
    </footer>
  )
}
