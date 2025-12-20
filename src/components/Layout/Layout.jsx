import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex bg-app-bg dark:bg-slate-900 min-h-screen font-sans text-textPrimary dark:text-slate-100 transition-colors duration-200">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 p-4 lg:p-8 overflow-y-auto bg-app-bg dark:bg-slate-900 transition-colors duration-200">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
