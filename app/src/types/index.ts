/**
 * Nibbles Type Definitions
 * Based on docs/data-contract.md
 */

// === Enums ===

export type Location = 'fridge' | 'freezer' | 'pantry';

export type StockStatus = 'in_stock' | 'low' | 'out_of_stock';

export type Category = 'fresh' | 'chilled' | 'meat_fish' | 'frozen' | 'pantry' | 'other';

export type RecipeSource = 'marion' | 'bbc';

export type Leftovers = 'none' | 'one' | 'two_plus';

export type ShopSize = 'none' | 'small' | 'big';

export type HouseholdMode = 'normal' | 'away';

export type ThemeMode = 'system' | 'light' | 'dark';

// === Inventory ===

export interface InventoryItem {
  id: string;
  name: string;
  location: Location;
  category: Category;
  stock_status: StockStatus;
  added_at: string; // ISO
  updated_at: string; // ISO
}

export type NewInventoryItem = Omit<InventoryItem, 'id' | 'added_at' | 'updated_at'>;

// === Ageing ===

export type AgeStatus = 'fresh' | 'old' | 'very_old';

export interface ShelfLifeRule {
  old_days: number | null;
  very_old_days: number | null;
}

export const SHELF_LIFE_RULES: Record<Category, ShelfLifeRule> = {
  fresh: { old_days: 7, very_old_days: 10 },
  chilled: { old_days: 10, very_old_days: 14 },
  meat_fish: { old_days: 2, very_old_days: 3 },
  frozen: { old_days: null, very_old_days: null },
  pantry: { old_days: null, very_old_days: null },
  other: { old_days: null, very_old_days: null },
};

// Alias for store compatibility
export type ShelfLifeRules = Record<Category, ShelfLifeRule>;
export const DEFAULT_SHELF_LIFE_RULES: ShelfLifeRules = SHELF_LIFE_RULES;

// === Recipe ===

export interface RecipeIngredient {
  raw: string;
  norm_key: string;
}

export interface Recipe {
  id: string;
  source: RecipeSource;
  title: string;
  url: string;
  protein_hint?: 'chicken' | 'beef' | 'pork' | 'fish' | 'veg';
  ingredients: RecipeIngredient[];
}

export interface RecipeInteraction {
  id: string;
  recipe_id: string;
  action: 'interested' | 'planned' | 'cooked' | 'skipped';
  created_at: string; // ISO
  make_again?: boolean;
  rating?: number;
  leftovers?: Leftovers;
  shop_size?: ShopSize;
  reason_tags?: string[];
  notes?: string;
}

export interface RecipeSubstitution {
  id: string;
  interaction_id: string;
  expected_norm: string;
  used_norm: string;
  worked_well?: boolean;
}

// === Household ===

export interface HouseholdState {
  mode: HouseholdMode;
  away_start?: string; // ISO date
  away_end?: string; // ISO date
  away_label?: string;
}

// === UI Labels ===

export const LOCATION_LABELS: Record<Location, string> = {
  fridge: 'Fridge',
  freezer: 'Freezer',
  pantry: 'Pantry',
};

export const LOCATION_ICONS: Record<Location, string> = {
  fridge: '🧊',
  freezer: '❄️',
  pantry: '🫙',
};

export const CATEGORY_LABELS: Record<Category, string> = {
  fresh: 'Fresh produce',
  chilled: 'Chilled',
  meat_fish: 'Meat & fish',
  frozen: 'Frozen',
  pantry: 'Pantry',
  other: 'Other',
};

export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  in_stock: 'In stock',
  low: 'Low',
  out_of_stock: 'Out',
};
