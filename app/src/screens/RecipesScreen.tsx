import { useState } from 'react';
import { SegmentedControl, type Segment } from '../components/SegmentedControl';
import './RecipesScreen.css';

type RecipeMode = 'best' | 'explore';

const modeSegments: Segment<RecipeMode>[] = [
  { value: 'best', label: 'Best matches' },
  { value: 'explore', label: 'Explore' },
];

export function RecipesScreen() {
  const [mode, setMode] = useState<RecipeMode>('best');

  return (
    <div className="screen recipes-screen">
      <header className="screen-header">
        <h1 className="screen-title">Recipes</h1>
      </header>

      <div className="recipes-controls">
        <SegmentedControl
          segments={modeSegments}
          value={mode}
          onChange={setMode}
          ariaLabel="Recipe view mode"
        />
      </div>

      <div className="recipes-content">
        <div className="empty-state">
          <span className="empty-state-icon">🍳</span>
          <span className="empty-state-title">No recipes yet</span>
          <span className="empty-state-text">
            {mode === 'best'
              ? 'Add items to your inventory to see recipe matches'
              : 'Recipes will appear here once loaded'}
          </span>
        </div>
      </div>
    </div>
  );
}
