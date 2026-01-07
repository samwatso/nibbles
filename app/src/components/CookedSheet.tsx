import { useState } from 'react';
import type { Recipe, Leftovers, ShopSize, RecipeInteraction, RecipeSubstitution } from '../types';
import { REASON_TAGS } from '../data/recipeData';
import { BottomSheet } from './BottomSheet';
import './CookedSheet.css';

interface CookedSheetProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe | null;
  onSave: (interaction: Omit<RecipeInteraction, 'id' | 'created_at'>, substitutions: Omit<RecipeSubstitution, 'id' | 'interaction_id'>[]) => void;
}

interface SubstitutionEntry {
  expected_norm: string;
  used_norm: string;
  worked_well: boolean;
}

export function CookedSheet({ isOpen, onClose, recipe, onSave }: CookedSheetProps) {
  const [makeAgain, setMakeAgain] = useState<boolean | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [leftovers, setLeftovers] = useState<Leftovers | null>(null);
  const [shopSize, setShopSize] = useState<ShopSize | null>(null);
  const [selectedReasons, setSelectedReasons] = useState<Set<string>>(new Set());
  const [substitutions, setSubstitutions] = useState<SubstitutionEntry[]>([]);
  const [newSubExpected, setNewSubExpected] = useState('');
  const [newSubUsed, setNewSubUsed] = useState('');
  
  if (!recipe) return null;
  
  const canSave = makeAgain !== null;
  
  const handleToggleReason = (reason: string) => {
    setSelectedReasons((prev) => {
      const next = new Set(prev);
      if (next.has(reason)) {
        next.delete(reason);
      } else {
        next.add(reason);
      }
      return next;
    });
  };
  
  const handleAddSubstitution = () => {
    if (newSubExpected.trim() && newSubUsed.trim()) {
      setSubstitutions((prev) => [
        ...prev,
        {
          expected_norm: newSubExpected.trim().toLowerCase(),
          used_norm: newSubUsed.trim().toLowerCase(),
          worked_well: true,
        },
      ]);
      setNewSubExpected('');
      setNewSubUsed('');
    }
  };
  
  const handleRemoveSubstitution = (index: number) => {
    setSubstitutions((prev) => prev.filter((_, i) => i !== index));
  };
  
  const handleToggleSubWorked = (index: number) => {
    setSubstitutions((prev) =>
      prev.map((sub, i) =>
        i === index ? { ...sub, worked_well: !sub.worked_well } : sub
      )
    );
  };
  
  const handleSave = () => {
    if (!canSave) return;
    
    const interaction: Omit<RecipeInteraction, 'id' | 'created_at'> = {
      recipe_id: recipe.id,
      action: 'cooked',
      make_again: makeAgain!,
      ...(rating !== null && { rating }),
      ...(leftovers !== null && { leftovers }),
      ...(shopSize !== null && { shop_size: shopSize }),
      ...(selectedReasons.size > 0 && { reason_tags: Array.from(selectedReasons) }),
    };
    
    onSave(interaction, substitutions);
    
    // Reset form
    setMakeAgain(null);
    setRating(null);
    setLeftovers(null);
    setShopSize(null);
    setSelectedReasons(new Set());
    setSubstitutions([]);
  };
  
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Log cooking">
      <div className="cooked-sheet">
        <p className="cooked-recipe-name">{recipe.title}</p>
        
        {/* Make again - Required */}
        <div className="cooked-section">
          <label className="cooked-label">
            Would you make this again? <span className="required">*</span>
          </label>
          <div className="cooked-toggle-group">
            <button
              className={`cooked-toggle ${makeAgain === true ? 'cooked-toggle--active' : ''}`}
              onClick={() => setMakeAgain(true)}
            >
              <span>👍</span> Yes
            </button>
            <button
              className={`cooked-toggle ${makeAgain === false ? 'cooked-toggle--active' : ''}`}
              onClick={() => setMakeAgain(false)}
            >
              <span>👎</span> No
            </button>
          </div>
        </div>
        
        {/* Rating - Optional */}
        <div className="cooked-section">
          <label className="cooked-label">Rating</label>
          <div className="cooked-rating">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                className={`rating-star ${rating !== null && value <= rating ? 'rating-star--filled' : ''}`}
                onClick={() => setRating(value === rating ? null : value)}
                aria-label={`${value} star${value > 1 ? 's' : ''}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        
        {/* Leftovers - Optional */}
        <div className="cooked-section">
          <label className="cooked-label">Leftovers</label>
          <div className="cooked-options">
            {[
              { value: 'none', label: 'None' },
              { value: 'one', label: '1 portion' },
              { value: 'two_plus', label: '2+' },
            ].map((option) => (
              <button
                key={option.value}
                className={`cooked-option ${leftovers === option.value ? 'cooked-option--active' : ''}`}
                onClick={() => setLeftovers(leftovers === option.value ? null : (option.value as Leftovers))}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Shop size - Optional */}
        <div className="cooked-section">
          <label className="cooked-label">Shopping needed</label>
          <div className="cooked-options">
            {[
              { value: 'none', label: 'None' },
              { value: 'small', label: 'Small' },
              { value: 'big', label: 'Big shop' },
            ].map((option) => (
              <button
                key={option.value}
                className={`cooked-option ${shopSize === option.value ? 'cooked-option--active' : ''}`}
                onClick={() => setShopSize(shopSize === option.value ? null : (option.value as ShopSize))}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Reason tags - Optional */}
        <div className="cooked-section">
          <label className="cooked-label">Why this recipe?</label>
          <div className="cooked-tags">
            {REASON_TAGS.map((tag) => (
              <button
                key={tag}
                className={`cooked-tag ${selectedReasons.has(tag) ? 'cooked-tag--active' : ''}`}
                onClick={() => handleToggleReason(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        
        {/* Substitutions - Optional */}
        <div className="cooked-section">
          <label className="cooked-label">Substitutions</label>
          
          {substitutions.length > 0 && (
            <ul className="substitution-list">
              {substitutions.map((sub, index) => (
                <li key={index} className="substitution-item">
                  <span className="substitution-text">
                    {sub.expected_norm} → {sub.used_norm}
                  </span>
                  <button
                    className={`substitution-worked ${sub.worked_well ? 'substitution-worked--yes' : 'substitution-worked--no'}`}
                    onClick={() => handleToggleSubWorked(index)}
                    title={sub.worked_well ? 'Worked well' : "Didn't work"}
                  >
                    {sub.worked_well ? '✓' : '✗'}
                  </button>
                  <button
                    className="substitution-remove"
                    onClick={() => handleRemoveSubstitution(index)}
                    aria-label="Remove"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
          
          <div className="substitution-add">
            <input
              type="text"
              className="form-input substitution-input"
              placeholder="Expected"
              value={newSubExpected}
              onChange={(e) => setNewSubExpected(e.target.value)}
            />
            <span className="substitution-arrow">→</span>
            <input
              type="text"
              className="form-input substitution-input"
              placeholder="Used"
              value={newSubUsed}
              onChange={(e) => setNewSubUsed(e.target.value)}
            />
            <button
              className="substitution-add-btn"
              onClick={handleAddSubstitution}
              disabled={!newSubExpected.trim() || !newSubUsed.trim()}
            >
              +
            </button>
          </div>
        </div>
        
        {/* Actions */}
        <div className="cooked-actions">
          <button className="btn btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn--primary" onClick={handleSave} disabled={!canSave}>
            Save
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
