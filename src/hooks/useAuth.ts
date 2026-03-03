import { useState } from 'react';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../app/routes.config';

export const useAuth = () => {
    const { setAuth, logout: clearAuth, user, isAuthenticated } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const login = async (data: any) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authApi.login(data);
            setAuth(response.user, response.accessToken, response.refreshToken);
            navigate(ROUTES.DASHBOARD);
        } catch (err: any) {
            setError(err.message || 'Login failed');
            // Re-throw if needed, but the original code didn't
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: any) => {
        setIsLoading(true);
        setError(null);
        try {
            await authApi.register(data);
            // After registration, redirect to verify email with the email in state
            navigate(ROUTES.AUTH.VERIFY_EMAIL, { state: { email: data.email } });
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const verifyEmail = async (email: string, otp: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authApi.verifyEmail(email, otp);
            setAuth(response.user, response.accessToken, response.refreshToken);
            navigate(ROUTES.DASHBOARD);
        } catch (err: any) {
            setError(err.message || 'Verification failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const resendOtp = async (email: string) => {
        setError(null);
        try {
            await authApi.resendOtp(email);
        } catch (err: any) {
            setError(err.message || 'Failed to resend OTP');
            throw err;
        }
    };

    const logout = () => {
        clearAuth();
        navigate('/login');
    };

    return {
        login,
        register,
        verifyEmail,
        resendOtp,
        logout,
        user,
        isAuthenticated,
        isLoading,
        error,
    };
};
