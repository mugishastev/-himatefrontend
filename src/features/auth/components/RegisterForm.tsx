import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../auth.schema';
import type { RegisterFormValues } from '../auth.schema';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useAuth } from '../../../hooks/useAuth';

export const RegisterForm: React.FC = () => {
    const { register: registerUser, isLoading, error } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = (data: RegisterFormValues) => {
        const { confirmPassword, ...registerData } = data;
        registerUser(registerData);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
                <Input
                    placeholder="Username"
                    className="py-3 bg-white border-gray-200 focus:border-brand focus:ring-1 focus:ring-brand"
                    error={errors.username?.message}
                    {...register('username')}
                />

                <Input
                    type="email"
                    placeholder="Email address"
                    className="py-3 bg-white border-gray-200 focus:border-brand focus:ring-1 focus:ring-brand"
                    error={errors.email?.message}
                    {...register('email')}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        type="password"
                        placeholder="New password"
                        className="py-3 bg-white border-gray-200 focus:border-brand focus:ring-1 focus:ring-brand"
                        error={errors.password?.message}
                        {...register('password')}
                    />
                    <Input
                        type="password"
                        placeholder="Confirm password"
                        className="py-3 bg-white border-gray-200 focus:border-brand focus:ring-1 focus:ring-brand"
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword')}
                    />
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="pt-4 flex justify-center">
                <Button
                    type="submit"
                    className="w-full md:w-2/3 py-3 text-xl font-black bg-[#42b72a] hover:bg-[#36a420] text-white rounded-lg shadow-lg transform transition-all hover:-translate-y-0.5"
                    isLoading={isLoading}
                >
                    Sign Up
                </Button>
            </div>
        </form>
    );
};
