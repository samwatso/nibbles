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