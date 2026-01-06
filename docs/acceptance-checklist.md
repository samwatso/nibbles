# Nibbles — Acceptance Checklist (Frontend MVP)

## General
- [ ] Runs locally via `npm install` + `npm run dev`
- [ ] Mobile-first layout, tested on iPhone-sized viewport
- [ ] Bottom tab bar fixed and respects safe-area insets
- [ ] No heavy UI framework; clean, fast UI

## Theme
- [ ] Light/Dark/System modes implemented
- [ ] Default follows system
- [ ] Manual override persists in localStorage
- [ ] All surfaces/text remain readable in both themes

## Inventory tab
- [ ] Items grouped by Fridge / Freezer / Pantry
- [ ] Item rows show name + optional chips/icons
- [ ] Age flag appears based on added_at + category rules
- [ ] Select mode supports multi-select
- [ ] Bulk actions: Delete, Move location, Mark out_of_stock
- [ ] “+ Add” sheet supports manual add
- [ ] “Scan barcode” placeholder exists and can add an item via mock barcode flow
- [ ] Inventory changes persist in localStorage

## Recipes tab
- [ ] Best matches / Explore segmented control works
- [ ] Filters: source toggles + protein + ingredient search
- [ ] Recipe cards display source + match percent + missing count
- [ ] “View missing” modal groups missing items by Fridge/Freezer/Pantry
- [ ] “Mark cooked” logging sheet works:
  - [ ] requires Make again
  - [ ] optional rating/leftovers/shop size/reasons/substitutions
- [ ] Interactions persist in localStorage

## Settings tab
- [ ] Theme toggle works (System/Light/Dark)
- [ ] Household mode supports Normal/Away (with optional label/date range)
- [ ] Away mode displays a subtle banner in Recipes and avoids negative skip logging

## Non-goals (MVP)
- [ ] No real barcode scanning yet
- [ ] No Open Food Facts calls yet
- [ ] No Cloudflare Workers/D1 yet
- [ ] No recipe scraping yet
- [ ] No automatic inventory deduction