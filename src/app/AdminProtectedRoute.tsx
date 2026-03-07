import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { tokenStorage } from '../utils/token';
import { ROUTES } from './routes.config';

interface AdminProtectedRouteProps {
    children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        const checkHydration = () => {
            if (useAuthStore.persist.hasHydrated()) {
                const token = useAuthStore.getState().accessToken;
                if (token) tokenStorage.setToken(token);
                setIsHydrated(true);
            } else {
                const unsub = useAuthStore.persist.onHydrate(() => {
                    const token = useAuthStore.getState().accessToken;
                    if (token) tokenStorage.setToken(token);
                    setIsHydrated(true);
                    unsub();
                });
            }
        };
        checkHydration();
    }, []);

    if (!isHydrated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-brand font-black text-2xl animate-pulse">
                Himate...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
    }

    // Non-admins trying to access /admin get redirected to chat
    if (!user?.isAdmin) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    return <>{children}</>;
};

export default AdminProtectedRoute;
