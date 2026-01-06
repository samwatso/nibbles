import { useState } from 'react';
import { getRandomFakeBarcodeResult } from '../data/mockData';
import { AddItemForm } from './AddItemForm';
import type { Location, Category, StockStatus } from '../types';
import './BarcodeScanner.css';

type ScanState = 'scanning' | 'confirm';

interface BarcodeScannerProps {
  onComplete: (item: {
    name: string;
    location: Location;
    category: Category;
    stock_status: StockStatus;
  }) => void;
  onCancel: () => void;
}

export function BarcodeScanner({ onComplete, onCancel }: BarcodeScannerProps) {
  const [state, setState] = useState<ScanState>('scanning');
  const [scannedProduct, setScannedProduct] = useState<{
    name: string;
    category: Category;
    suggestedLocation: Location;
  } | null>(null);

  const handleFakeScan = () => {
    const product = getRandomFakeBarcodeResult();
    setScannedProduct(product);
    setState('confirm');
  };

  if (state === 'confirm' && scannedProduct) {
    return (
      <div className="barcode-confirm">
        <div className="barcode-confirm-badge">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Product found
        </div>
        <AddItemForm
          initialValues={{
            name: scannedProduct.name,
            location: scannedProduct.suggestedLocation,
            category: scannedProduct.category,
            stock_status: 'in_stock',
          }}
          onSubmit={onComplete}
          onCancel={() => setState('scanning')}
          submitLabel="Add to inventory"
        />
      </div>
    );
  }

  return (
    <div className="barcode-scanner">
      <div className="scanner-viewport">
        <div className="scanner-frame">
          <div className="scanner-corner scanner-corner--tl" />
          <div className="scanner-corner scanner-corner--tr" />
          <div className="scanner-corner scanner-corner--bl" />
          <div className="scanner-corner scanner-corner--br" />
          <div className="scanner-line" />
        </div>
        <p className="scanner-hint">Point camera at barcode</p>
      </div>

      <div className="scanner-actions">
        <button className="btn btn--primary scanner-fake-btn" onClick={handleFakeScan}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          Simulate scan
        </button>
        <button className="btn btn--secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>

      <p className="scanner-note">
        Real barcode scanning coming soon. For now, use "Simulate scan" to test the flow.
      </p>
    </div>
  );
}
