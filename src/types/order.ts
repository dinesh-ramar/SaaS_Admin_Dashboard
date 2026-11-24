export type OrderStatus = 'pending' | 'shipped' | 'delivered';

export interface OrderProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail?: string;
}

export interface Order {
  id: number;
  userId: number;
  products: OrderProduct[];
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
  status: OrderStatus;
}

export interface OrderListResponse {
  carts: Order[];
  total: number;
  skip: number;
  limit: number;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  shipped: 'Shipped',
  delivered: 'Delivered',
};

export const ORDER_STATUS_VARIANTS: Record<
  OrderStatus,
  'warning' | 'primary' | 'success'
> = {
  pending: 'warning',
  shipped: 'primary',
  delivered: 'success',
};

/** Default status when no persisted override exists (matches prior list heuristic). */
export function defaultOrderStatus(orderId: number): OrderStatus {
  const statuses: OrderStatus[] = ['pending', 'shipped', 'delivered'];
  return statuses[orderId % 3];
}
