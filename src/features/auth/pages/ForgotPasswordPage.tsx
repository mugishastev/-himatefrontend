import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';

export const ForgotPasswordPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-bg-secondary flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
                        Reset password
                    </h1>
                    <p className="text-text-secondary">
                        Enter your email and we'll send you a link to reset your password
                    </p>
                </div>

                <Card className="p-8">
                    <ForgotPasswordForm />
                </Card>

                <p className="text-center text-text-secondary">
                    Remember your password?{' '}
                    <Link to="/login" className="text-brand font-semibold hover:underline">
                        Back to login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
