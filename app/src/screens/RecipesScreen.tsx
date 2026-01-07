import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Recipe, RecipeSource, RecipeInteraction, RecipeSubstitution } from '../types';
import { SegmentedControl, type Segment } from '../components/SegmentedControl';
import { RecipeFilters } from '../components/RecipeFilters';
import { RecipeCard } from '../components/RecipeCard';
import { MissingModal } from '../components/MissingModal';
import { CookedSheet } from '../components/CookedSheet';
import { SEED_RECIPES } from '../data/recipeData';
import { getInventory, getHouseholdState } from '../state/store';
import {
  calculateAllRecipeMatches,
  sortByBestMatch,
  filterRecipes,
  type RecipeMatchResult,
  type RecipeFilters as RecipeFiltersType,
} from '../utils/recipeMatching';
import './RecipesScreen.css';

type RecipeMode = 'best' | 'explore';

const modeSegments: Segment<RecipeMode>[] = [
  { value: 'best', label: 'Best matches' },
  { value: 'explore', label: 'Explore' },
];

const STORAGE_KEY_INTERACTIONS = 'nibbles_interactions';
const STORAGE_KEY_SUBSTITUTIONS = 'nibbles_substitutions';

function getInteractions(): RecipeInteraction[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_INTERACTIONS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveInteraction(interaction: RecipeInteraction): void {
  const interactions = getInteractions();
  interactions.push(interaction);
  localStorage.setItem(STORAGE_KEY_INTERACTIONS, JSON.stringify(interactions));
}

function saveSubstitutions(subs: RecipeSubstitution[]): void {
  try {
    const existing = localStorage.getItem(STORAGE_KEY_SUBSTITUTIONS);
    const all = existing ? JSON.parse(existing) : [];
    all.push(...subs);
    localStorage.setItem(STORAGE_KEY_SUBSTITUTIONS, JSON.stringify(all));
  } catch {
    // Ignore
  }
}

export function RecipesScreen() {
  const [mode, setMode] = useState<RecipeMode>('best');
  const [sources, setSources] = useState<Set<RecipeSource>>(new Set());
  const [protein, setProtein] = useState<RecipeFiltersType['protein']>('any');
  const [searchTerm, setSearchTerm] = useState('');
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  
  const [missingModal, setMissingModal] = useState<{ title: string; missing: string[] } | null>(null);
  const [cookedRecipe, setCookedRecipe] = useState<Recipe | null>(null);
  
  const [inventory, setInventory] = useState(getInventory());
  const householdState = getHouseholdState();
  const isAway = householdState.mode === 'away';

  useEffect(() => {
    setInventory(getInventory());
  }, []);

  const handleSourceToggle = useCallback((source: RecipeSource) => {
    setSources((prev) => {
      const next = new Set(prev);
      if (next.has(source)) {
        next.delete(source);
      } else {
        next.add(source);
      }
      return next;
    });
  }, []);

  const allMatches = useMemo(
    () => calculateAllRecipeMatches(SEED_RECIPES, inventory),
    [inventory]
  );

  const filteredMatches = useMemo(() => {
    const filters: RecipeFiltersType = { sources, protein, searchTerm };
    let results = filterRecipes(allMatches, filters);
    
    if (mode === 'best') {
      results = sortByBestMatch(results);
    }
    
    return results;
  }, [allMatches, sources, protein, searchTerm, mode]);

  const handleViewMissing = (match: RecipeMatchResult) => {
    setMissingModal({
      title: match.recipe.title,
      missing: match.missingIngredients,
    });
  };

  const handleMarkCooked = (recipe: Recipe) => {
    setCookedRecipe(recipe);
  };

  const handleSaveCooked = (
    interaction: Omit<RecipeInteraction, 'id' | 'created_at'>,
    substitutions: Omit<RecipeSubstitution, 'id' | 'interaction_id'>[]
  ) => {
    const interactionId = crypto.randomUUID();
    const fullInteraction: RecipeInteraction = {
      ...interaction,
      id: interactionId,
      created_at: new Date().toISOString(),
    };
    
    saveInteraction(fullInteraction);
    
    if (substitutions.length > 0) {
      const fullSubs: RecipeSubstitution[] = substitutions.map((sub) => ({
        ...sub,
        id: crypto.randomUUID(),
        interaction_id: interactionId,
      }));
      saveSubstitutions(fullSubs);
    }
    
    setCookedRecipe(null);
  };

  return (
    <div className="screen recipes-screen">
      <header className="screen-header">
        <h1 className="screen-title">Recipes</h1>
      </header>

      {isAway && (
        <div className="away-banner">
          <span>🏖️</span>
          <span>Away mode — suggestions only, no tracking</span>
        </div>
      )}

      <div className="recipes-controls">
        <SegmentedControl
          segments={modeSegments}
          value={mode}
          onChange={setMode}
          ariaLabel="Recipe view mode"
        />
        
        <button
          className={`filters-toggle ${filtersExpanded ? 'filters-toggle--active' : ''}`}
          onClick={() => setFiltersExpanded(!filtersExpanded)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filters
          {(sources.size > 0 || protein !== 'any' || searchTerm) && (
            <span className="filters-badge" />
          )}
        </button>
      </div>

      {filtersExpanded && (
        <RecipeFilters
          sources={sources}
          onSourceToggle={handleSourceToggle}
          protein={protein}
          onProteinChange={setProtein}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      )}

      <div className="recipes-list">
        {filteredMatches.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">🍳</span>
            <span className="empty-state-title">No recipes found</span>
            <span className="empty-state-text">
              Try adjusting your filters or add more items to your inventory
            </span>
          </div>
        ) : (
          filteredMatches.map((match) => (
            <RecipeCard
              key={match.recipe.id}
              match={match}
              onViewMissing={() => handleViewMissing(match)}
              onMarkCooked={() => handleMarkCooked(match.recipe)}
            />
          ))
        )}
      </div>

      <MissingModal
        isOpen={missingModal !== null}
        onClose={() => setMissingModal(null)}
        recipeTitle={missingModal?.title ?? ''}
        missingIngredients={missingModal?.missing ?? []}
      />

      <CookedSheet
        isOpen={cookedRecipe !== null}
        onClose={() => setCookedRecipe(null)}
        recipe={cookedRecipe}
        onSave={handleSaveCooked}
      />
    </div>
  );
}
