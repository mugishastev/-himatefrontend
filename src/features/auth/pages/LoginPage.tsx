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
        <div className="min-h-screen bg-bg-secondary flex flex-col lg:flex-row items-center justify-center p-4 lg:p-0">
            {/* Branding Section (Left on Desktop) */}
            <div className="w-full lg:w-1/2 max-w-lg lg:max-w-none lg:pr-24 flex flex-col items-center lg:items-start text-center lg:text-left mb-12 lg:mb-0">
                <div className="mb-6">
                    <img
                        src="/logo.png"
                        alt="Himate Logo"
                        className="h-24 lg:h-32 w-auto object-contain transition-transform hover:scale-105 duration-300"
                    />
                </div>
                <h1 className="text-4xl lg:text-6xl font-black text-brand tracking-tight mb-4">
                    Himate
                </h1>
                <p className="text-2xl lg:text-3xl font-medium text-text-primary leading-tight max-w-md">
                    Himate helps you connect and share with the people in your life.
                </p>

                <div className="hidden lg:flex mt-12 space-x-6 text-text-secondary font-medium">
                    <span className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-brand" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Secure
                    </span>
                    <span className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-brand" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Fast
                    </span>
                    <span className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-brand" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Global
                    </span>
                </div>
            </div>

            {/* Login Form Section (Right on Desktop) */}
            <div className="w-full max-w-[400px] flex flex-col">
                <Card className="p-6 shadow-xl border-none ring-1 ring-gray-100 bg-white rounded-2xl">
                    <LoginForm />

                    <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                        <Link
                            to="/register"
                            className="inline-block bg-[#42b72a] hover:bg-[#36a420] text-white px-8 py-3 rounded-lg font-bold text-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Create new account
                        </Link>
                    </div>
                </Card>

                <p className="mt-8 text-center text-sm text-text-secondary">
                    <b>Create a Page</b> for a celebrity, brand or business.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
