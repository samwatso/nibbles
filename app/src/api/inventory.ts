/**
 * Inventory API client
 * Connects to Cloudflare Pages Functions endpoints
 */

import type { InventoryItem, Location, Category, StockStatus } from '../types';

const API_BASE = '/api';

interface ApiResponse<T> {
  ok: boolean;
  error?: string;
  items?: T[];
  item?: T;
}

export interface CreateInventoryInput {
  name: string;
  location: Location;
  category: Category;
  stock_status: StockStatus;
}

export async function fetchInventory(): Promise<InventoryItem[]> {
  const response = await fetch(`${API_BASE}/inventory`);

  if (!response.ok) {
    throw new Error(`Failed to fetch inventory: ${response.status}`);
  }

  const data: ApiResponse<InventoryItem> = await response.json();

  if (!data.ok) {
    throw new Error(data.error || 'Failed to fetch inventory');
  }

  return data.items || [];
}

export async function createInventoryItem(input: CreateInventoryInput): Promise<InventoryItem> {
  const response = await fetch(`${API_BASE}/inventory/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`Failed to create item: ${response.status}`);
  }

  const data: ApiResponse<InventoryItem> = await response.json();

  if (!data.ok || !data.item) {
    throw new Error(data.error || 'Failed to create item');
  }

  return data.item;
}

async function api<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const text = await res.text();
  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // Helpful error if something returns HTML (common on localhost without proxy)
    throw new Error(`API returned non-JSON (${res.status}). Body starts: ${text.slice(0, 40)}`);
  }

  if (!res.ok || data?.ok === false) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }

  return data as T;
}

export async function bulkDeleteInventoryItems(ids: string[]): Promise<void> {
  await api("/api/inventory/bulk", {
    method: "POST",
    body: JSON.stringify({ action: "delete", ids }),
  });
}

export async function bulkMoveInventoryItems(ids: string[], location: Location): Promise<void> {
  await api("/api/inventory/bulk", {
    method: "POST",
    body: JSON.stringify({ action: "move", ids, location }),
  });
}

export async function bulkMarkInventoryItemsOutOfStock(ids: string[]): Promise<void> {
  await api("/api/inventory/bulk", {
    method: "POST",
    body: JSON.stringify({ action: "mark_out_of_stock", ids }),
  });
}

export type InventoryPatch = Partial<
  Pick<InventoryItem, "name" | "location" | "category" | "stock_status">
>;

export async function updateInventoryItem(
  id: string,
  patch: InventoryPatch
): Promise<InventoryItem> {
  const response = await fetch(`${API_BASE}/inventory/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });

  if (!response.ok) {
    throw new Error(`Failed to update item: ${response.status}`);
  }

  const data: ApiResponse<InventoryItem> = await response.json();

  if (!data.ok || !data.item) {
    throw new Error(data.error || "Failed to update item");
  }

  return data.item;
}
