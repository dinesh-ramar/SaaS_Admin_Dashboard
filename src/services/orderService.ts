import {
  defaultOrderStatus,
  type Order,
  type OrderListResponse,
  type OrderProduct,
  type OrderStatus,
} from '../types/order';
import { getStoredStatus, setStoredStatus } from './orderStatusStore';

const BASE_URL = 'https://dummyjson.com';

interface DummyCart {
  id: number;
  userId: number;
  products: OrderProduct[];
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
}

interface DummyCartsResponse {
  carts: DummyCart[];
  total: number;
  skip: number;
  limit: number;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 429) {
    throw new Error('Too many requests. Please wait a moment and try again.');
  }

  if (!response.ok) {
    throw new Error('Something went wrong. Please try again.');
  }

  return response.json() as Promise<T>;
}

async function apiGet<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Something')) {
      throw error;
    }
    if (error instanceof Error && error.message.startsWith('Too many')) {
      throw error;
    }
    throw new Error('Network error. Please check your connection.');
  }
}

function withStatus(cart: DummyCart): Order {
  const stored = getStoredStatus(cart.id);
  return {
    ...cart,
    status: stored ?? defaultOrderStatus(cart.id),
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const orderService = {
  getAll: async (): Promise<OrderListResponse> => {
    const data = await apiGet<DummyCartsResponse>('/carts');
    return {
      ...data,
      carts: data.carts.map(withStatus),
    };
  },

  getById: async (id: number): Promise<Order> => {
    const cart = await apiGet<DummyCart>(`/carts/${id}`);
    return withStatus(cart);
  },

  /**
   * Persists order status so a page refresh keeps the new value.
   * On failure, nothing is written — callers should keep the previous status.
   */
  updateStatus: async (id: number, status: OrderStatus): Promise<OrderStatus> => {
    await delay(450);

    try {
      setStoredStatus(id, status);
    } catch {
      throw new Error('Failed to save order status. Please try again.');
    }

    return status;
  },
};
