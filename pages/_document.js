import { Html, Head, Main, NextScript } from 'next/document'
import config from '../site.config.json'

export default function Document(){
  return (
    <Html lang="en">
      <Head>
        {/* Fonts: Playfair Display for headings, Inter for body */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet" />
        <meta name="description" content={`${config.name} - Traditional pooja items in ${config.delivery_area}`} />
        {/* Razorpay checkout removed: this project uses local/UPI/WhatsApp flows by default */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
