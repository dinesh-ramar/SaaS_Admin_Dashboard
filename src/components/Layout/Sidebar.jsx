import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingCart, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

const Sidebar = ({ isOpen, onClose }) => {
    const { logout } = useAuth();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Users, label: 'Users', path: '/users' },
        { icon: ShoppingCart, label: 'Orders', path: '/orders' },
    ];

    const handleLogout = () => {
        logout();
    };

    return (
        <>
            {/* Mobile Overlay */}
            <button
                type="button"
                className={clsx(
                    "fixed inset-0 z-20 bg-gray-900/50 transition-opacity lg:hidden",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
                onKeyDown={(e) => e.key === 'Escape' && onClose()}
                aria-label="Close sidebar overlay"
                tabIndex={isOpen ? 0 : -1}
            />

            {/* Sidebar Component */}
            <aside
                className={clsx(
                    "fixed inset-y-0 left-0 z-30 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between h-16 px-6 border-b border-border">
                        <span className="text-xl font-bold font-heading text-primary">SaaS Admin</span>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-md lg:hidden hover:bg-primary/10 text-textMuted"
                            aria-label="Close sidebar"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => onClose()} // Close on mobile nav
                                className={({ isActive }) => clsx(
                                    "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-textMuted hover:bg-primary/10 hover:text-textPrimary"
                                )}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Footer / Logout */}
                    <div className="p-4 border-t border-border">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm font-medium text-error rounded-md hover:bg-error/10 transition-colors"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

Sidebar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default Sidebar;
