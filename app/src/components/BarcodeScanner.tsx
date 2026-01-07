import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { NotFoundException } from "@zxing/library";
import { getRandomFakeBarcodeResult } from "../data/mockData";
import { AddItemForm } from "./AddItemForm";
import type { Location, Category, StockStatus } from "../types";
import "./BarcodeScanner.css";

type ScanState = "scanning" | "confirm";

interface BarcodeScannerProps {
  onComplete: (item: {
    name: string;
    location: Location;
    category: Category;
    stock_status: StockStatus;
  }) => void;
  onCancel: () => void;
}

type ScannedProduct = {
  name: string;
  category: Category;
  suggestedLocation: Location;
  barcode?: string;
};

export function BarcodeScanner({ onComplete, onCancel }: BarcodeScannerProps) {
  const [state, setState] = useState<ScanState>("scanning");
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);

  const stopCamera = () => {
    try {
      controlsRef.current?.stop();
    } catch {
      // ignore
    }
    controlsRef.current = null;

    // Extra safety: stop any active media tracks
    const v = videoRef.current;
    const stream = v?.srcObject as MediaStream | null;
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      if (v) v.srcObject = null;
    }
  };

  // Start ZXing scanner when in scanning state
  useEffect(() => {
    if (state !== "scanning") return;

    let cancelled = false;
    const reader = new BrowserMultiFormatReader();

    const start = async () => {
      try {
        setError(null);

        if (!videoRef.current) return;

        // This will request camera permissions and start decoding frames.
        // undefined = default camera (usually rear camera on mobile)
        const controls = await reader.decodeFromVideoDevice(
          undefined,
          videoRef.current,
          async (result, err) => {
            if (cancelled) return;

            if (result) {
              const code = result.getText();

              // stop immediately to avoid double-fires
              stopCamera();

              // Minimal “product” mapping for now:
              // If you add /api/off later, you can swap this to a lookup.
              const product: ScannedProduct = {
                barcode: code,
                name: `Scanned item (${code})`,
                category: "other",
                suggestedLocation: "pantry",
              };

              setScannedProduct(product);
              setState("confirm");
              return;
            }

            // NotFoundException is normal (no barcode found in the frame yet)
            if (err && !(err instanceof NotFoundException)) {
              setError(err.message || "Scanner error");
            }
          }
        );

        controlsRef.current = controls;
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    };

    start();

    return () => {
      cancelled = true;
      stopCamera();
      reader.reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const handleFakeScan = () => {
    stopCamera();
    const product = getRandomFakeBarcodeResult();
    setScannedProduct(product);
    setState("confirm");
  };

  const handleBackToScan = () => {
    setScannedProduct(null);
    setError(null);
    setState("scanning");
  };

  if (state === "confirm" && scannedProduct) {
    return (
      <div className="barcode-confirm">
        <div className="barcode-confirm-badge">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Product found
        </div>

        <AddItemForm
          initialValues={{
            name: scannedProduct.name,
            location: scannedProduct.suggestedLocation,
            category: scannedProduct.category,
            stock_status: "in_stock",
          }}
          onSubmit={onComplete}
          onCancel={handleBackToScan}
          submitLabel="Add to inventory"
        />
      </div>
    );
  }

  return (
    <div className="barcode-scanner">
      <div className="scanner-viewport">
        <video
          ref={videoRef}
          className="scanner-video"
          muted
          playsInline
          // iOS Safari likes autoplay muted when started from a user action (opening the sheet)
          autoPlay
        />

        <div className="scanner-frame">
          <div className="scanner-corner scanner-corner--tl" />
          <div className="scanner-corner scanner-corner--tr" />
          <div className="scanner-corner scanner-corner--bl" />
          <div className="scanner-corner scanner-corner--br" />
          <div className="scanner-line" />
        </div>

        <p className="scanner-hint">Point camera at barcode</p>
      </div>

      {error && <p className="scanner-note">Camera/scan error: {error}</p>}

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

        <button className="btn btn--secondary" onClick={() => { stopCamera(); onCancel(); }}>
          Cancel
        </button>
      </div>

      <p className="scanner-note">
        Tip: camera scanning works on HTTPS (Cloudflare Pages) and localhost. “Simulate scan” is a fallback.
      </p>
    </div>
  );
}
