import React from 'react';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { Toaster } from '../components/ui/Toaster';
import { ThemeSync } from './theme-sync';

interface ProvidersProps {
    children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
    return (
        <ErrorBoundary>
            <ThemeSync />
            {children}
            <Toaster />
        </ErrorBoundary>
    );
};

export default Providers;
