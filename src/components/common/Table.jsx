import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const Table = ({ columns, data, loading, emptyMessage = "No data found" }) => {
    const renderBody = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan={columns.length} className="px-6 py-10 text-center">
                        <div className="flex justify-center flex-col items-center space-y-2">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm text-textMuted">Loading data...</span>
                        </div>
                    </td>
                </tr>
            );
        }

        if (!data || data.length === 0) {
            return (
                <tr>
                    <td colSpan={columns.length} className="px-6 py-10 text-center text-sm text-textMuted">
                        {emptyMessage}
                    </td>
                </tr>
            );
        }

        return data.map((row, rowIdx) => (
            <tr key={row.id || rowIdx} className="hover:bg-primary/5 transition-colors">
                {columns.map((column, colIdx) => (
                    <td
                        key={column.accessor || colIdx}
                        className={clsx("px-6 py-4 whitespace-nowrap text-sm text-textPrimary", column.cellClassName)}
                    >
                        {column.cell ? column.cell(row) : row[column.accessor]}
                    </td>
                ))}
            </tr>
        ));
    };

    return (
        <div className="overflow-x-auto border border-border rounded-lg transition-colors duration-200">
            <table className="min-w-full divide-y divide-border bg-card">
                <thead className="bg-app-bg">
                    <tr>
                        {columns.map((column, idx) => (
                            <th
                                key={column.accessor || column.header || idx}
                                scope="col"
                                className={clsx(
                                    "px-6 py-3 text-left text-xs font-medium text-textMuted uppercase tracking-wider",
                                    column.className
                                )}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {renderBody()}
                </tbody>
            </table>
        </div>
    );
};

Table.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
        header: PropTypes.string.isRequired,
        accessor: PropTypes.string,
        cell: PropTypes.func,
        className: PropTypes.string,
        cellClassName: PropTypes.string,
    })).isRequired,
    data: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    emptyMessage: PropTypes.string,
};

export default Table;
