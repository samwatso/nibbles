/**
 * Recipe matching utilities
 * Normalisation, synonym handling, and match scoring
 */

import type { Recipe, InventoryItem, Location } from '../types';
import { INGREDIENT_SYNONYMS, INGREDIENT_LOCATION_HINTS } from '../data/recipeData';

// Normalise an ingredient name to a canonical key
export function normaliseIngredient(name: string): string {
  let normalised = name.toLowerCase().trim();
  
  // Remove common quantity/unit prefixes (best effort)
  normalised = normalised
    .replace(/^\d+(\.\d+)?\s*(g|kg|ml|l|tbsp|tsp|cup|cups|oz|lb)?\s*/i, '')
    .replace(/^(a|an|the|some|few|several)\s+/i, '')
    .trim();
  
  // Apply synonyms
  if (INGREDIENT_SYNONYMS[normalised]) {
    normalised = INGREDIENT_SYNONYMS[normalised];
  }
  
  return normalised;
}

// Get normalised keys from inventory
export function getInventoryNormKeys(inventory: InventoryItem[]): Set<string> {
  const keys = new Set<string>();
  
  for (const item of inventory) {
    // Only consider items that are in stock or low
    if (item.stock_status === 'out_of_stock') continue;
    
    const normKey = normaliseIngredient(item.name);
    keys.add(normKey);
    
    // Also add any synonyms that map to this key
    for (const [synonym, target] of Object.entries(INGREDIENT_SYNONYMS)) {
      if (target === normKey) {
        keys.add(synonym);
      }
    }
  }
  
  return keys;
}

// Calculate match score for a recipe
export interface RecipeMatchResult {
  recipe: Recipe;
  matchedCount: number;
  totalCount: number;
  matchPercent: number;
  missingIngredients: string[];
  matchedIngredients: string[];
}

export function calculateRecipeMatch(
  recipe: Recipe,
  inventoryKeys: Set<string>
): RecipeMatchResult {
  const totalCount = recipe.ingredients.length;
  const matched: string[] = [];
  const missing: string[] = [];
  
  for (const ingredient of recipe.ingredients) {
    if (inventoryKeys.has(ingredient.norm_key)) {
      matched.push(ingredient.norm_key);
    } else {
      missing.push(ingredient.norm_key);
    }
  }
  
  const matchedCount = matched.length;
  const matchPercent = totalCount > 0 ? Math.round((matchedCount / totalCount) * 100) : 0;
  
  return {
    recipe,
    matchedCount,
    totalCount,
    matchPercent,
    missingIngredients: missing,
    matchedIngredients: matched,
  };
}

// Calculate matches for all recipes
export function calculateAllRecipeMatches(
  recipes: Recipe[],
  inventory: InventoryItem[]
): RecipeMatchResult[] {
  const inventoryKeys = getInventoryNormKeys(inventory);
  return recipes.map((recipe) => calculateRecipeMatch(recipe, inventoryKeys));
}

// Sort recipes by best match (highest % first, then fewer missing)
export function sortByBestMatch(matches: RecipeMatchResult[]): RecipeMatchResult[] {
  return [...matches].sort((a, b) => {
    // First by match percent (descending)
    if (b.matchPercent !== a.matchPercent) {
      return b.matchPercent - a.matchPercent;
    }
    // Then by fewer missing ingredients
    return a.missingIngredients.length - b.missingIngredients.length;
  });
}

// Get suggested location for an ingredient
export function getIngredientLocation(normKey: string): Location {
  return INGREDIENT_LOCATION_HINTS[normKey] || 'pantry';
}

// Group missing ingredients by location
export interface MissingByLocation {
  fridge: string[];
  freezer: string[];
  pantry: string[];
}

export function groupMissingByLocation(missingIngredients: string[]): MissingByLocation {
  const grouped: MissingByLocation = {
    fridge: [],
    freezer: [],
    pantry: [],
  };
  
  for (const ingredient of missingIngredients) {
    const location = getIngredientLocation(ingredient);
    grouped[location].push(ingredient);
  }
  
  return grouped;
}

// Filter recipes
export interface RecipeFilters {
  sources: Set<'marion' | 'bbc'>;
  protein: 'any' | 'chicken' | 'beef' | 'pork' | 'fish' | 'veg';
  searchTerm: string;
}

export function filterRecipes(
  matches: RecipeMatchResult[],
  filters: RecipeFilters
): RecipeMatchResult[] {
  return matches.filter((match) => {
    const recipe = match.recipe;
    
    // Source filter
    if (filters.sources.size > 0 && !filters.sources.has(recipe.source)) {
      return false;
    }
    
    // Protein filter
    if (filters.protein !== 'any') {
      if (recipe.protein_hint !== filters.protein) {
        return false;
      }
    }
    
    // Search term (searches title and ingredients)
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      const titleMatch = recipe.title.toLowerCase().includes(term);
      const ingredientMatch = recipe.ingredients.some(
        (ing) => ing.raw.toLowerCase().includes(term) || ing.norm_key.includes(term)
      );
      if (!titleMatch && !ingredientMatch) {
        return false;
      }
    }
    
    return true;
  });
}
