# Nibbles — Site Brief (MVP Frontend)

## What is Nibbles?
Nibbles is a mobile-first web app that helps a household:
- keep a lightweight inventory of food (Fridge / Freezer / Pantry)
- discover recipe ideas that best match what they already have
- optionally log what they cooked and whether they’d make it again

This MVP is **frontend-only** using **mock data** (persisted in localStorage so it feels real).

## Core principles
- Fast, low friction, “no admin”.
- Recommendations are **suggestions**, not a rigid weekly plan.
- Inventory management is lightweight (no full nutrition tracking, no barcode catalogue building).
- Respect mobile ergonomics: thumb-friendly, bottom navigation, sheets/modals.

## Recipe sources
Primary:
- Marion’s Kitchen (all recipes)
Optional:
- BBC Good Food “easy dinner” collections and similar

In MVP:
- Recipes are mocked (seeded in the app).
Later:
- A Cloudflare Worker fetches and caches recipe subsets monthly.

## Inventory scope
Inventory items are stored as:
- name
- location: fridge/freezer/pantry
- stock status: in_stock / low / out_of_stock
- category (for ageing flags): fresh/chilled/meat_fish/frozen/pantry/other
- added_at timestamp (used to compute “getting old” warnings)

Quantity is not critical at MVP stage.
No auto-deduction from inventory when cooking.

## Ageing flags (based on added_at)
Items can show an icon indicating they’re getting old. These thresholds are defaults:
- fresh: old at 7 days, very old at 10 days
- chilled: old at 10 days, very old at 14 days
- meat_fish (fridge): old at 2 days, very old at 3 days
- frozen: never
- pantry: never
- other: never (unless later configured)

## Household mode
A lightweight mode to avoid “explaining” skips:
- Normal
- Away (optional date range + label e.g. Holiday)

When Away is enabled:
- the app should not penalise skipped meals
- recipes remain browseable as suggestions

## Logging (recipe outcomes)
When a recipe is marked cooked, allow a lightweight recap:
- Cooked (required)
- Make again? yes/no (required)
Optional:
- rating (1–5 or thumbs)
- leftovers: none / 1 portion / 2+
- shop size: none / small / big
- reason tags (why picked): quick/use-up/healthy/comfort/craving/impress/low effort
- substitutions: expected ingredient -> used ingredient (+ worked well)

## MVP deliverable
A polished mobile UI with:
- Inventory tab
- Recipes tab (Best matches / Explore)
- Settings tab (theme + away mode)
- Mock data and localStorage persistence

No backend, no Cloudflare integration, no real scraping in MVP.