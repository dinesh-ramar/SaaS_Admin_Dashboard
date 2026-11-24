import type { OrderStatus } from '../types/order';

const STORAGE_KEY = 'saas_admin_order_statuses';

type StatusMap = Record<string, OrderStatus>;

function readMap(): StatusMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as StatusMap;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeMap(map: StatusMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getStoredStatus(orderId: number): OrderStatus | null {
  const map = readMap();
  return map[String(orderId)] ?? null;
}

export function setStoredStatus(orderId: number, status: OrderStatus): void {
  const map = readMap();
  map[String(orderId)] = status;
  writeMap(map);
}
