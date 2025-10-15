# Launch checklist — Kumar Pooja Store (MVP)

1. Provision repo & deploy
   - Push this project to GitHub.
   - Connect GitHub repo to Vercel and deploy (free tier). Set build command: `npm run build` and output dir default.

2. Replace placeholders
   - Update WhatsApp number in `pages/contact.js`, `components/WhatsAppButton.jsx`, `pages/checkout.js`.
   - Add `public/logo.png`, `public/hero-banner.jpg`, and product images under `public/` (paths match `data/*.json`).

3. Product data
   - Edit `data/products.json` with real SKUs, prices, descriptions, and stock.

4. SEO & analytics
   - Add meta tags per page and Open Graph images.
   - Add GA4 tracking snippet or Vercel analytics.

5. Test
   - Test desktop and mobile flows: browse, add to cart, checkout (WhatsApp order), contact form.

6. Production steps (later)
   - Integrate Razorpay for payments.
   - Add admin (Medusa/Strapi/Shopify) and migrate products.
