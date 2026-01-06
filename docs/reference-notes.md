# Nibbles — Reference Notes

## Future backend (not in MVP)
Planned Cloudflare architecture:
- Cloudflare Pages hosts the frontend
- Pages Functions or a Worker provides API
- Cloudflare D1 stores:
  - inventory_items
  - recipes + recipe_ingredients
  - recipe_interactions + substitutions
  - synonyms + shelf_life_rules
- Monthly Cron Worker refreshes recipe cache from:
  - Marion’s Kitchen
  - BBC Good Food
Barcode scanning plan:
- iOS Safari requires JS scanning library (e.g. ZXing) rather than BarcodeDetector
- After scan, look up product details via Open Food Facts API
- Always allow manual override if product not found

## Product philosophy
Nibbles should feel like:
- an elegant assistant, not a data-entry chore
- suggestions, not rigid meal scheduling