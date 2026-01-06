# Nibbles — UI Specification (Frontend MVP)

## Navigation
Bottom tab bar (fixed):
1. Inventory
2. Recipes
3. Settings

Tabs should be stable and stateful (don’t reset scroll unnecessarily).

---

## Inventory tab

### Screen structure
- Header: "Inventory"
- Content: grouped lists by location:
  - Fridge
  - Freezer
  - Pantry

### List item row
Display:
- Food name (primary)
Optional indicators:
- Stock status chip: In stock / Low / Out
- Age flag icon: old (amber) / very old (red)

### Controls
- "Select" toggle to enter multi-select mode:
  - tick boxes per row
  - bulk actions:
    - Delete
    - Move to… (fridge/freezer/pantry)
    - Mark out_of_stock
- Floating action button “+”:
  - opens bottom sheet:
    - Scan barcode (placeholder UI in MVP)
    - Add manually (form)

### Add manually form fields (MVP)
Required:
- name
- location (fridge/freezer/pantry)
Optional:
- category (fresh/chilled/meat_fish/frozen/pantry/other)
- stock status (default in_stock)

### Add by barcode (placeholder in MVP)
- Present a "Scanner" screen UI with a fake barcode result option
- After “scan”, show a confirm sheet:
  - name (editable)
  - location selector
  - category selector
  - stock status
- Save to localStorage

---

## Recipes tab

### Top-level controls
- Segmented control:
  - Best matches
  - Explore
- Filters panel (collapsible or sheet):
  - Source toggles: Marion’s / BBC Good Food
  - Protein filter: any / chicken / beef / pork / fish / veg
  - Search by ingredient (text)

### Recipe card
Show:
- Title
- Source badge (Marion / BBC)
- Match indicator:
  - match percentage (matched ingredients / total)
  - missing count
Actions:
- View missing (opens modal)
- Mark cooked (opens logging sheet)
- Optional: Save / Interested toggle (star)

### Best matches mode
- Sort recipes by match score descending
- Bias towards recipes requiring fewer missing ingredients

### Explore mode
- Show broader list:
  - still filterable
  - sorting can be less strict

### View missing modal
- Show missing items grouped by:
  - Fridge
  - Freezer
  - Pantry
Use a simple heuristic mapping (editable later).

### Cooked recap sheet (logging)
Required:
- Cooked (confirm action)
- Make again? yes/no
Optional:
- Rating (1–5 or thumbs)
- Leftovers: none / 1 portion / 2+
- Shop size: none / small / big
- Reason tags (chips): quick/use-up/healthy/comfort/craving/impress/low effort
- Substitutions:
  - expected ingredient (from recipe ingredient list)
  - used ingredient (free text or pick)
  - worked well toggle

---

## Settings tab

### Theme
- System / Light / Dark toggle
- Persist to localStorage

### Household mode
- Normal / Away
- Optional date range + label (Holiday / Work trip etc.)
When Away:
- show a subtle banner in Recipes (suggestions only)
- do not treat skips as negative outcomes

### Optional
- Staples list (assume always have) — can be stubbed for MVP