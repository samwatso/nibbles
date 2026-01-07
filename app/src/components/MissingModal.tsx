import { LOCATION_LABELS, LOCATION_ICONS, type Location } from '../types';
import { groupMissingByLocation } from '../utils/recipeMatching';
import './MissingModal.css';

interface MissingModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipeTitle: string;
  missingIngredients: string[];
}

const LOCATIONS: Location[] = ['fridge', 'freezer', 'pantry'];

function capitalise(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
}

export function MissingModal({ isOpen, onClose, recipeTitle, missingIngredients }: MissingModalProps) {
  if (!isOpen) return null;
  
  const grouped = groupMissingByLocation(missingIngredients);
  const hasItems = (loc: Location) => grouped[loc].length > 0;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <header className="modal-header">
          <h2 className="modal-title">Missing ingredients</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </header>
        
        <p className="modal-subtitle">For: {recipeTitle}</p>
        
        <div className="missing-groups">
          {LOCATIONS.map((location) => (
            hasItems(location) && (
              <div key={location} className="missing-group">
                <h3 className="missing-group-header">
                  <span>{LOCATION_ICONS[location]}</span>
                  {LOCATION_LABELS[location]}
                </h3>
                <ul className="missing-list">
                  {grouped[location].map((ingredient) => (
                    <li key={ingredient} className="missing-item">
                      {capitalise(ingredient)}
                    </li>
                  ))}
                </ul>
              </div>
            )
          ))}
        </div>
        
        <div className="modal-actions">
          <button className="btn btn--secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
