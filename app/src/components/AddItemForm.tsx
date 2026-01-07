import { useEffect, useState } from 'react';
import type { Location, Category, StockStatus } from '../types';
import { LOCATION_LABELS, CATEGORY_LABELS, STOCK_STATUS_LABELS } from '../types';
import './AddItemForm.css';

interface AddItemFormProps {
  onSubmit: (item: {
    name: string;
    location: Location;
    category: Category;
    stock_status: StockStatus;
  }) => void;
  onCancel: () => void;
  initialValues?: {
    name?: string;
    location?: Location;
    category?: Category;
    stock_status?: StockStatus;
  };
  submitLabel?: string;
}

const LOCATIONS: Location[] = ['fridge', 'freezer', 'pantry'];
const CATEGORIES: Category[] = ['fresh', 'chilled', 'meat_fish', 'frozen', 'pantry', 'other'];
const STOCK_STATUSES: StockStatus[] = ['in_stock', 'low', 'out_of_stock'];

export function AddItemForm({
  onSubmit,
  onCancel,
  initialValues,
  submitLabel = 'Add item',
}: AddItemFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [location, setLocation] = useState<Location>(initialValues?.location ?? 'fridge');
  const [category, setCategory] = useState<Category>(initialValues?.category ?? 'fresh');
  const [stockStatus, setStockStatus] = useState<StockStatus>(
    initialValues?.stock_status ?? 'in_stock'
  );
  const [nameTouched, setNameTouched] = useState(false);
  const [locationTouched, setLocationTouched] = useState(false);
  const [categoryTouched, setCategoryTouched] = useState(false);
  const [stockTouched, setStockTouched] = useState(false);

  useEffect(() => {
    if (!initialValues) return;

    if (!nameTouched && initialValues.name !== undefined) {
      setName(initialValues.name ?? '');
    }
    if (!locationTouched && initialValues.location !== undefined) {
      setLocation(initialValues.location ?? 'fridge');
    }
    if (!categoryTouched && initialValues.category !== undefined) {
      setCategory(initialValues.category ?? 'fresh');
    }
    if (!stockTouched && initialValues.stock_status !== undefined) {
      setStockStatus(initialValues.stock_status ?? 'in_stock');
    }
  }, [
    initialValues?.name,
    initialValues?.location,
    initialValues?.category,
    initialValues?.stock_status,
    nameTouched,
    locationTouched,
    categoryTouched,
    stockTouched,
  ]);


  const isValid = name.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    onSubmit({
      name: name.trim(),
      location,
      category,
      stock_status: stockStatus,
    });
  };

  return (
    <form className="add-item-form" onSubmit={handleSubmit}>
      {/* Name field */}
      <div className="form-field">
        <label className="form-label" htmlFor="item-name">
          Name <span className="form-required">*</span>
        </label>
        <input
          id="item-name"
          type="text"
          className="form-input"
          value={name}
          onChange={(e) => {
            setNameTouched(true);
            setName(e.target.value);
          }}

          placeholder="e.g. Chicken breast"
          autoFocus
          autoComplete="off"
        />
      </div>

      {/* Location field */}
      <div className="form-field">
        <label className="form-label" htmlFor="item-location">
          Location <span className="form-required">*</span>
        </label>
        <div className="form-select-wrapper">
          <select
            id="item-location"
            className="form-select"
            value={location}
            onChange={(e) => {
              setLocationTouched(true);
              setLocation(e.target.value as Location);
            }}
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {LOCATION_LABELS[loc]}
              </option>
            ))}
          </select>
          <span className="form-select-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
      </div>

      {/* Category field */}
      <div className="form-field">
        <label className="form-label" htmlFor="item-category">
          Category
        </label>
        <div className="form-select-wrapper">
          <select
            id="item-category"
            className="form-select"
            value={category}
            onChange={(e) => { setCategoryTouched(true); setCategory(e.target.value as Category); }}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
          <span className="form-select-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
        <span className="form-hint">Used to determine shelf-life warnings</span>
      </div>

      {/* Stock status field */}
      <div className="form-field">
        <label className="form-label" htmlFor="item-stock">
          Stock status
        </label>
        <div className="form-select-wrapper">
          <select
            id="item-stock"
            className="form-select"
            value={stockStatus}
            onChange={(e) => { setStockTouched(true); setStockStatus(e.target.value as StockStatus); }}
          >
            {STOCK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STOCK_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
          <span className="form-select-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="form-actions">
        <button type="button" className="btn btn--secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary" disabled={!isValid}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
