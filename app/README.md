# Nibbles Frontend

Mobile-first food inventory + recipe discovery app.

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── TabBar.tsx       # Bottom navigation
│   ├── SegmentedControl.tsx
│   ├── BottomSheet.tsx  # Modal sheet
│   ├── InventoryItem.tsx
│   ├── AddItemForm.tsx
│   ├── BarcodeScanner.tsx
│   ├── RecipeCard.tsx
│   ├── RecipeFilters.tsx
│   ├── MissingModal.tsx
│   └── CookedSheet.tsx
├── screens/             # Screen-level components
│   ├── InventoryScreen.tsx
│   ├── RecipesScreen.tsx
│   └── SettingsScreen.tsx
├── data/                # Mock data
│   ├── mockData.ts      # Seed inventory + fake barcodes
│   └── recipeData.ts    # Seed recipes + synonyms
├── utils/               # Utilities
│   └── recipeMatching.ts # Normalisation + scoring
├── state/               # State management
│   └── store.ts         # localStorage-backed store
├── styles/              # Global styles
│   ├── theme.css        # CSS variables for theming
│   └── global.css       # Base styles
├── types/               # TypeScript type definitions
├── App.tsx              # Root component
└── main.tsx             # Entry point
```

## Features (MVP Complete)

### Inventory Tab
- [x] Items grouped by Fridge / Freezer / Pantry
- [x] Age flag icons (amber = old, red = very old) based on shelf-life rules
- [x] Stock status chips (Low, Out)
- [x] Select mode with bulk actions: Delete, Move, Mark out_of_stock
- [x] Add item via bottom sheet (manual form or barcode placeholder)
- [x] localStorage persistence

### Recipes Tab
- [x] Best matches / Explore segmented control
- [x] Filters: source toggles (Marion's/BBC), protein filter, ingredient search
- [x] Recipe cards with match %, missing count, source badge
- [x] View missing modal grouped by location
- [x] Mark cooked logging sheet:
  - Make again (required)
  - Rating (1-5 stars)
  - Leftovers (none/1/2+)
  - Shop size (none/small/big)
  - Reason tags (quick/use-up/healthy/comfort/craving/impress/low effort)
  - Substitutions (expected → used + worked well)
- [x] localStorage persistence for interactions

### Settings Tab
- [x] Theme toggle (System/Light/Dark) with localStorage persistence
- [x] Household mode (Normal/Away)
- [x] Away mode: optional date range + label
- [x] Away banner shown in Recipes tab
- [x] Reset to sample data button

## Theme System

The app supports three theme modes:
- **System** (default) - follows OS preference
- **Light** - forced light mode
- **Dark** - forced dark mode

iOS-inspired glass aesthetic with:
- Frosted panels (backdrop-filter blur)
- Muted color palette
- Warm terracotta accent
- Safe-area padding for notched devices

## Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Data Persistence

All data is stored in localStorage:
- `nibbles_theme` - Theme preference
- `nibbles_household` - Household mode + away settings
- `nibbles_inventory` - Inventory items
- `nibbles_interactions` - Recipe cooking logs
- `nibbles_substitutions` - Ingredient substitutions
- `nibbles_initialized` - First-run flag for seeding
