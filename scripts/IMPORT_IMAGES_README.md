Import images CSV helper

Purpose
- Map images (local files or already-public paths) to products in data/products.json.

CSV format
- First column: idOrSlug
- Remaining columns: image paths (you may provide multiple image columns)
- Within an image column you may also provide multiple paths separated by semicolons: image1;image2
- Lines starting with '#' are ignored.
- imagePath rules:
   - If it starts with '/', it is treated as a public path and used directly (e.g. /images/foo.jpg).
   - Otherwise the path is treated as a filesystem path (absolute or relative). The file will be copied into public/images/ and referenced as /images/<slug><ext>.

Usage
1. Prepare a CSV (see sample_images.csv) with rows like:
   slug-001,./my-images/product-1.jpg
   5,/images/already-hosted.jpg

2. Run from the project root (Windows PowerShell):
   node .\\scripts\\import_images_csv.js .\\scripts\\sample_images.csv --dry-run
   # When ready to apply changes:
   node .\\scripts\\import_images_csv.js .\\scripts\\sample_images.csv --merge

Flags
- --dry-run : show planned changes without copying files or writing `data/products.json`.
- --merge : when set, new images are appended to existing `product.images` arrays (deduplicated). Without --merge, images from the CSV replace the product's images.

Notes
- The script updates data/products.json in-place. Make a backup if needed.
- The script finds products by matching the CSV first column to either product.id or product.slug.
- If a mapping row doesn't match any product, it's reported and skipped.
- This helper is intended for local usage before deploying. On Netlify the local public folder is uploaded during deploy; you still need to include images in the repo or upload them to an external host.
