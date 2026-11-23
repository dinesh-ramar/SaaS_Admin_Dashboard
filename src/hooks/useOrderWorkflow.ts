import { useCallback, useEffect, useRef, useState } from 'react';
import { orderService } from '../services/orderService';
import type { Order, OrderStatus } from '../types/order';

interface UseOrderWorkflowResult {
  order: Order | null;
  loading: boolean;
  error: string | null;
  isSaving: boolean;
  saveError: string | null;
  markAsShipped: () => Promise<void>;
  retrySave: () => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Loads an order and manages status updates with rollback + Retry on save failure.
 */
export function useOrderWorkflow(orderId: number | null): UseOrderWorkflowResult {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const pendingStatusRef = useRef<OrderStatus | null>(null);

  const refresh = useCallback(async () => {
    if (orderId == null || Number.isNaN(orderId)) {
      setOrder(null);
      setError('Invalid order id');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await orderService.getById(orderId);
      setOrder(result);
    } catch (err) {
      setOrder(null);
      setError(err instanceof Error ? err.message : 'Failed to load order');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const saveStatus = useCallback(
    async (nextStatus: OrderStatus) => {
      if (!order || isSaving) return;

      const previousStatus = order.status;
      pendingStatusRef.current = nextStatus;
      setIsSaving(true);
      setSaveError(null);

      try {
        const saved = await orderService.updateStatus(order.id, nextStatus);
        setOrder((current) =>
          current ? { ...current, status: saved } : current
        );
        pendingStatusRef.current = null;
      } catch (err) {
        // Keep the previous status; offer Retry via pendingStatusRef
        setOrder((current) =>
          current ? { ...current, status: previousStatus } : current
        );
        setSaveError(
          err instanceof Error ? err.message : 'Failed to save order status'
        );
      } finally {
        setIsSaving(false);
      }
    },
    [order, isSaving]
  );

  const markAsShipped = useCallback(async () => {
    await saveStatus('shipped');
  }, [saveStatus]);

  const retrySave = useCallback(async () => {
    const pending = pendingStatusRef.current;
    if (!pending) return;
    await saveStatus(pending);
  }, [saveStatus]);

  return {
    order,
    loading,
    error,
    isSaving,
    saveError,
    markAsShipped,
    retrySave,
    refresh,
  };
}
