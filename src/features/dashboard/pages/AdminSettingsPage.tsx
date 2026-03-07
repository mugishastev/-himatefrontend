import React, { useState } from 'react';

export const AdminSettingsPage: React.FC = () => {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 800);
    };

    return (
        <div className="p-8 max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
                    <p className="text-slate-400 text-sm mt-1">Configure global platform attributes and policies</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-brand text-white px-4 py-2 rounded-lg font-medium hover:bg-brand/90 transition-colors disabled:opacity-50"
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="space-y-6">
                {/* General Settings */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-6">General Configuration</h2>
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Platform Name</label>
                                <input type="text" defaultValue="Himate" className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Support Email</label>
                                <input type="email" defaultValue="support@himate.com" className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand transition-colors" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Maintenance Message</label>
                            <textarea defaultValue="We'll be right back." className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-brand transition-colors h-24 resize-none" />
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-6">Security & Access</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                            <div>
                                <p className="font-medium text-slate-200">Require User Verification</p>
                                <p className="text-sm text-slate-400">Force new users to verify email before accessing the platform</p>
                            </div>
                            <button className="w-12 h-6 bg-brand rounded-full relative transition-colors cursor-pointer">
                                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-all"></span>
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                            <div>
                                <p className="font-medium text-slate-200">Public Registration</p>
                                <p className="text-sm text-slate-400">Allow anyone to register a new account from the login page</p>
                            </div>
                            <button className="w-12 h-6 bg-brand rounded-full relative transition-colors cursor-pointer">
                                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-all"></span>
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                            <div>
                                <p className="font-medium text-slate-200">Rate Limiting (API)</p>
                                <p className="text-sm text-slate-400">Enable aggressive rate limiting for unauthenticated api calls</p>
                            </div>
                            <button className="w-12 h-6 bg-slate-700 rounded-full relative transition-colors cursor-pointer">
                                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-all"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
