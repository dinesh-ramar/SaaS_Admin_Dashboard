import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Package, Truck } from 'lucide-react';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useOrderWorkflow } from '../hooks/useOrderWorkflow';
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_VARIANTS,
} from '../types/order';

const OrderDetail: React.FC = () => {
  const { orderId: orderIdParam } = useParams<{ orderId: string }>();
  const orderId = orderIdParam ? Number(orderIdParam) : null;

  const {
    order,
    loading,
    error,
    isSaving,
    saveError,
    markAsShipped,
    retrySave,
  } = useOrderWorkflow(orderId);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-textMuted">Loading order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-4">
        <Link
          to="/orders"
          className="inline-flex items-center text-sm text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to orders
        </Link>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-error p-4 rounded-lg">
          {error || 'Order not found'}
        </div>
      </div>
    );
  }

  const canShip = order.status === 'pending';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Link
            to="/orders"
            className="inline-flex items-center text-sm text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-heading text-textPrimary">
              Order ORD-{order.id}
            </h1>
            <Badge variant={ORDER_STATUS_VARIANTS[order.status]}>
              {ORDER_STATUS_LABELS[order.status]}
            </Badge>
          </div>
          <p className="text-sm text-textMuted">
            Customer #{order.userId} · {order.totalProducts} products ·{' '}
            {order.totalQuantity} items
          </p>
        </div>

        {canShip && (
          <Button
            onClick={() => void markAsShipped()}
            isLoading={isSaving}
            disabled={isSaving}
          >
            <Truck className="w-4 h-4 mr-2" />
            Mark as shipped
          </Button>
        )}
      </div>

      {saveError && (
        <div
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-error p-4 rounded-lg"
          role="alert"
        >
          <p className="text-sm">{saveError}</p>
          <Button
            variant="secondary"
            onClick={() => void retrySave()}
            isLoading={isSaving}
            disabled={isSaving}
          >
            Retry
          </Button>
        </div>
      )}

      {!canShip && order.status === 'shipped' && !saveError && (
        <div className="bg-primary/5 border border-primary/20 text-primary p-4 rounded-lg text-sm">
          This order is shipped. Refresh the page to confirm the status is
          persisted.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Items" className="lg:col-span-2">
          <ul className="divide-y divide-border -mx-6 -my-6">
            {order.products.map((product) => (
              <li
                key={`${product.id}-${product.title}`}
                className="flex items-start gap-4 px-6 py-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-app-bg text-textMuted">
                  <Package className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-textPrimary truncate">
                    {product.title}
                  </p>
                  <p className="text-xs text-textMuted mt-0.5">
                    Qty {product.quantity} · ${product.price.toFixed(2)} each
                  </p>
                </div>
                <p className="font-medium text-textPrimary whitespace-nowrap">
                  ${product.discountedTotal.toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Summary">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-textMuted">Subtotal</dt>
              <dd className="font-medium text-textPrimary">
                ${order.total.toFixed(2)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-textMuted">Discounted total</dt>
              <dd className="font-medium text-success">
                ${order.discountedTotal.toFixed(2)}
              </dd>
            </div>
            <div className="flex justify-between pt-3 border-t border-border">
              <dt className="text-textMuted">Status</dt>
              <dd>
                <Badge variant={ORDER_STATUS_VARIANTS[order.status]}>
                  {ORDER_STATUS_LABELS[order.status]}
                </Badge>
              </dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetail;
