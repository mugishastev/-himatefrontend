import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, LifeBuoy, AlertCircle, Wrench, HeadphonesIcon } from 'lucide-react';
import { ROUTES } from '../app/routes.config';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const SupportFaqPage: React.FC = () => {
    useDocumentTitle('Support & FAQ');
    return (
        <div className="min-h-screen bg-bg-secondary p-6 flex justify-center">
            <div className="max-w-4xl w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link to={ROUTES.HOME} className="flex items-center text-text-secondary hover:text-brand transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Home
                    </Link>
                    <div className="flex items-center text-brand font-bold text-xl">
                        <LifeBuoy className="w-6 h-6 mr-2" />
                        Support & FAQ
                    </div>
                </div>

                {/* Content Container */}
                <div className="bg-bg-primary rounded-2xl shadow-xl p-8 md:p-12 border border-border-light text-text-primary">
                    <h1 className="text-4xl font-black mb-10 text-text-primary tracking-tight">How can we help?</h1>

                    <div className="space-y-12">
                        {/* FAQ */}
                        <section>
                            <h2 className="text-2xl font-bold mb-6 flex items-center border-b border-border-light pb-2">
                                <span className="bg-brand/10 text-brand p-1.5 rounded-lg mr-3">
                                    <AlertCircle className="w-5 h-5" />
                                </span>
                                Frequently Asked Questions
                            </h2>
                            <div className="space-y-6 ml-2">
                                <div className="bg-bg-secondary p-5 rounded-xl">
                                    <h3 className="font-bold text-lg mb-2">1. I haven't received my OTP code. What do I do?</h3>
                                    <p className="text-text-secondary">Check your Spam/Junk folder. If the token expired, use the "Resend OTP" functionality on the verification page.</p>
                                </div>
                                <div className="bg-bg-secondary p-5 rounded-xl">
                                    <h3 className="font-bold text-lg mb-2">2. How do I change my password?</h3>
                                    <p className="text-text-secondary">If logged in, go to Settings &gt; Security. If logged out, click "Forgot Password" on the login screen.</p>
                                </div>
                                <div className="bg-bg-secondary p-5 rounded-xl">
                                    <h3 className="font-bold text-lg mb-2">3. The other person can't hear/see me on calls.</h3>
                                    <p className="text-text-secondary">Ensure your browser has permission to access your Camera and Microphone. Check for a lock icon in your address bar.</p>
                                </div>
                            </div>
                        </section>

                        {/* Troubleshooting */}
                        <section>
                            <h2 className="text-2xl font-bold mb-6 flex items-center border-b border-border-light pb-2">
                                <span className="bg-brand/10 text-brand p-1.5 rounded-lg mr-3">
                                    <Wrench className="w-5 h-5" />
                                </span>
                                Troubleshooting Guide
                            </h2>
                            <ul className="space-y-4 ml-2 text-text-secondary">
                                <li className="flex gap-3">
                                    <span className="font-bold text-brand">•</span>
                                    <div><strong className="text-text-primary">The App is Unresponsive:</strong> Try a Hard Refresh (Ctrl+R / Cmd+R) or clear your browser cache.</div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-bold text-brand">•</span>
                                    <div><strong className="text-text-primary">Messages aren't delivering:</strong> This indicates a dropped WebSocket connection. Please refresh or check your firewall.</div>
                                </li>
                            </ul>
                        </section>

                        {/* Contact Support */}
                        <section className="bg-brand/5 border border-brand/20 rounded-xl p-8 text-center mt-8">
                            <HeadphonesIcon className="w-12 h-12 text-brand mx-auto mb-4" />
                            <h2 className="text-2xl font-bold mb-2">Still need help?</h2>
                            <p className="text-text-secondary mb-6">Our support team is ready to assist you within 24-48 business hours.</p>
                            <a href="mailto:support@himate.app" className="inline-block bg-brand hover:bg-brand-dark text-white font-bold py-3 px-8 rounded-xl transition-transform hover:-translate-y-1 shadow-lg">
                                Email Support
                            </a>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportFaqPage;
