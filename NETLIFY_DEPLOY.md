# Deploying to Netlify — checklist

This file summarizes the minimal steps and recommended options to deploy this Next.js project to Netlify and make the admin + orders features usable in production.

Important note about persistence
- This project currently persists products and orders to files under `data/`.
- Netlify functions run in a serverless environment where the filesystem is ephemeral — writes to disk are not guaranteed to persist across function invocations or deploys.
- For a production-ready deployment you should use an external persistent store (Supabase/Postgres/Firebase/AWS S3 for images + DB for structured data).

Minimal deploy checklist
1. Build & deploy settings
   - Build command: `npm run build`
   - Publish directory: `.next` (Netlify's Next.js support will detect and route functions automatically). If using Netlify adapter, follow Netlify docs.

2. Environment variables (set these in Netlify site settings -> Build & deploy -> Environment)
   - OPTIONAL (if you implement Supabase persistence): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`.

3. Files & assets
   - Ensure `public/products/` contains your product images. Netlify will serve files under `public/` statically.
   - If you want admin image uploads, configure an external object store (Supabase storage, S3) and implement server/API handlers to upload images there.

4. Persistence options (pick one)
   - Keep local-file approach (NOT RECOMMENDED): Quick deploy but orders/products edits are not reliably persisted. Use only for demonstration.
   - Supabase (recommended): Create a Supabase project, add tables `products` and `orders`, use service role key for server APIs to write. Update API routes to use Supabase client and set `SUPABASE_*` env vars on Netlify.
   - Postgres / Managed DB: Use a hosted Postgres and update server APIs to connect with a connection string in env vars.

5. Admin image uploads
   - Implement server API to accept an image and store in Supabase Storage or S3. Return the public URL (or object path) to save in product `images`.

6. Security & hardening
   - Use a strong `ADMIN_PASSWORD` and store it in Netlify environment variables.
   - For Supabase, use the service role key only server-side; never expose it to client code.

Quick switch to Supabase (outline)
1. Create a Supabase project.
2. Create tables `products` and `orders` with required fields (id PK, JSON payloads, created_at timestamps, status string, etc.).
3. Add a Supabase service role key to Netlify env as `SUPABASE_SERVICE_ROLE_KEY`.
4. Replace file read/write in API routes (e.g., `pages/api/orders/create.js`, `pages/api/admin/products.js`, `pages/api/admin/orders.js`) with Supabase client queries.
 
Supabase migration steps (quick)
1. Create a Supabase project and a storage bucket named `public`.
2. Run the SQL in `supabase/schema.sql` (Supabase SQL editor) to create `products` and `orders` tables.
3. Add your Supabase URL and Service Role Key to Netlify environment vars: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and set `ADMIN_PASSWORD`.
4. Optionally run locally to import products from `data/products.json`:

   ```powershell
   $env:SUPABASE_URL = 'https://xyz.supabase.co'
   $env:SUPABASE_SERVICE_ROLE_KEY = 'service_role_...'
   node scripts/import_supabase.js
   ```

5. Deploy the site on Netlify. The server will use the Service Role Key for server APIs and uploads.

If you want I can implement the Supabase migration (APIs + small schema + admin image upload UI). Reply with 'Supabase' to proceed and provide the Supabase project URL and a temporary service role key, or say 'Checklist only' to stop here.
