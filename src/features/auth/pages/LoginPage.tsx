import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { LoginForm } from '../components/LoginForm';
import { ROUTES } from '../../../app/routes.config';
import { useAuthStore } from '../../../store/auth.store';

export const LoginPage: React.FC = () => {
    const { isAuthenticated } = useAuthStore();

    if (isAuthenticated) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    return (
        <div className="min-h-screen bg-bg-secondary flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-6 transform hover:rotate-6 transition-transform">
                        <span className="text-white text-3xl font-bold italic">H!</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
                        Welcome back
                    </h1>
                    <p className="text-text-secondary">
                        Enter your credentials to access your Himate account
                    </p>
                </div>

                <Card className="p-8">
                    <LoginForm />
                </Card>

                <p className="text-center text-text-secondary">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-brand font-semibold hover:underline">
                        Sign up for free
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
