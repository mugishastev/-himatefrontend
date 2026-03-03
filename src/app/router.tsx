import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from './routes.config';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '../features/auth/pages/ResetPasswordPage';
import { LandingPage } from '../pages/LandingPage';
import VerifyEmailPage from '../features/auth/pages/VerifyEmailPage';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './protected-route';
import RootErrorPage from './pages/RootErrorPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <LandingPage />,
        errorElement: <RootErrorPage />,
    },
    {
        path: ROUTES.DASHBOARD,
        element: (
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
        ),
        errorElement: <RootErrorPage />,
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
        path: ROUTES.AUTH.FORGOT_PASSWORD,
        element: <ForgotPasswordPage />,
        errorElement: <RootErrorPage />,
    },
    {
        path: ROUTES.AUTH.RESET_PASSWORD,
        element: <ResetPasswordPage />,
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
