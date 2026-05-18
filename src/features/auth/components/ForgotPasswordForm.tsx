import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { authApi } from '../../../api/auth.api';

const schema = z.object({
    email: z.string().email('Invalid email address'),
});

type FormData = z.infer<typeof schema>;

export const ForgotPasswordForm: React.FC = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        setError(null);
        try {
            await authApi.forgotPassword(data.email);
            setIsSubmitted(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send reset link');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-[#F97316]/10 text-[#F97316] rounded-full flex items-center justify-center mx-auto animate-bounce">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-xl font-black text-text-primary mb-2">Code Sent!</h3>
                    <p className="text-text-secondary font-medium">
                        We've sent a 6-digit reset code to your email.
                    </p>
                </div>
                <Link
                    to={`/reset-password?email=${encodeURIComponent(getValues('email'))}`}
                    className="block w-full py-4 bg-[#F97316] text-[#111b21] rounded-xl font-black text-lg shadow-lg hover:bg-[#EA6C0A] transition-all"
                >
                    Continue to Reset
                </Link>
                <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-[#F97316] font-bold hover:underline text-sm"
                >
                    Didn't get a code? Try again.
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
                type="email"
                placeholder="Email address"
                className="py-4 text-lg bg-[#202c33] border-[#2a3942] text-[#e9edef] focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                error={errors.email?.message}
                {...register('email')}
            />
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                    {error}
                </div>
            )}
            <Button
                type="submit"
                className="w-full py-4 bg-[#F97316] hover:bg-[#EA6C0A] text-[#111b21] rounded-xl font-black text-xl shadow-lg transform transition-transform active:scale-95"
                isLoading={isLoading}
            >
                Search
            </Button>
        </form>
    );
};
