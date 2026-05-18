import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../auth.schema';
import type { LoginFormValues } from '../auth.schema';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useAuth } from '../../../hooks/useAuth';
import { authApi } from '../../../api/auth.api';

export const LoginForm: React.FC = () => {
    const { login, isLoading, error, isBanned } = useAuth();
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    // Appeal Modal State
    const [appealModalOpen, setAppealModalOpen] = useState(false);
    const [appealEmail, setAppealEmail] = useState('');
    const [appealStatement, setAppealStatement] = useState('');
    const [appealSubmitting, setAppealSubmitting] = useState(false);
    const [appealSuccess, setAppealSuccess] = useState<string | null>(null);
    const [appealError, setAppealError] = useState<string | null>(null);

    const onSubmit = (data: LoginFormValues) => {
        login(data);
    };

    const handleOpenAppeal = () => {
        setAppealEmail(getValues('email') || '');
        setAppealStatement('');
        setAppealSuccess(null);
        setAppealError(null);
        setAppealModalOpen(true);
    };

    const handleSendAppeal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!appealEmail || !appealStatement.trim()) return;
        setAppealSubmitting(true);
        setAppealSuccess(null);
        setAppealError(null);
        try {
            const res = await authApi.submitAppeal(appealEmail, appealStatement);
            setAppealSuccess(res.message || 'Your unban appeal has been successfully filed with Himate Safety Administrators.');
            setAppealStatement('');
        } catch (err: any) {
            setAppealError(err.response?.data?.message || 'Failed to submit unban appeal statement');
        } finally {
            setAppealSubmitting(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-4">
                    <Input
                        type="email"
                        placeholder="Email address or phone number"
                        className="py-4 text-lg bg-white border-gray-300 focus:border-brand focus:ring-1 focus:ring-brand placeholder:opacity-100 text-slate-800"
                        error={errors.email?.message}
                        {...register('email')}
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        className="py-4 text-lg bg-white border-gray-300 focus:border-brand focus:ring-1 focus:ring-brand placeholder:opacity-100 text-slate-800"
                        error={errors.password?.message}
                        {...register('password')}
                    />
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-top-1 space-y-2">
                        <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <div>
                                <p className="font-bold text-red-700">Access Restricted</p>
                                <p className="text-xs text-red-600 mt-0.5">{error}</p>
                            </div>
                        </div>

                        {isBanned && (
                            <button
                                type="button"
                                onClick={handleOpenAppeal}
                                className="w-full text-center py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition-all mt-2 cursor-pointer shadow-sm hover:shadow-md active:scale-[0.98] border-none"
                            >
                                Appeal Suspension & Submit Statement
                            </button>
                        )}
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full py-4 text-xl font-bold bg-[#F97316] hover:bg-[#EA6C0A] text-white rounded-xl shadow-xl transition-all hover:scale-[1.01] active:scale-[0.98] border-none cursor-pointer"
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

            {/* Premium Suspension Appeal Modal */}
            {appealModalOpen && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-scale-up text-left">
                        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                            <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            Suspension Appeal Form
                        </h2>
                        <p className="text-xs text-slate-400 mb-6">
                            If you believe your account was suspended in error, please provide your statement below. Our safety administration team will inspect the appeal and make a final determination.
                        </p>

                        {appealSuccess ? (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl space-y-4">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    <span className="font-bold">Appeal Submitted Successfully!</span>
                                </div>
                                <p className="text-xs leading-relaxed">
                                    {appealSuccess}
                                </p>
                                <button
                                    onClick={() => setAppealModalOpen(false)}
                                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                                >
                                    Close Appeal Window
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSendAppeal} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Registered Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={appealEmail}
                                        onChange={(e) => setAppealEmail(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand text-sm"
                                        placeholder="Enter your registered email..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Detailed Appeal Statement</label>
                                    <textarea
                                        required
                                        value={appealStatement}
                                        onChange={(e) => setAppealStatement(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-brand h-32 resize-none text-sm leading-relaxed"
                                        placeholder="Describe the circumstances and provide statements regarding why your account should be unbanned..."
                                    />
                                </div>

                                {appealError && (
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs font-medium">
                                        {appealError}
                                    </div>
                                )}

                                <p className="text-[10px] text-slate-500 leading-normal">
                                    Need direct contact? You can also email us directly at <a href="mailto:support@himate.com" className="text-brand hover:underline font-semibold">support@himate.com</a> or visit our <a href="/support" className="text-brand hover:underline font-semibold">Support Portal</a>.
                                </p>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setAppealModalOpen(false)}
                                        className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={appealSubmitting || !appealStatement.trim()}
                                        className="flex-1 py-2.5 rounded-lg text-sm font-bold bg-brand text-white hover:bg-brand/95 transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-brand/20"
                                    >
                                        {appealSubmitting ? 'Submitting Appeal...' : 'Submit Unban Appeal'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
