import React, { useState, useEffect, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { userService } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import Table from '../components/common/Table';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import { debounce } from '../utils/debounce';
import { validateSearchTerm } from '../utils/validation';

// Extracted cell renderers to resolve ESLint warnings and improve performance
const UserCell = (row) => (
    <div className="flex items-center">
        <img className="h-8 w-8 rounded-full bg-gray-100" src={row.image} alt="" />
        <div className="ml-4">
            <div className="font-medium">{row.firstName} {row.lastName}</div>
            <div className="text-xs text-textMuted">{row.email}</div>
        </div>
    </div>
);

const RoleCell = (row) => (
    <Badge variant={row.role === 'admin' ? 'primary' : 'neutral'} className="capitalize">
        {row.role}
    </Badge>
);

const CompanyCell = (row) => (
    <div className="max-w-xs truncate">
        {row.company?.name}
    </div>
);

const Users = () => {
    const [inputValue, setInputValue] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const limit = 10;

    const applySearch = useMemo(
        () =>
            debounce((term) => {
                if (!validateSearchTerm(term)) return;
                setSearchTerm(term);
                setCurrentPage(0);
            }, 500),
        []
    );

    const { data, loading, error, fetchData } = useFetch(
        searchTerm ? () => userService.search(searchTerm) : () => userService.getAll(limit, currentPage * limit)
    );

    useEffect(() => {
        fetchData();
    }, [fetchData, currentPage, searchTerm]);

    const onSearchChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        applySearch(value);
    };

    const columns = [
        {
            header: 'User',
            cell: UserCell
        },
        {
            header: 'Role',
            accessor: 'role',
            cell: RoleCell
        },
        {
            header: 'Company',
            cell: CompanyCell
        }
    ];

    const totalUsers = data?.total || 0;
    const totalPages = Math.ceil(totalUsers / limit);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold font-heading text-textPrimary">Users Management</h1>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted w-4 h-4" />
                    <Input
                        value={inputValue}
                        onChange={onSearchChange}
                        placeholder="Search users..."
                        className="pl-10"
                    />
                </div>
            </div>

            {error ? (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-error p-4 rounded-lg">
                    {error}
                </div>
            ) : (
                <Card className="p-0 overflow-hidden">
                    <Table
                        columns={columns}
                        data={data?.users || []}
                        loading={loading}
                    />

                    {/* Pagination */}
                    <div className="px-6 py-4 flex items-center justify-between border-t border-border bg-app-bg transition-colors duration-200">
                        <div className="text-sm text-textMuted">
                            Showing <span className="font-medium text-textPrimary">{currentPage * limit + 1}</span> to <span className="font-medium text-textPrimary">{Math.min((currentPage + 1) * limit, totalUsers)}</span> of <span className="font-medium text-textPrimary">{totalUsers}</span> users
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                                disabled={currentPage === 0 || loading}
                                className="p-2 border border-border rounded-md hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-textPrimary"
                                aria-label="Previous page"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                                disabled={currentPage >= totalPages - 1 || loading}
                                className="p-2 border border-border rounded-md hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-textPrimary"
                                aria-label="Next page"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default Users;
