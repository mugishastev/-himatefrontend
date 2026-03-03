import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { RegisterForm } from '../components/RegisterForm';

export const RegisterPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-bg-secondary flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg mb-8 text-center">
                <img
                    src="/logo.png"
                    alt="Himate Logo"
                    className="h-20 w-auto mx-auto object-contain mb-4 transition-transform hover:scale-110 duration-500"
                />
                <h1 className="text-4xl font-black text-brand tracking-tight mb-2">Create a new account</h1>
                <p className="text-lg font-medium text-text-secondary">It's quick and easy.</p>
            </div>

            <Card className="w-full max-w-lg p-8 shadow-2xl border-none ring-1 ring-gray-100 bg-white rounded-2xl">
                <RegisterForm />

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <Link to="/login" className="text-brand font-bold text-lg hover:underline">
                        Already have an account?
                    </Link>
                </div>
            </Card>

            <p className="mt-8 text-sm text-text-secondary max-w-md text-center">
                By clicking Sign Up, you agree to our Terms, Data Policy and Cookie Policy. You may receive SMS notifications from us and can opt out at any time.
            </p>
        </div>
    );
};

export default RegisterPage;
