import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../auth.schema';
import type { RegisterFormValues } from '../auth.schema';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../app/routes.config';

export const RegisterForm: React.FC = () => {
    const { register: registerUser, isLoading, error } = useAuth();
    const navigate = useNavigate();
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

                <Input
                    placeholder="Phone number (optional)"
                    className="py-3 bg-white border-gray-200 focus:border-brand focus:ring-1 focus:ring-brand"
                    error={errors.phoneNumber?.message}
                    {...register('phoneNumber')}
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
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm font-medium space-y-3">
                    <p>{error}</p>
                    {(error.toLowerCase().includes('already') || error.toLowerCase().includes('limit') || error.toLowerCase().includes('network') || error.toLowerCase().includes('phone number')) && (
                        <div className="pt-1">
                            <button
                                type="button"
                                onClick={() => navigate(ROUTES.AUTH.FORGOT_PASSWORD)}
                                className="w-full sm:w-auto px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold text-xs shadow-md transition-all hover:-translate-y-0.5 flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                Recover Account & Reset Password
                            </button>
                        </div>
                    )}
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
