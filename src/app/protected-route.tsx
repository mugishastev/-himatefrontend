import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { ROUTES } from './routes.config';
import { useSocket } from '../hooks/useSocket';

export const ProtectedRoute: React.FC = () => {
    const { isAuthenticated } = useAuthStore();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        // Zustand persist hydration check
        const checkHydration = () => {
            if (useAuthStore.persist.hasHydrated()) {
                setIsHydrated(true);
            } else {
                // If not hydrated yet, check again soon
                const unsub = useAuthStore.persist.onHydrate(() => {
                    setIsHydrated(true);
                    unsub();
                });
            }
        };
        checkHydration();
    }, []);

    // Initialize global socket connection when authenticated
    useSocket();

    if (!isHydrated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-secondary">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand border-t-transparent"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
