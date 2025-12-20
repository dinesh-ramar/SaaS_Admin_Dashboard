import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../common/ThemeToggle';

const Navbar = ({ onMenuClick }) => {
    const { user } = useAuth();

    return (
        <header className="sticky top-0 z-10 w-full bg-card border-b border-border transition-colors duration-200">
            <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-textMuted lg:hidden hover:bg-primary/10 rounded-md transition-colors"
                    aria-label="Open menu"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Spacer / Title if needed */}
                <div className="flex-1 lg:flex-none"></div>

                {/* Right Actions */}
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <ThemeToggle />

                    <button
                        className="p-2 text-textMuted hover:bg-primary/10 rounded-full relative transition-colors"
                        aria-label="Notifications"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" aria-hidden="true"></span>
                    </button>

                    <div className="flex items-center pl-4 ml-4 border-l border-border">
                        <div className="flex items-center space-x-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-textPrimary">{user?.name}</p>
                                <p className="text-xs text-textMuted capitalize">{user?.role}</p>
                            </div>
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                                <User className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

Navbar.propTypes = {
    onMenuClick: PropTypes.func.isRequired,
};

export default Navbar;
