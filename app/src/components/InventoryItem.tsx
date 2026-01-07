import type { InventoryItem as InventoryItemType, AgeStatus } from '../types';
import { STOCK_STATUS_LABELS } from '../types';
import { calculateAgeStatus } from '../state/store';
import './InventoryItem.css';

interface InventoryItemProps {
  item: InventoryItemType;
  isSelectMode: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit?: (item: InventoryItemType) => void;
}

const AgeIcon = ({ status }: { status: AgeStatus }) => {
  if (status === 'fresh') return null;

  const isVeryOld = status === 'very_old';
  const title = isVeryOld ? 'Use soon!' : 'Getting old';

  return (
    <span
      className={`age-icon ${isVeryOld ? 'age-icon--very-old' : 'age-icon--old'}`}
      title={title}
      aria-label={title}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    </span>
  );
};

const StockChip = ({ status }: { status: InventoryItemType['stock_status'] }) => {
  if (status === 'in_stock') return null;

  return (
    <span className={`stock-chip stock-chip--${status}`}>
      {STOCK_STATUS_LABELS[status]}
    </span>
  );
};

export function InventoryItemRow({
  item,
  isSelectMode,
  isSelected,
  onSelect,
  onEdit,
}: InventoryItemProps) {
  const ageStatus = calculateAgeStatus(item);

  const isEditable = !isSelectMode && typeof onEdit === "function";
  const isInteractive = isSelectMode || isEditable;

  const handleClick = () => {
    if (isSelectMode) onSelect(item.id);
    else if (isEditable) onEdit(item);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isInteractive) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={[
        "inventory-item",
        isSelectMode ? "inventory-item--selectable" : "",
        isEditable ? "inventory-item--editable" : "",
        isSelected ? "inventory-item--selected" : "",
      ].join(" ")}
      onClick={isInteractive ? handleClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      role={isSelectMode ? "checkbox" : isEditable ? "button" : undefined}
      aria-checked={isSelectMode ? isSelected : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
      {isSelectMode && (
        <span className={`inventory-item-checkbox ${isSelected ? "inventory-item-checkbox--checked" : ""}`}>
          {isSelected && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </span>
      )}

      <span className="inventory-item-name">{item.name}</span>

      <div className="inventory-item-indicators">
        <AgeIcon status={ageStatus} />
        <StockChip status={item.stock_status} />
      </div>
    </div>
  );
}