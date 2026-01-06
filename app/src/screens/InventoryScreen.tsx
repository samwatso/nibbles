import { useState, useEffect, useCallback } from 'react';
import type { InventoryItem, Location } from '../types';
import { LOCATION_LABELS, LOCATION_ICONS } from '../types';
import {
  getInventoryByLocation,
  addInventoryItem,
  deleteInventoryItems,
  moveInventoryItems,
  markInventoryItemsOutOfStock,
} from '../state/store';
import { BottomSheet } from '../components/BottomSheet';
import { InventoryItemRow } from '../components/InventoryItem';
import { AddItemForm } from '../components/AddItemForm';
import { BarcodeScanner } from '../components/BarcodeScanner';
import './InventoryScreen.css';

type AddMode = 'choose' | 'manual' | 'scan';
type MoveTarget = Location | null;

const LOCATIONS: Location[] = ['fridge', 'freezer', 'pantry'];

export function InventoryScreen() {
  const [inventory, setInventory] = useState<Record<Location, InventoryItem[]>>({
    fridge: [],
    freezer: [],
    pantry: [],
  });
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [addMode, setAddMode] = useState<AddMode>('choose');
  const [moveTarget, setMoveTarget] = useState<MoveTarget>(null);

  // Load inventory
  const refreshInventory = useCallback(() => {
    setInventory(getInventoryByLocation());
  }, []);

  useEffect(() => {
    refreshInventory();
  }, [refreshInventory]);

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    const allIds = Object.values(inventory)
      .flat()
      .map((item) => item.id);
    setSelectedIds(new Set(allIds));
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const exitSelectMode = () => {
    setIsSelectMode(false);
    setSelectedIds(new Set());
    setMoveTarget(null);
  };

  // Bulk actions
  const handleDelete = () => {
    if (selectedIds.size === 0) return;
    deleteInventoryItems(Array.from(selectedIds));
    refreshInventory();
    exitSelectMode();
  };

  const handleMove = (location: Location) => {
    if (selectedIds.size === 0) return;
    moveInventoryItems(Array.from(selectedIds), location);
    refreshInventory();
    exitSelectMode();
  };

  const handleMarkOutOfStock = () => {
    if (selectedIds.size === 0) return;
    markInventoryItemsOutOfStock(Array.from(selectedIds));
    refreshInventory();
    exitSelectMode();
  };

  // Add item handlers
  const openAddSheet = () => {
    setAddMode('choose');
    setIsAddSheetOpen(true);
  };

  const closeAddSheet = () => {
    setIsAddSheetOpen(false);
    setAddMode('choose');
  };

  const handleAddItem = (item: {
    name: string;
    location: Location;
    category: InventoryItem['category'];
    stock_status: InventoryItem['stock_status'];
  }) => {
    addInventoryItem(item);
    refreshInventory();
    closeAddSheet();
  };

  const totalItems = Object.values(inventory).flat().length;
  const selectedCount = selectedIds.size;

  return (
    <div className="screen inventory-screen">
      {/* Header */}
      <header className="screen-header inventory-header">
        <div className="inventory-header-top">
          <h1 className="screen-title">Inventory</h1>
          {totalItems > 0 && (
            <button
              className={`select-toggle ${isSelectMode ? 'select-toggle--active' : ''}`}
              onClick={() => (isSelectMode ? exitSelectMode() : setIsSelectMode(true))}
            >
              {isSelectMode ? 'Done' : 'Select'}
            </button>
          )}
        </div>

        {/* Bulk actions bar */}
        {isSelectMode && (
          <div className="bulk-actions-bar">
            <div className="bulk-actions-info">
              <span className="bulk-actions-count">{selectedCount} selected</span>
              <button
                className="bulk-actions-link"
                onClick={selectedCount === totalItems ? handleDeselectAll : handleSelectAll}
              >
                {selectedCount === totalItems ? 'Deselect all' : 'Select all'}
              </button>
            </div>

            <div className="bulk-actions-buttons">
              <button
                className="bulk-action-btn bulk-action-btn--danger"
                onClick={handleDelete}
                disabled={selectedCount === 0}
                title="Delete"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>

              <div className="bulk-action-dropdown">
                <button
                  className="bulk-action-btn"
                  onClick={() => setMoveTarget(moveTarget ? null : 'fridge')}
                  disabled={selectedCount === 0}
                  title="Move to..."
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 9l7-7 7 7" />
                    <path d="M12 2v14" />
                    <path d="M19 16v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-5" />
                  </svg>
                </button>
                {moveTarget && (
                  <div className="move-dropdown">
                    {LOCATIONS.map((loc) => (
                      <button
                        key={loc}
                        className="move-option"
                        onClick={() => handleMove(loc)}
                      >
                        <span>{LOCATION_ICONS[loc]}</span>
                        {LOCATION_LABELS[loc]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                className="bulk-action-btn"
                onClick={handleMarkOutOfStock}
                disabled={selectedCount === 0}
                title="Mark out of stock"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Inventory groups */}
      <div className="inventory-groups">
        {LOCATIONS.map((location) => (
          <section key={location} className="inventory-group">
            <h2 className="inventory-group-header">
              <span className="inventory-group-icon">{LOCATION_ICONS[location]}</span>
              {LOCATION_LABELS[location]}
              <span className="inventory-group-count">
                {inventory[location].length}
              </span>
            </h2>
            <div className="inventory-group-content glass-surface">
              {inventory[location].length === 0 ? (
                <div className="empty-state-inline">
                  <span className="empty-state-text">
                    No items in the {location}
                  </span>
                </div>
              ) : (
                <div className="inventory-list">
                  {inventory[location].map((item) => (
                    <InventoryItemRow
                      key={item.id}
                      item={item}
                      isSelectMode={isSelectMode}
                      isSelected={selectedIds.has(item.id)}
                      onSelect={handleToggleSelect}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      {/* FAB */}
      {!isSelectMode && (
        <button className="fab" onClick={openAddSheet} aria-label="Add item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      )}

      {/* Add item bottom sheet */}
      <BottomSheet
        isOpen={isAddSheetOpen}
        onClose={closeAddSheet}
        title={
          addMode === 'choose'
            ? 'Add item'
            : addMode === 'manual'
            ? 'Add manually'
            : 'Scan barcode'
        }
      >
        {addMode === 'choose' && (
          <div className="add-chooser">
            <button className="add-option" onClick={() => setAddMode('scan')}>
              <span className="add-option-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="7" y1="7" x2="7" y2="7.01" />
                  <line x1="11" y1="7" x2="11" y2="7.01" />
                  <line x1="7" y1="11" x2="7" y2="17" />
                  <line x1="11" y1="11" x2="11" y2="11.01" />
                  <line x1="11" y1="15" x2="11" y2="17" />
                  <line x1="15" y1="7" x2="17" y2="7" />
                  <line x1="15" y1="11" x2="17" y2="11" />
                  <line x1="15" y1="15" x2="17" y2="15" />
                </svg>
              </span>
              <span className="add-option-label">Scan barcode</span>
              <span className="add-option-hint">Quick add via camera</span>
            </button>

            <button className="add-option" onClick={() => setAddMode('manual')}>
              <span className="add-option-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </span>
              <span className="add-option-label">Add manually</span>
              <span className="add-option-hint">Enter item details</span>
            </button>
          </div>
        )}

        {addMode === 'manual' && (
          <AddItemForm
            onSubmit={handleAddItem}
            onCancel={() => setAddMode('choose')}
          />
        )}

        {addMode === 'scan' && (
          <BarcodeScanner
            onComplete={handleAddItem}
            onCancel={() => setAddMode('choose')}
          />
        )}
      </BottomSheet>
    </div>
  );
}
