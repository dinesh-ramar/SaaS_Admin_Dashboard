import React, { useEffect } from 'react';
import { orderService } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import Table from '../components/common/Table';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

// Extracted cell renderers for better performance and clean code
const OrderIdCell = (row) => (
    <span className="font-medium text-primary">ORD-{row.id}</span>
);

const ItemsCell = (row) => (
    <div className="flex flex-col">
        <span className="text-sm">{row.products.length} Items</span>
        <span className="text-xs text-textMuted truncate max-w-[200px]">
            {row.products.map(p => p.title).join(', ')}
        </span>
    </div>
);

const AmountCell = (row) => (
    <span className="font-bold">${row.total.toFixed(2)}</span>
);

const DiscountCell = (row) => (
    <span className="text-success">${row.discountedTotal.toFixed(2)}</span>
);

const StatusCell = (row) => {
    // Helper to determine status and variant
    const getStatusInfo = (id) => {
        const statusMap = { 0: 'Pending', 1: 'Shipped', 2: 'Delivered' };
        const variantMap = { 'Delivered': 'success', 'Shipped': 'primary', 'Pending': 'warning' };
        const status = statusMap[id % 3];
        return { status, variant: variantMap[status] };
    };

    const { status, variant } = getStatusInfo(row.id);
    return <Badge variant={variant}>{status}</Badge>;
};

const Orders = () => {
    const { data, loading, error, fetchData } = useFetch(orderService.getAll);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const columns = [
        {
            header: 'Order ID',
            accessor: 'id',
            cell: OrderIdCell
        },
        {
            header: 'Items',
            cell: ItemsCell
        },
        {
            header: 'Total Amount',
            cell: AmountCell
        },
        {
            header: 'Discounted',
            cell: DiscountCell
        },
        {
            header: 'Status',
            cell: StatusCell
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold font-heading text-textPrimary">Transactions & Orders</h1>
            </div>

            {error ? (
                <div className="bg-red-50 border border-red-200 text-error p-4 rounded-lg">
                    {error}
                </div>
            ) : (
                <Card className="p-0 overflow-hidden">
                    <Table
                        columns={columns}
                        data={data?.carts || []}
                        loading={loading}
                        emptyMessage="No orders found"
                    />
                </Card>
            )}
        </div>
    );
};


export default Orders;
