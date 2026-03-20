import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, MessageSquare, PhoneCall, Users, Settings } from 'lucide-react';
import { ROUTES } from '../app/routes.config';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const UserGuidePage: React.FC = () => {
    useDocumentTitle('User Guide');
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
                        <BookOpen className="w-6 h-6 mr-2" />
                        User Guide
                    </div>
                </div>

                {/* Content Container */}
                <div className="bg-bg-primary rounded-2xl shadow-xl p-8 md:p-12 border border-border-light text-text-primary">
                    <h1 className="text-4xl font-black mb-4 text-text-primary tracking-tight">Himate - User Guide</h1>
                    <p className="text-text-secondary mb-10 text-lg">Welcome to Himate! This comprehensive guide is designed to help you navigate through the platform and make the most out of our features.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        {/* Cards section for quick navigation look */}
                        <div className="bg-bg-secondary p-6 rounded-2xl flex flex-col items-start border border-border-light/50">
                            <span className="bg-brand/10 text-brand p-3 rounded-xl mb-4"><MessageSquare className="w-6 h-6" /></span>
                            <h3 className="font-bold text-xl mb-2">Conversations</h3>
                            <p className="text-text-secondary text-sm">Start chats, send media, and create groups to connect with others.</p>
                        </div>
                        <div className="bg-bg-secondary p-6 rounded-2xl flex flex-col items-start border border-border-light/50">
                            <span className="bg-[#42b72a]/10 text-[#42b72a] p-3 rounded-xl mb-4"><PhoneCall className="w-6 h-6" /></span>
                            <h3 className="font-bold text-xl mb-2">Voice & Video Calls</h3>
                            <p className="text-text-secondary text-sm">Real-time, low-latency calls straight from your browser.</p>
                        </div>
                        <div className="bg-bg-secondary p-6 rounded-2xl flex flex-col items-start border border-border-light/50">
                            <span className="bg-purple-500/10 text-purple-500 p-3 rounded-xl mb-4"><Users className="w-6 h-6" /></span>
                            <h3 className="font-bold text-xl mb-2">Managing Contacts</h3>
                            <p className="text-text-secondary text-sm">Add friends, view profiles, and manage blocked users easily.</p>
                        </div>
                        <div className="bg-bg-secondary p-6 rounded-2xl flex flex-col items-start border border-border-light/50">
                            <span className="bg-blue-500/10 text-blue-500 p-3 rounded-xl mb-4"><Settings className="w-6 h-6" /></span>
                            <h3 className="font-bold text-xl mb-2">Profile & Settings</h3>
                            <p className="text-text-secondary text-sm">Customize your avatar, statuses, and manage your account security.</p>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <section>
                            <h2 className="text-2xl font-bold mb-4 border-b border-border-light pb-2">Getting Started</h2>
                            <div className="text-text-secondary space-y-4 ml-2">
                                <p><strong className="text-text-primary">Creating an Account:</strong> Navigate to the Landing Page, click Create Account, fill in your details, and enter the OTP sent to your email.</p>
                                <p><strong className="text-text-primary">Dashboard & Navigation:</strong> Your main hub gives you quick access to Chats, Contacts, Calls history, and Settings.</p>
                            </div>
                        </section>
                        
                        <section>
                            <h2 className="text-2xl font-bold mb-4 border-b border-border-light pb-2">Conversations & Messaging</h2>
                            <div className="text-text-secondary space-y-4 ml-2">
                                <p><strong className="text-text-primary">Sending Media:</strong> Himate supports rich media! Click the attachment (+) icon to send images or documents.</p>
                                <p><strong className="text-text-primary">Group Chats:</strong> Click "New Group", add participants, and everyone can collaborate together.</p>
                            </div>
                        </section>

                        <section className="bg-gradient-to-r from-brand to-brand-dark p-8 rounded-2xl text-white mt-12 relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-2xl font-bold mb-2">Ready to start chatting?</h2>
                                <p className="opacity-90 mb-6 max-w-lg">Apply what you've learned and join thousands of others connecting seamlessly around the globe.</p>
                                <Link to={ROUTES.DASHBOARD} className="bg-white text-brand px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all inline-block hover:-translate-y-1">
                                    Go to Dashboard
                                </Link>
                            </div>
                            {/* Decorative blur elements inside the banner */}
                            <div className="absolute right-[-10%] top-[-50%] w-64 h-64 bg-white/20 blur-3xl rounded-full"></div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserGuidePage;
