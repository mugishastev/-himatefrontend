import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from './routes.config';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import VerifyEmailPage from '../features/auth/pages/VerifyEmailPage';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './protected-route';
import RootErrorPage from './pages/RootErrorPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <ProtectedRoute />,
        errorElement: <RootErrorPage />,
        children: [
            {
                index: true,
                element: <Navigate to={ROUTES.DASHBOARD} replace />,
            },
            {
                path: ROUTES.DASHBOARD,
                element: <DashboardLayout />,
            },
        ],
    },
    {
        path: ROUTES.AUTH.LOGIN,
        element: <LoginPage />,
        errorElement: <RootErrorPage />,
    },
    {
        path: ROUTES.AUTH.REGISTER,
        element: <RegisterPage />,
        errorElement: <RootErrorPage />,
    },
    {
        path: ROUTES.AUTH.VERIFY_EMAIL,
        element: <VerifyEmailPage />,
        errorElement: <RootErrorPage />,
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
]);
