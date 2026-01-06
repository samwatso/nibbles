/**
 * Mock Seed Data for Nibbles MVP
 */

import type { InventoryItem, Category, Location } from '../types';

// Helper to create dates relative to now
function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

/**
 * Seed inventory with ~18 items across fridge/freezer/pantry
 * Includes variety of categories and ages for testing ageing flags
 */
export const SEED_INVENTORY: InventoryItem[] = [
  // === FRIDGE (8 items) ===
  {
    id: 'inv-001',
    name: 'Milk',
    location: 'fridge',
    category: 'chilled',
    stock_status: 'in_stock',
    added_at: daysAgo(3),
    updated_at: daysAgo(3),
  },
  {
    id: 'inv-002',
    name: 'Eggs',
    location: 'fridge',
    category: 'chilled',
    stock_status: 'low',
    added_at: daysAgo(8),
    updated_at: daysAgo(2),
  },
  {
    id: 'inv-003',
    name: 'Chicken breast',
    location: 'fridge',
    category: 'meat_fish',
    stock_status: 'in_stock',
    added_at: daysAgo(1),
    updated_at: daysAgo(1),
  },
  {
    id: 'inv-004',
    name: 'Salmon fillet',
    location: 'fridge',
    category: 'meat_fish',
    stock_status: 'in_stock',
    added_at: daysAgo(3), // very old for meat_fish
    updated_at: daysAgo(3),
  },
  {
    id: 'inv-005',
    name: 'Spring onions',
    location: 'fridge',
    category: 'fresh',
    stock_status: 'in_stock',
    added_at: daysAgo(5),
    updated_at: daysAgo(5),
  },
  {
    id: 'inv-006',
    name: 'Carrots',
    location: 'fridge',
    category: 'fresh',
    stock_status: 'in_stock',
    added_at: daysAgo(9), // old for fresh
    updated_at: daysAgo(9),
  },
  {
    id: 'inv-007',
    name: 'Cheddar cheese',
    location: 'fridge',
    category: 'chilled',
    stock_status: 'in_stock',
    added_at: daysAgo(12), // old for chilled
    updated_at: daysAgo(12),
  },
  {
    id: 'inv-008',
    name: 'Greek yogurt',
    location: 'fridge',
    category: 'chilled',
    stock_status: 'low',
    added_at: daysAgo(6),
    updated_at: daysAgo(1),
  },

  // === FREEZER (5 items) ===
  {
    id: 'inv-009',
    name: 'Frozen peas',
    location: 'freezer',
    category: 'frozen',
    stock_status: 'in_stock',
    added_at: daysAgo(30),
    updated_at: daysAgo(30),
  },
  {
    id: 'inv-010',
    name: 'Ice cream',
    location: 'freezer',
    category: 'frozen',
    stock_status: 'low',
    added_at: daysAgo(14),
    updated_at: daysAgo(3),
  },
  {
    id: 'inv-011',
    name: 'Frozen prawns',
    location: 'freezer',
    category: 'frozen',
    stock_status: 'in_stock',
    added_at: daysAgo(21),
    updated_at: daysAgo(21),
  },
  {
    id: 'inv-012',
    name: 'Beef mince',
    location: 'freezer',
    category: 'frozen',
    stock_status: 'in_stock',
    added_at: daysAgo(45),
    updated_at: daysAgo(45),
  },
  {
    id: 'inv-013',
    name: 'Frozen berries',
    location: 'freezer',
    category: 'frozen',
    stock_status: 'out_of_stock',
    added_at: daysAgo(60),
    updated_at: daysAgo(2),
  },

  // === PANTRY (5 items) ===
  {
    id: 'inv-014',
    name: 'Jasmine rice',
    location: 'pantry',
    category: 'pantry',
    stock_status: 'in_stock',
    added_at: daysAgo(90),
    updated_at: daysAgo(90),
  },
  {
    id: 'inv-015',
    name: 'Soy sauce',
    location: 'pantry',
    category: 'pantry',
    stock_status: 'in_stock',
    added_at: daysAgo(120),
    updated_at: daysAgo(120),
  },
  {
    id: 'inv-016',
    name: 'Fish sauce',
    location: 'pantry',
    category: 'pantry',
    stock_status: 'low',
    added_at: daysAgo(60),
    updated_at: daysAgo(5),
  },
  {
    id: 'inv-017',
    name: 'Coconut milk',
    location: 'pantry',
    category: 'pantry',
    stock_status: 'in_stock',
    added_at: daysAgo(30),
    updated_at: daysAgo(30),
  },
  {
    id: 'inv-018',
    name: 'Dried noodles',
    location: 'pantry',
    category: 'pantry',
    stock_status: 'in_stock',
    added_at: daysAgo(45),
    updated_at: daysAgo(45),
  },
];

/**
 * Fake barcode scan results for placeholder scanner
 */
export const FAKE_BARCODE_PRODUCTS = [
  { barcode: '5000128000000', name: 'Heinz Baked Beans', category: 'pantry' as const },
  { barcode: '5010029200003', name: 'Lurpak Butter', category: 'chilled' as const },
  { barcode: '5000157000000', name: 'Cathedral City Cheddar', category: 'chilled' as const },
  { barcode: '5010477000000', name: 'Yorkshire Tea', category: 'pantry' as const },
  { barcode: '7613035000000', name: 'Nescafé Gold', category: 'pantry' as const },
];

/**
 * Get a random fake barcode result for the placeholder scanner
 */
export function getRandomFakeBarcodeResult(): {
  name: string;
  category: Category;
  suggestedLocation: Location;
} {
  const product = FAKE_BARCODE_PRODUCTS[Math.floor(Math.random() * FAKE_BARCODE_PRODUCTS.length)];
  
  // Suggest location based on category
  const locationMap: Record<Category, Location> = {
    fresh: 'fridge',
    chilled: 'fridge',
    meat_fish: 'fridge',
    frozen: 'freezer',
    pantry: 'pantry',
    other: 'pantry',
  };
  
  return {
    name: product.name,
    category: product.category,
    suggestedLocation: locationMap[product.category],
  };
}
