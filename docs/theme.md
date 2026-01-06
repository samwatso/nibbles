# Nibbles — Theme & Visual Design

## Design goal
Modern, mobile-first, iOS-inspired “glass” aesthetic:
- muted colours
- frosted panels with subtle blur
- soft borders
- calm, premium feel (not neon, not “gamer”)
- clean typography and generous spacing

## Colour approach
Use CSS variables for theming.
- Day mode: light surfaces with subtle translucency
- Night mode: deep surfaces, slightly higher contrast text, still muted

Avoid loud accent colours. Use one accent colour sparingly for actions and focus states.

## Glass surfaces
Use:
- backdrop-filter blur (where supported)
- semi-transparent surface colours (rgba / hsla)
- hairline borders (low opacity)
- minimal shadow (soft, not heavy)

Make sure text remains readable on glass surfaces.

## Typography
- System font stack (system-ui / SF-like).
- Clear hierarchy: title, section headers, list items, metadata.

## Layout & spacing
- Mobile-first, thumb-friendly controls.
- Bottom tab bar fixed with safe-area padding:
  - padding-bottom: env(safe-area-inset-bottom)

## Light/Dark/System mode
- Default: follow system (prefers-color-scheme)
- Manual override: System / Light / Dark
- Persist choice in localStorage
- Settings screen must expose the toggle

## Interaction patterns
- Bottom sheets for “Add item” and “Cooked recap”
- Modal for “View missing ingredients”
- Segmented control for Best matches / Explore

## Accessibility
- Visible focus states
- Minimum tap target ~44px
- Ensure readable contrast in both themes