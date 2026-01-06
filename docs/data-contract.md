# Nibbles — Data Contract (Mock-first)

## Enums

### Location
- fridge
- freezer
- pantry

### StockStatus
- in_stock
- low
- out_of_stock

### Category (ageing rules)
- fresh
- chilled
- meat_fish
- frozen
- pantry
- other

### RecipeSource
- marion
- bbc

### Leftovers
- none
- one
- two_plus

### ShopSize
- none
- small
- big

### HouseholdMode
- normal
- away

---

## Types (TypeScript shape)

### InventoryItem
- id: string
- name: string
- location: Location
- category: Category
- stock_status: StockStatus
- added_at: string (ISO)
- updated_at: string (ISO)

### Recipe
- id: string
- source: RecipeSource
- title: string
- url: string
- protein_hint?: "chicken" | "beef" | "pork" | "fish" | "veg"
- ingredients: RecipeIngredient[]

### RecipeIngredient
- raw: string
- norm_key: string

### RecipeInteraction
- id: string
- recipe_id: string
- action: "interested" | "planned" | "cooked" | "skipped"
- created_at: string (ISO)
- make_again?: boolean
- rating?: number
- leftovers?: Leftovers
- shop_size?: ShopSize
- reason_tags?: string[]
- notes?: string

### RecipeSubstitution
- id: string
- interaction_id: string
- expected_norm: string
- used_norm: string
- worked_well?: boolean

### HouseholdState
- mode: HouseholdMode
- away_start?: string (ISO date)
- away_end?: string (ISO date)
- away_label?: string

---

## Normalisation & matching

### Normalise keys
- lowercase
- trim
- remove obvious quantity/unit prefixes (best-effort)
- apply synonyms map (see below)

### Synonyms map (seed examples)
- scallions -> spring onion
- spring onions -> spring onion
- minced beef -> beef mince
- ground beef -> beef mince
- minced pork -> pork mince

### Match score
For a recipe:
- required = set of ingredient norm_keys
- have = set of inventory item norm_keys (derived from item name + synonyms)
- matched = intersection
- match_percent = matched_count / required_count

Missing list = required - have

---

## Shelf-life rules (defaults)

Store as:
- category -> { old_days, very_old_days }

Defaults:
- fresh: 7 / 10
- chilled: 10 / 14
- meat_fish: 2 / 3
- frozen: null / null
- pantry: null / null
- other: null / null