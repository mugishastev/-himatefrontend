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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                <Input
                    label="Username"
                    placeholder="johndoe"
                    error={errors.username?.message}
                    {...register('username')}
                />
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="name@company.com"
                    error={errors.email?.message}
                    {...register('email')}
                />
                <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    error={errors.password?.message}
                    {...register('password')}
                />
                <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="••••••••"
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword')}
                />
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <Button type="submit" className="w-full" isLoading={isLoading}>
                Create Account
            </Button>
        </form>
    );
};
