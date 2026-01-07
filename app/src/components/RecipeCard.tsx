import type { RecipeMatchResult } from '../utils/recipeMatching';
import './RecipeCard.css';

interface RecipeCardProps {
  match: RecipeMatchResult;
  onViewMissing: () => void;
  onMarkCooked: () => void;
}

export function RecipeCard({ match, onViewMissing, onMarkCooked }: RecipeCardProps) {
  const { recipe, matchPercent, matchedCount, totalCount, missingIngredients } = match;
  const missingCount = missingIngredients.length;
  
  return (
    <article className="recipe-card glass-surface">
      <div className="recipe-card-header">
        <h3 className="recipe-card-title">{recipe.title}</h3>
        <span className={`recipe-card-source recipe-card-source--${recipe.source}`}>
          {recipe.source === 'marion' ? "Marion's" : 'BBC'}
        </span>
      </div>
      
      <div className="recipe-card-match">
        <div className="match-bar">
          <div 
            className="match-bar-fill" 
            style={{ width: `${matchPercent}%` }}
          />
        </div>
        <div className="match-stats">
          <span className="match-percent">{matchPercent}% match</span>
          <span className="match-detail">
            {matchedCount}/{totalCount} ingredients
          </span>
        </div>
      </div>
      
      {missingCount > 0 && (
        <button className="recipe-card-missing" onClick={onViewMissing}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          {missingCount} missing
        </button>
      )}
      
      <div className="recipe-card-actions">
        <button className="recipe-action-btn recipe-action-btn--primary" onClick={onMarkCooked}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Cooked
        </button>
        <a 
          href={recipe.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="recipe-action-btn recipe-action-btn--secondary"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Recipe
        </a>
      </div>
    </article>
  );
}
