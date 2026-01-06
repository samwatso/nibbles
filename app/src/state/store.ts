/**
 * Nibbles State Store
 * localStorage-backed state management
 */

import type {
  InventoryItem,
  Location,
  HouseholdState,
  AgeStatus,
  ShelfLifeRules,
} from '../types';
import { DEFAULT_SHELF_LIFE_RULES } from '../types';
import { SEED_INVENTORY } from '../data/mockData';

// Theme
export type ThemeMode = 'system' | 'light' | 'dark';

// Storage keys
const STORAGE_KEYS = {
  THEME: 'nibbles_theme',
  HOUSEHOLD: 'nibbles_household',
  INVENTORY: 'nibbles_inventory',
  INITIALIZED: 'nibbles_initialized',
} as const;

// Helper to safely parse JSON from localStorage
function getStoredValue<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored === null) return fallback;
    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
}

// Helper to save to localStorage
function setStoredValue<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error);
  }
}

// ============================================
// Theme Management
// ============================================

export function getTheme(): ThemeMode {
  return getStoredValue(STORAGE_KEYS.THEME, 'system');
}

export function setTheme(theme: ThemeMode): void {
  setStoredValue(STORAGE_KEYS.THEME, theme);
  applyTheme(theme);
}

export function applyTheme(theme: ThemeMode): void {
  const root = document.documentElement;
  if (theme === 'system') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', theme);
  }
}

export function getEffectiveTheme(theme: ThemeMode): 'light' | 'dark' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

// ============================================
// Household State Management
// ============================================

const DEFAULT_HOUSEHOLD: HouseholdState = { mode: 'normal' };

export function getHouseholdState(): HouseholdState {
  return getStoredValue(STORAGE_KEYS.HOUSEHOLD, DEFAULT_HOUSEHOLD);
}

export function setHouseholdState(state: HouseholdState): void {
  setStoredValue(STORAGE_KEYS.HOUSEHOLD, state);
}

// ============================================
// Inventory Management
// ============================================

export function getInventory(): InventoryItem[] {
  return getStoredValue(STORAGE_KEYS.INVENTORY, []);
}

export function setInventory(items: InventoryItem[]): void {
  setStoredValue(STORAGE_KEYS.INVENTORY, items);
}

export function addInventoryItem(
  item: Omit<InventoryItem, 'id' | 'added_at' | 'updated_at'>
): InventoryItem {
  const now = new Date().toISOString();
  const newItem: InventoryItem = {
    ...item,
    id: crypto.randomUUID(),
    added_at: now,
    updated_at: now,
  };

  const inventory = getInventory();
  inventory.push(newItem);
  setInventory(inventory);

  return newItem;
}

export function updateInventoryItem(
  id: string,
  updates: Partial<Omit<InventoryItem, 'id' | 'added_at'>>
): InventoryItem | null {
  const inventory = getInventory();
  const index = inventory.findIndex((item) => item.id === id);

  if (index === -1) return null;

  inventory[index] = {
    ...inventory[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  setInventory(inventory);
  return inventory[index];
}

export function updateInventoryItems(
  ids: string[],
  updates: Partial<Omit<InventoryItem, 'id' | 'added_at'>>
): void {
  const inventory = getInventory();
  const now = new Date().toISOString();

  const updated = inventory.map((item) => {
    if (ids.includes(item.id)) {
      return { ...item, ...updates, updated_at: now };
    }
    return item;
  });

  setInventory(updated);
}

export function deleteInventoryItems(ids: string[]): void {
  const inventory = getInventory();
  const filtered = inventory.filter((item) => !ids.includes(item.id));
  setInventory(filtered);
}

export function moveInventoryItems(ids: string[], location: Location): void {
  updateInventoryItems(ids, { location });
}

export function markInventoryItemsOutOfStock(ids: string[]): void {
  updateInventoryItems(ids, { stock_status: 'out_of_stock' });
}

// Group inventory by location
export function getInventoryByLocation(): Record<Location, InventoryItem[]> {
  const inventory = getInventory();
  return {
    fridge: inventory.filter((item) => item.location === 'fridge'),
    freezer: inventory.filter((item) => item.location === 'freezer'),
    pantry: inventory.filter((item) => item.location === 'pantry'),
  };
}

// ============================================
// Shelf-Life / Age Calculation
// ============================================

export function getShelfLifeRules(): ShelfLifeRules {
  return DEFAULT_SHELF_LIFE_RULES;
}

export function calculateAgeStatus(item: InventoryItem): AgeStatus {
  const rules = getShelfLifeRules();
  const rule = rules[item.category];

  // If no ageing rules for this category, always fresh
  if (rule.old_days === null || rule.very_old_days === null) {
    return 'fresh';
  }

  const addedDate = new Date(item.added_at);
  const now = new Date();
  const daysSinceAdded = Math.floor(
    (now.getTime() - addedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceAdded >= rule.very_old_days) {
    return 'very_old';
  }
  if (daysSinceAdded >= rule.old_days) {
    return 'old';
  }
  return 'fresh';
}

export function getDaysOld(item: InventoryItem): number {
  const addedDate = new Date(item.added_at);
  const now = new Date();
  return Math.floor((now.getTime() - addedDate.getTime()) / (1000 * 60 * 60 * 24));
}

// ============================================
// Initialization
// ============================================

export function initializeStore(): void {
  // Apply theme
  const theme = getTheme();
  applyTheme(theme);

  // Seed inventory if first run
  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (!initialized) {
    setInventory(SEED_INVENTORY);
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }
}

// Reset to seed data (for testing)
export function resetToSeedData(): void {
  setInventory(SEED_INVENTORY);
}
