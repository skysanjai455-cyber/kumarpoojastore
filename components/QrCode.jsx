import { useEffect, useState } from 'react'

export default function QrCode({ value, size = 240 }){
  const [dataUrl, setDataUrl] = useState(null)

  useEffect(() => {
    let mounted = true
    async function make() {
      try{
        const QRCode = (await import('qrcode')).default
        const url = await QRCode.toDataURL(value || '', { width: size })
        if(mounted) setDataUrl(url)
      }catch(e){
        console.error('QR generation failed', e)
      }
    }
    make()
    return () => { mounted = false }
  }, [value, size])

  if(!value) return null
  return (
    <div className="qr-wrapper">
      {dataUrl ? <img src={dataUrl} alt="QR code" width={size} height={size} /> : <div className="w-60 h-60 bg-gray-100 flex items-center justify-center">Generating...</div>}
    </div>
  )
}
