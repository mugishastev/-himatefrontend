import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-bg-secondary flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center">
                    <div className="w-20 h-20 bg-brand rounded-3xl flex items-center justify-center shadow-xl mx-auto mb-8 transform rotate-6 hover:rotate-0 transition-all duration-300">
                        <span className="text-white text-4xl font-black italic">H!</span>
                    </div>
                </div>
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
