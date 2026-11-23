import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import Table from '../components/common/Table';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import {
    ORDER_STATUS_LABELS,
    ORDER_STATUS_VARIANTS,
} from '../types/order';

const OrderIdCell = (row) => (
    <Link
        to={`/orders/${row.id}`}
        className="font-medium text-primary hover:underline"
    >
        ORD-{row.id}
    </Link>
);

const ItemsCell = (row) => (
    <div className="flex flex-col">
        <span className="text-sm">{row.products.length} Items</span>
        <span className="text-xs text-textMuted truncate max-w-[200px]">
            {row.products.map((p) => p.title).join(', ')}
        </span>
    </div>
);

const AmountCell = (row) => (
    <span className="font-bold">${row.total.toFixed(2)}</span>
);

const DiscountCell = (row) => (
    <span className="text-success">${row.discountedTotal.toFixed(2)}</span>
);

const StatusCell = (row) => (
    <Badge variant={ORDER_STATUS_VARIANTS[row.status] || 'neutral'}>
        {ORDER_STATUS_LABELS[row.status] || row.status}
    </Badge>
);

const ActionCell = (row) => (
    <Link
        to={`/orders/${row.id}`}
        className="text-sm font-medium text-primary hover:underline"
    >
        {row.status === 'pending' ? 'Open' : 'View'}
    </Link>
);

const Orders = () => {
    const { data, loading, error, fetchData } = useFetch(orderService.getAll);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const columns = [
        {
            header: 'Order ID',
            accessor: 'id',
            cell: OrderIdCell,
        },
        {
            header: 'Items',
            cell: ItemsCell,
        },
        {
            header: 'Total Amount',
            cell: AmountCell,
        },
        {
            header: 'Discounted',
            cell: DiscountCell,
        },
        {
            header: 'Status',
            cell: StatusCell,
        },
        {
            header: '',
            cell: ActionCell,
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold font-heading text-textPrimary">
                    Transactions & Orders
                </h1>
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
