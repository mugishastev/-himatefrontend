import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../auth.schema';
import type { LoginFormValues } from '../auth.schema';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useAuth } from '../../../hooks/useAuth';

export const LoginForm: React.FC = () => {
    const { login, isLoading, error } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginFormValues) => {
        login(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
                <Input
                    type="email"
                    placeholder="Email address or phone number"
                    className="py-4 text-lg bg-white border-gray-200 focus:border-brand focus:ring-1 focus:ring-brand"
                    error={errors.email?.message}
                    {...register('email')}
                />
                <Input
                    type="password"
                    placeholder="Password"
                    className="py-4 text-lg bg-white border-gray-200 focus:border-brand focus:ring-1 focus:ring-brand"
                    error={errors.password?.message}
                    {...register('password')}
                />
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-top-1">
                    {error}
                </div>
            )}

            <Button
                type="submit"
                className="w-full py-4 text-xl font-black bg-brand hover:bg-brand-dark text-white rounded-lg shadow-lg"
                isLoading={isLoading}
            >
                Log In
            </Button>

            <div className="text-center">
                <Link to="/forgot-password" className="text-brand text-sm hover:underline font-medium">
                    Forgotten password?
                </Link>
            </div>
        </form>
    );
};
