Netlify deployment notes

This project is a Next.js (pages-router) app prepared to deploy with the Netlify Next.js plugin.

Quick checklist before deploy
- Ensure `public/images/` contains the product images you want published (these are copied/added by the CSV import script). Commit them to git before deploy.
- `data/products.json` is source-of-truth for products. If you modify it locally (via the CSV script), commit the changes. Note: Netlify build runners have ephemeral filesystems — runtime writes to `data/` will not persist.
- For persistent orders or admin features, configure an external DB (Supabase or similar) and update `pages/api/orders/*` to use it.

Deploy with Netlify (recommended)
1. Initialize git and commit your project if you haven't already.
2. Create a Netlify site and connect the repository (Netlify UI or CLI).
3. Ensure the Netlify site has the environment variable `NODE_VERSION=18` (optional).
4. Netlify will run `npm run build` and use the Netlify Next plugin to produce the site. The `netlify.toml` in repo already configures the Next plugin.

If you prefer a static export
- Run `npm run build && npm run export` and set Netlify publish directory to `out`. Be aware static export will lose any server-side APIs.

Notes on persistence
- Orders saved to `data/orders.json` or local JSON files will NOT persist across deploys. Use Supabase or other DB to persist orders.
