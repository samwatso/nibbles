import type { RecipeSource } from '../types';
import './RecipeFilters.css';

interface RecipeFiltersProps {
  sources: Set<RecipeSource>;
  onSourceToggle: (source: RecipeSource) => void;
  protein: 'any' | 'chicken' | 'beef' | 'pork' | 'fish' | 'veg';
  onProteinChange: (protein: 'any' | 'chicken' | 'beef' | 'pork' | 'fish' | 'veg') => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const PROTEIN_OPTIONS: Array<{ value: 'any' | 'chicken' | 'beef' | 'pork' | 'fish' | 'veg'; label: string }> = [
  { value: 'any', label: 'Any' },
  { value: 'chicken', label: '🐔 Chicken' },
  { value: 'beef', label: '🥩 Beef' },
  { value: 'pork', label: '🐷 Pork' },
  { value: 'fish', label: '🐟 Fish' },
  { value: 'veg', label: '🥬 Veg' },
];

export function RecipeFilters({
  sources,
  onSourceToggle,
  protein,
  onProteinChange,
  searchTerm,
  onSearchChange,
}: RecipeFiltersProps) {
  return (
    <div className="recipe-filters">
      <div className="filter-search">
        <svg className="filter-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          className="filter-search-input"
          placeholder="Search ingredients..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button className="filter-search-clear" onClick={() => onSearchChange('')} aria-label="Clear search">
            ×
          </button>
        )}
      </div>

      <div className="filter-row">
        <span className="filter-label">Source</span>
        <div className="filter-toggles">
          <button
            className={`filter-toggle ${sources.has('marion') ? 'filter-toggle--active filter-toggle--marion' : ''}`}
            onClick={() => onSourceToggle('marion')}
          >
            Marion's
          </button>
          <button
            className={`filter-toggle ${sources.has('bbc') ? 'filter-toggle--active filter-toggle--bbc' : ''}`}
            onClick={() => onSourceToggle('bbc')}
          >
            BBC
          </button>
        </div>
      </div>

      <div className="filter-row">
        <span className="filter-label">Protein</span>
        <div className="filter-pills">
          {PROTEIN_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`filter-pill ${protein === option.value ? 'filter-pill--active' : ''}`}
              onClick={() => onProteinChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
