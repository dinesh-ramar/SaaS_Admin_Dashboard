import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/Layout/Layout';

// Lazy load page components to reduce initial bundle size
const Login = lazy(() => import('../pages/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Users = lazy(() => import('../pages/Users'));
const Orders = lazy(() => import('../pages/Orders'));

// Loading fallback component
const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-app-bg">
        <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-textMuted">Loading...</p>
        </div>
    </div>
);

const AppRoutes = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/orders" element={<Orders />} />
                </Route>
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
