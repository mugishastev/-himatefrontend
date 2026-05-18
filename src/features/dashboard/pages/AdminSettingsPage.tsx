import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../api/admin.api';

export const AdminSettingsPage: React.FC = () => {
    const [isSaving, setIsSaving] = useState(false);
    const [health, setHealth] = useState<any>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);
    
    // Core setting states loaded from database/Redis
    const [settings, setSettings] = useState<any>({
        platform_name: 'Himate',
        support_email: 'support@himate.com',
        maintenance_message: "We'll be right back.",
        maintenance_mode: 'false',
        require_verification: 'true',
        public_registration: 'true',
        rate_limiting: '0',
    });

    useEffect(() => {
        // Load initial settings and health checks
        adminApi.getSettings().then(setSettings).catch(console.error);
        adminApi.getHealth().then(setHealth).catch(() => setHealth(null));
    }, []);

    const handleTextChange = (key: string, value: string) => {
        setSettings((prev: any) => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSaveGeneral = async () => {
        setIsSaving(true);
        setSaveSuccess(false);
        try {
            await adminApi.updateSetting('platform_name', settings.platform_name);
            await adminApi.updateSetting('support_email', settings.support_email);
            await adminApi.updateSetting('maintenance_message', settings.maintenance_message);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error('Failed to save general configurations', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggle = async (key: string) => {
        const currentValue = settings[key];
        const newValue = currentValue === 'true' ? 'false' : 'true';

        // Optimistic UI update
        setSettings((prev: any) => ({
            ...prev,
            [key]: newValue
        }));

        try {
            await adminApi.updateSetting(key, newValue);
        } catch (error) {
            console.error(`Failed to toggle setting ${key}`, error);
            // Revert state on failure
            setSettings((prev: any) => ({
                ...prev,
                [key]: currentValue
            }));
        }
    };

    const rateLimitNum = settings.rate_limiting === 'false' ? 0 : settings.rate_limiting === 'true' ? 60 : parseInt(settings.rate_limiting || '0', 10);

    return (
        <div className="p-4 sm:p-8 max-w-4xl flex flex-col h-full overflow-y-auto no-scrollbar">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Platform Settings
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Configure global Himate platform attributes, security rules, and server policies.</p>
                </div>
                <div className="flex items-center gap-3">
                    {saveSuccess && (
                        <span className="text-xs font-semibold px-3 py-1.5 rounded-lg border text-emerald-400 border-emerald-500/20 bg-emerald-500/10 animate-fade-in">
                            Settings saved successfully!
                        </span>
                    )}
                    <button
                        onClick={handleSaveGeneral}
                        disabled={isSaving}
                        className="bg-brand hover:bg-brand/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 shadow-lg shadow-brand/20"
                    >
                        {isSaving ? 'Saving...' : 'Save General Config'}
                    </button>
                </div>
            </div>

            <div className="space-y-6 flex-1 min-h-0">
                {/* System Health */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        System Health Status
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        {[
                            { label: 'Neon Database', ok: health?.database?.ok },
                            { label: 'Redis Cache & Limiter', ok: health?.redis?.ok },
                            { label: 'Firebase Cloud Messaging', ok: health?.firebase?.configured },
                        ].map((item) => (
                            <div key={item.label} className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex items-center justify-between">
                                <span className="text-slate-400 font-medium">{item.label}</span>
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${item.ok ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' : 'text-red-400 border-red-500/20 bg-red-500/10'}`}>
                                    {item.ok ? 'ONLINE' : 'DEGRADED'}
                                </span>
                            </div>
                        ))}
                    </div>
                    {health?.timestamp && (
                        <p className="text-[10px] text-slate-500 mt-3 font-mono">Last full system check: {new Date(health.timestamp).toLocaleString()}</p>
                    )}
                </div>

                {/* General Settings */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-6">General Brand Configuration</h2>
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Platform Name</label>
                                <input 
                                    type="text" 
                                    value={settings.platform_name || ''} 
                                    onChange={(e) => handleTextChange('platform_name', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-850 text-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors font-medium text-sm" 
                                    id="platform_name_input"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Support Email</label>
                                <input 
                                    type="email" 
                                    value={settings.support_email || ''} 
                                    onChange={(e) => handleTextChange('support_email', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-850 text-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors font-medium text-sm" 
                                    id="support_email_input"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">Maintenance Message</label>
                            <textarea 
                                value={settings.maintenance_message || ''} 
                                onChange={(e) => handleTextChange('maintenance_message', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-850 text-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors h-24 resize-none font-medium text-sm" 
                                id="maintenance_message_input"
                            />
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-6">Security, Routing & Policies</h2>
                    <div className="space-y-4">
                        {/* Maintenance Mode Toggle */}
                        <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-850 rounded-xl hover:border-slate-750 transition-colors">
                            <div className="pr-4">
                                <p className="font-semibold text-slate-200 flex items-center gap-1.5">
                                    System Maintenance Mode
                                    {settings.maintenance_mode === 'true' && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>}
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">Route all non-administrator routes immediately to the maintenance screen.</p>
                            </div>
                            <button 
                                onClick={() => handleToggle('maintenance_mode')}
                                className={`w-12 h-6 rounded-full relative transition-colors duration-200 cursor-pointer ${settings.maintenance_mode === 'true' ? 'bg-amber-600' : 'bg-slate-800'}`}
                                id="maintenance_mode_toggle"
                            >
                                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${settings.maintenance_mode === 'true' ? 'right-1' : 'left-1'}`}></span>
                            </button>
                        </div>

                        {/* User Verification Toggle */}
                        <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-850 rounded-xl hover:border-slate-750 transition-colors">
                            <div className="pr-4">
                                <p className="font-semibold text-slate-200">Require User Verification</p>
                                <p className="text-xs text-slate-400 mt-0.5">Force new users to verify their email before they can successfully complete login.</p>
                            </div>
                            <button 
                                onClick={() => handleToggle('require_verification')}
                                className={`w-12 h-6 rounded-full relative transition-colors duration-200 cursor-pointer ${settings.require_verification === 'true' ? 'bg-brand' : 'bg-slate-800'}`}
                                id="require_verification_toggle"
                            >
                                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${settings.require_verification === 'true' ? 'right-1' : 'left-1'}`}></span>
                            </button>
                        </div>

                        {/* Public Registration Toggle */}
                        <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-850 rounded-xl hover:border-slate-750 transition-colors">
                            <div className="pr-4">
                                <p className="font-semibold text-slate-200">Public Registration</p>
                                <p className="text-xs text-slate-400 mt-0.5">Control access to the /register endpoint. If disabled, new signups are blocked.</p>
                            </div>
                            <button 
                                onClick={() => handleToggle('public_registration')}
                                className={`w-12 h-6 rounded-full relative transition-colors duration-200 cursor-pointer ${settings.public_registration === 'true' ? 'bg-brand' : 'bg-slate-800'}`}
                                id="public_registration_toggle"
                            >
                                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${settings.public_registration === 'true' ? 'right-1' : 'left-1'}`}></span>
                            </button>
                        </div>

                        {/* Rate Limiting Adjustable Slider */}
                        <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl hover:border-slate-750 transition-colors space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="pr-4">
                                    <p className="font-semibold text-slate-200">Global API Rate Limiting</p>
                                    <p className="text-xs text-slate-400 mt-0.5">Throttle unauthenticated traffic through the system Redis limiter directly.</p>
                                </div>
                                <span className="text-sm font-bold text-brand bg-brand/10 border border-brand/20 px-3 py-1 rounded-lg">
                                    {rateLimitNum === 0 ? 'Disabled' : `${rateLimitNum} req/min`}
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-slate-500 font-semibold">Off</span>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="200" 
                                    step="10"
                                    value={rateLimitNum} 
                                    onChange={async (e) => {
                                        const val = e.target.value;
                                        setSettings((prev: any) => ({ ...prev, rate_limiting: val }));
                                        try {
                                            await adminApi.updateSetting('rate_limiting', val);
                                        } catch (error) {
                                            console.error('Failed to update rate limit setting', error);
                                        }
                                    }}
                                    className="flex-1 accent-brand bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                                    id="rate_limiting_slider"
                                />
                                <span className="text-xs text-slate-500 font-semibold">200 req/min</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
