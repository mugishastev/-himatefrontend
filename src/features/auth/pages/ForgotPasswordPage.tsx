import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';

export const ForgotPasswordPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-bg-secondary flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-[450px] space-y-6">
                <div className="text-center group">
                    <img
                        src="/logo.png"
                        alt="Himate"
                        className="w-20 h-auto mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-500"
                    />
                </div>

                <Card className="p-8 shadow-2xl border-none ring-1 ring-gray-100 rounded-2xl bg-white">
                    <div className="mb-6">
                        <h1 className="text-2xl font-black text-text-primary tracking-tight mb-2">
                            Find Your Account
                        </h1>
                        <p className="text-text-secondary font-medium leading-relaxed">
                            Please enter your email to search for your account and receive a reset code.
                        </p>
                    </div>

                    <ForgotPasswordForm />

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <Link to="/login" className="text-brand font-bold hover:underline block text-center">
                            Back to login
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
