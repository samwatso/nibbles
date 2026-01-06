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
├── components/       # Reusable UI components
│   ├── TabBar.tsx   # Bottom navigation
│   └── SegmentedControl.tsx
├── screens/          # Screen-level components
│   ├── InventoryScreen.tsx
│   ├── RecipesScreen.tsx
│   └── SettingsScreen.tsx
├── state/            # State management
│   └── store.ts     # localStorage-backed store
├── styles/           # Global styles
│   ├── theme.css    # CSS variables for theming
│   └── global.css   # Base styles
├── types/            # TypeScript type definitions
├── App.tsx           # Root component
└── main.tsx          # Entry point
```

## Theme System

The app supports three theme modes:
- **System** (default) - follows OS preference
- **Light** - forced light mode
- **Dark** - forced dark mode

Theme choice persists in localStorage.

## Features (MVP)

- [x] Bottom tab navigation with safe-area padding
- [x] Theme toggle (System/Light/Dark)
- [x] Household mode toggle (Normal/Away)
- [ ] Inventory management (coming soon)
- [ ] Recipe matching (coming soon)
- [ ] Cooking log (coming soon)

## Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
