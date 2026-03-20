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
import AdminProtectedRoute from './AdminProtectedRoute';
import RootErrorPage from './pages/RootErrorPage';
import { AdminLayout } from '../features/dashboard/layouts/AdminLayout';
import { AdminOverviewPage } from '../features/dashboard/pages/AdminOverviewPage';
import { AdminUsersPage } from '../features/dashboard/pages/AdminUsersPage';
import { AdminConversationsPage } from '../features/dashboard/pages/AdminConversationsPage';
import { AdminMessagesPage } from '../features/dashboard/pages/AdminMessagesPage';
import { AdminReportsPage } from '../features/dashboard/pages/AdminReportsPage';
import { AdminSettingsPage } from '../features/dashboard/pages/AdminSettingsPage';
import { AdminBannedUsersPage } from '../features/dashboard/pages/AdminBannedUsersPage';
import { AdminSupportTicketsPage } from '../features/dashboard/pages/AdminSupportTicketsPage';
import { AdminAnnouncementsPage } from '../features/dashboard/pages/AdminAnnouncementsPage';
import { AdminMediaGalleryPage } from '../features/dashboard/pages/AdminMediaGalleryPage';
import { AdminRolesPage } from '../features/dashboard/pages/AdminRolesPage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import SupportFaqPage from '../pages/SupportFaqPage';
import UserGuidePage from '../pages/UserGuidePage';

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
        path: ROUTES.ADMIN,
        element: (
            <AdminProtectedRoute>
                <AdminLayout />
            </AdminProtectedRoute>
        ),
        errorElement: <RootErrorPage />,
        children: [
            { index: true, element: <AdminOverviewPage /> },
            { path: 'users', element: <AdminUsersPage /> },
            { path: 'conversations', element: <AdminConversationsPage /> },
            { path: 'messages', element: <AdminMessagesPage /> },
            { path: 'reports', element: <AdminReportsPage /> },
            { path: 'banned', element: <AdminBannedUsersPage /> },
            { path: 'tickets', element: <AdminSupportTicketsPage /> },
            { path: 'announcements', element: <AdminAnnouncementsPage /> },
            { path: 'media', element: <AdminMediaGalleryPage /> },
            { path: 'settings', element: <AdminSettingsPage /> },
            { path: 'roles', element: <AdminRolesPage /> },
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
        path: ROUTES.PRIVACY,
        element: <PrivacyPolicyPage />,
        errorElement: <RootErrorPage />,
    },
    {
        path: ROUTES.SUPPORT,
        element: <SupportFaqPage />,
        errorElement: <RootErrorPage />,
    },
    {
        path: ROUTES.GUIDE,
        element: <UserGuidePage />,
        errorElement: <RootErrorPage />,
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
]);
