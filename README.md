# Nibbles 🥐✨

Nibbles is a mobile-first household food inventory + recipe discovery web app.
It’s designed to be low-friction: light inventory tracking (Fridge/Freezer/Pantry), recipe suggestions that match what you have, and optional “cooked / make again” logging.

## Repo structure

- `app/` — Frontend (Vite + React + TypeScript). Deployed via Cloudflare Pages.
- `docs/` — Product spec and Claude Project files (source of truth for the MVP build).
- `worker/` — Cloudflare Worker / API (planned; not required for MVP).
- `db/` — D1 schema + seed SQL (planned; not required for MVP).
- `scripts/` — One-off scripts (optional).

## MVP scope (current phase)

Frontend-only with:
- Bottom tab navigation: Inventory / Recipes / Settings
- Inventory grouped by Fridge / Freezer / Pantry
- Optional “ageing” flags based on when an item was added
- Recipes list with Best matches + Explore
- Filters: recipe source (Marion’s/BBC), protein, ingredient search
- Logging: cooked + make again (required), with optional rating, leftovers, shop size, reasons, substitutions
- Mock data + localStorage persistence

Non-goals for MVP:
- Real barcode scanning
- Open Food Facts lookup
- Cloudflare Workers/D1 backend
- Recipe scraping/caching

## Getting started (frontend)

```bash
cd app
npm install
npm run dev