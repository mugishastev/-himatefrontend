import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { authApi } from '../../../api/auth.api';

const schema = z.object({
    email: z.string().email('Invalid email address'),
    otp: z.string().length(6, 'Code must be exactly 6 digits'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export const ResetPasswordForm: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const defaultEmail = searchParams.get('email') || '';

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: defaultEmail
        }
    });

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        setError(null);
        try {
            await authApi.resetPassword(data.email, data.otp, data.password);
            navigate('/login', { state: { message: 'Password reset successful! Please log in.' } });
        } catch (err: any) {
            setError(err.message || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
                <Input
                    type="email"
                    placeholder="Confirm your email"
                    className="py-4 text-lg bg-white border-gray-200 focus:border-brand"
                    error={errors.email?.message}
                    {...register('email')}
                />
                <Input
                    type="text"
                    placeholder="6-digit code"
                    className="py-4 text-center text-2xl font-black tracking-[0.5em] bg-gray-50 border-gray-200 focus:border-brand"
                    maxLength={6}
                    error={errors.otp?.message}
                    {...register('otp')}
                />
                <div className="pt-2">
                    <Input
                        type="password"
                        placeholder="New password"
                        className="py-4 text-lg bg-white border-gray-200 focus:border-brand"
                        error={errors.password?.message}
                        {...register('password')}
                    />
                </div>
                <Input
                    type="password"
                    placeholder="Confirm new password"
                    className="py-4 text-lg bg-white border-gray-200 focus:border-brand"
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword')}
                />
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                    {error}
                </div>
            )}

            <Button
                type="submit"
                className="w-full py-4 bg-brand hover:bg-brand-dark text-white rounded-xl font-black text-xl shadow-lg mt-4"
                isLoading={isLoading}
            >
                Reset Password
            </Button>
        </form>
    );
};
