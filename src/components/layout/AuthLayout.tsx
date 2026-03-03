import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-bg-secondary flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center">
                    <img src="/logo.png" alt="Himate" className="w-24 h-auto mx-auto mb-8 object-contain animate-in fade-in zoom-in duration-700" />
                </div>
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
