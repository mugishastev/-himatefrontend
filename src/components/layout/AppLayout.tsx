import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const AppLayout: React.FC = () => {
    return (
        <div className="flex h-screen bg-bg-secondary overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
