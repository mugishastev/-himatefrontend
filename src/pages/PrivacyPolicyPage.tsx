import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Mail, Lock } from 'lucide-react';
import { ROUTES } from '../app/routes.config';

export const PrivacyPolicyPage: React.FC = () => {
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
                        <ShieldCheck className="w-6 h-6 mr-2" />
                        Privacy Policy
                    </div>
                </div>

                {/* Content Container */}
                <div className="bg-bg-primary rounded-2xl shadow-xl p-8 md:p-12 border border-border-light text-text-primary">
                    <h1 className="text-4xl font-black mb-2 text-text-primary tracking-tight">Privacy Policy</h1>
                    <p className="text-text-secondary mb-10 font-medium">Effective Date: March 20, 2026</p>

                    <div className="space-y-10">
                        <section>
                            <h2 className="text-2xl font-bold mb-4 flex items-center border-b border-border-light pb-2">
                                <span className="bg-brand/10 text-brand p-1.5 rounded-lg mr-3">
                                    <ShieldCheck className="w-5 h-5" />
                                </span>
                                1. Information We Collect
                            </h2>
                            <div className="space-y-4 text-text-secondary leading-relaxed ml-2">
                                <div>
                                    <h3 className="font-semibold text-text-primary">A. Personal Data Provided by You</h3>
                                    <ul className="list-disc list-inside mt-2 space-y-1">
                                        <li><strong className="text-text-primary">Account Information:</strong> Name, Username, Email Address, and Password (encrypted).</li>
                                        <li><strong className="text-text-primary">Profile Information:</strong> Profile pictures, statuses, and bio contents.</li>
                                        <li><strong className="text-text-primary">Communication Data:</strong> The content of the messages (text and media files) you send.</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-text-primary">B. Automatically Collected Data</h3>
                                    <ul className="list-disc list-inside mt-2 space-y-1">
                                        <li><strong className="text-text-primary">Device & Connection Info:</strong> IP address, browser type, and device identifiers.</li>
                                        <li><strong className="text-text-primary">Usage Activity:</strong> Audit logs of logins, contact additions, and call history logs (no audio/video recorded).</li>
                                        <li><strong className="text-text-primary">Cookies & Sessions:</strong> We use tokens (JWT) to manage user sessions.</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 flex items-center border-b border-border-light pb-2">
                                <span className="bg-brand/10 text-brand p-1.5 rounded-lg mr-3">
                                    <Lock className="w-5 h-5" />
                                </span>
                                2. Data Security
                            </h2>
                            <p className="text-text-secondary leading-relaxed ml-2 mb-4">
                                We implement industry-standard security measures to protect your data:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-text-secondary ml-2">
                                <li><strong className="text-text-primary">Encryption:</strong> Passwords are hashed using bcrypt. Data is encrypted via TLS/SSL.</li>
                                <li><strong className="text-text-primary">Session Protection:</strong> Short-lived Access Tokens and secure Refresh Tokens.</li>
                                <li><strong className="text-text-primary">Rate Limiting & Helmets:</strong> Strict policies against malicious traffic.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 flex items-center border-b border-border-light pb-2">
                                <span className="bg-brand/10 text-brand p-1.5 rounded-lg mr-3">
                                    <Mail className="w-5 h-5" />
                                </span>
                                Contact Us
                            </h2>
                            <p className="text-text-secondary leading-relaxed ml-2">
                                If you have concerns, contact our Data Protection Officer at:
                                <br />
                                <a href="mailto:privacy@himate.app" className="text-brand font-medium hover:underline mt-2 inline-block">privacy@himate.app</a>
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
