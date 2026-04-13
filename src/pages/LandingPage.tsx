import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { ROUTES } from '../app/routes.config';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const LandingPage: React.FC = () => {
    const { isAuthenticated, user } = useAuthStore();
    useDocumentTitle('Welcome');

    if (isAuthenticated) {
        return <Navigate to={user?.isAdmin ? ROUTES.ADMIN : ROUTES.DASHBOARD} replace />;
    }

    return (
        <div className="min-h-screen bg-bg-secondary flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-2xl w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
                {/* Large Logo */}
                <div className="mb-10 transform hover:scale-105 transition-transform duration-500">
                    <img
                        src="/logo.png"
                        alt="Himate Logo"
                        className="h-48 lg:h-64 w-auto object-contain drop-shadow-2xl"
                    />
                </div>

                {/* Branding */}
                <h1 className="text-6xl lg:text-8xl font-black text-brand tracking-tighter mb-4">
                    Himate
                </h1>

                <p className="text-2xl lg:text-3xl font-bold text-text-primary mb-12 max-w-lg leading-tight">
                    Connect, share and chat with the people who matter most.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
                    <Link
                        to={ROUTES.AUTH.LOGIN}
                        className="w-full sm:w-auto min-w-[200px] bg-brand hover:bg-brand-dark text-white text-xl font-black py-4 px-10 rounded-xl shadow-xl hover:shadow-2xl transform transition-all hover:-translate-y-1 active:scale-95 text-center"
                    >
                        Log In
                    </Link>
                    <Link
                        to={ROUTES.AUTH.REGISTER}
                        className="w-full sm:w-auto min-w-[200px] bg-[#42b72a] hover:bg-[#36a420] text-white text-xl font-black py-4 px-10 rounded-xl shadow-xl hover:shadow-2xl transform transition-all hover:-translate-y-1 active:scale-95 text-center"
                    >
                        Create Account
                    </Link>
                </div>

                {/* Footer Links */}
                <div className="mt-24 text-text-secondary font-medium space-y-4">
                    <p className="italic uppercase tracking-widest text-xs opacity-50 mb-4">Stay connected, everywhere.</p>
                    <div className="flex items-center justify-center gap-6 text-sm">
                        <Link to={ROUTES.GUIDE} className="hover:text-brand transition-colors">User Guide</Link>
                        <Link to={ROUTES.SUPPORT} className="hover:text-brand transition-colors">Support & FAQ</Link>
                        <Link to={ROUTES.PRIVACY} className="hover:text-brand transition-colors">Privacy Policy</Link>
                    </div>
                </div>
            </div>

            {/* Background Decorative Elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/5 rounded-full blur-[120px]"></div>
            </div>
        </div>
    );
};

export default LandingPage;
