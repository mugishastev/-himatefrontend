import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../app/routes.config';

const VerifyEmailPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { verifyEmail, resendOtp, isLoading, error } = useAuth();
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [timer, setTimer] = useState(60);

    useEffect(() => {
        const stateEmail = location.state?.email;
        if (!stateEmail) {
            navigate(ROUTES.AUTH.LOGIN);
            return;
        }
        setEmail(stateEmail);
    }, [location, navigate]);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(t => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) return;
        try {
            await verifyEmail(email, otp);
        } catch (err) {
            // Error is handled in the hook
        }
    };

    const handleResend = async () => {
        try {
            await resendOtp(email);
            setTimer(60);
        } catch (err) {
            // Error is handled in the hook
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-secondary p-4">
            <Card className="w-full max-w-md p-8 space-y-8 shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black text-text-primary tracking-tight">Verify Email</h1>
                    <p className="text-text-secondary">
                        We've sent a 6-digit verification code to <span className="font-bold text-text-primary">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Verification Code"
                        placeholder="000000"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="text-center text-2xl tracking-[1em] font-mono"
                        required
                    />

                    {error && <p className="text-sm text-red-500 text-center bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

                    <Button type="submit" className="w-full py-4 text-lg" isLoading={isLoading} disabled={otp.length !== 6}>
                        Verify Account
                    </Button>

                    <div className="text-center">
                        <p className="text-text-secondary text-sm">
                            Didn't receive the code?{' '}
                            {timer > 0 ? (
                                <span className="font-medium text-brand">Resend in {timer}s</span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    className="font-bold text-brand hover:underline"
                                >
                                    Resend Code
                                </button>
                            )}
                        </p>
                    </div>
                </form>

                <div className="pt-4 border-t border-gray-100 text-center">
                    <button
                        onClick={() => navigate(ROUTES.AUTH.LOGIN)}
                        className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center mx-auto space-x-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Back to Login</span>
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default VerifyEmailPage;
