import React from 'react';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export const RootErrorPage: React.FC = () => {
    const error = useRouteError();
    const navigate = useNavigate();

    let title = "Oops! Unexpected Error";
    let message = "Something went wrong. Please try again later.";

    if (isRouteErrorResponse(error)) {
        if (error.status === 404) {
            title = "404 - Page Not Found";
            message = "The page you are looking for doesn't exist or has been moved.";
        } else if (error.status === 401) {
            title = "401 - Unauthorized";
            message = "Please log in to access this page.";
        } else if (error.status === 503) {
            title = "503 - Service Unavailable";
            message = "The server is currently unable to handle the request.";
        }
    } else if (error instanceof Error) {
        message = error.message;
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-bg-secondary text-center">
            <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-24 h-24 bg-error/10 text-error rounded-3xl flex items-center justify-center mx-auto transform rotate-12">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-text-primary tracking-tight">
                        {title}
                    </h1>
                    <p className="text-text-secondary text-lg leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="flex flex-col space-y-3 pt-4">
                    <Button variant="primary" onClick={() => navigate('/')}>
                        Go to Home
                    </Button>
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        Refresh Page
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RootErrorPage;
