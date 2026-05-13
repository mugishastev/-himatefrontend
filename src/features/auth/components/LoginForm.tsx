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
                    className="py-4 text-lg bg-white border-gray-300 focus:border-brand focus:ring-1 focus:ring-brand placeholder:opacity-100"
                    error={errors.email?.message}
                    {...register('email')}
                />
                <Input
                    type="password"
                    placeholder="Password"
                    className="py-4 text-lg bg-white border-gray-300 focus:border-brand focus:ring-1 focus:ring-brand placeholder:opacity-100"
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
                className="w-full py-4 text-xl font-bold bg-[#F97316] hover:bg-[#EA6C0A] text-white rounded-xl shadow-xl transition-all hover:scale-[1.01] active:scale-[0.98] border-none"
                isLoading={isLoading}
            >
                Log In
            </Button>

            <div className="text-center pt-2">
                <Link to="/forgot-password" title="Recover your password" className="text-brand-dark text-sm hover:underline font-semibold transition-colors">
                    Forgotten password?
                </Link>
            </div>
        </form>
    );
};
