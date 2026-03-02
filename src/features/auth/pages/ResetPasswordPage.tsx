import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { ResetPasswordForm } from '../components/ResetPasswordForm';

export const ResetPasswordPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-bg-secondary flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
                        Create new password
                    </h1>
                    <p className="text-text-secondary">
                        Please enter your new password below
                    </p>
                </div>

                <Card className="p-8">
                    <ResetPasswordForm />
                </Card>

                <p className="text-center text-text-secondary">
                    Wait, I remember!{' '}
                    <Link to="/login" className="text-brand font-semibold hover:underline">
                        Back to login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
