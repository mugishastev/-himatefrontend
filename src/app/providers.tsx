import React from 'react';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { Toaster } from '../components/ui/Toaster';

interface ProvidersProps {
    children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
    return (
        <ErrorBoundary>
            {children}
            <Toaster />
        </ErrorBoundary>
    );
};

export default Providers;
