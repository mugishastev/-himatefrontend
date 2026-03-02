import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { RegisterForm } from '../components/RegisterForm';

export const RegisterPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-bg-secondary flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-6 transform hover:rotate-6 transition-transform">
                        <span className="text-white text-3xl font-bold italic">H!</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
                        Create an account
                    </h1>
                    <p className="text-text-secondary">
                        Join Himate today and start chatting with friends
                    </p>
                </div>

                <Card className="p-8">
                    <RegisterForm />
                </Card>

                <p className="text-center text-text-secondary">
                    Already have an account?{' '}
                    <Link to="/login" className="text-brand font-semibold hover:underline">
                        Sign in instead
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
