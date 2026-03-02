import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-bg-secondary text-center">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-extrabold text-brand">Oops!</h1>
                        <p className="text-text-secondary">Something went wrong. Please try refreshing the page.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2.5 bg-brand text-white font-bold rounded-2xl shadow-lg hover:bg-brand-dark transition-all"
                        >
                            Refresh App
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
