import React, { useState } from 'react';
import { pagesApi } from '../../../api/pages.api';
import { useUIStore } from '../../../store/ui.store';

export const CreatePageModal: React.FC = () => {
    const { closeModal, setView } = useUIStore();
    const [name, setName] = useState('');
    const [handle, setHandle] = useState('');
    const [category, setCategory] = useState('BRAND');
    const [bio, setBio] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await pagesApi.createPage({ name, handle, category, bio });
            closeModal();
            setView('CREATOR_STUDIO');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create page');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#202c33] rounded-3xl w-full max-w-lg shadow-2xl p-8 transform transition-all border border-[#2a3942]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-[#e9edef]">Create a Page</h2>
                    <button onClick={closeModal} className="text-[#8696a0] hover:text-red-500 rounded-full p-1 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <p className="text-[#8696a0] mb-6 text-sm">
                    Build a verified profile to broadcast blogs to your fans and manage customer support directly in Himate.
                </p>

                {error && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-xl text-sm font-medium">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-[#e9edef] mb-1">Page Name</label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. Nike Support"
                            className="w-full p-3 bg-[#111b21] rounded-xl border border-[#2a3942] text-[#e9edef] focus:outline-none focus:ring-2 focus:ring-[#F97316] font-medium placeholder:font-normal placeholder:text-[#8696a0]"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-[#e9edef] mb-1">Handle</label>
                        <div className="flex items-center">
                            <span className="p-3 bg-[#182229] border border-[#2a3942] border-r-0 rounded-l-xl text-[#8696a0] font-bold">@</span>
                            <input
                                required
                                type="text"
                                placeholder="nikesupport"
                                className="w-full p-3 bg-[#111b21] rounded-r-xl border border-[#2a3942] text-[#e9edef] focus:outline-none focus:ring-2 focus:ring-[#F97316] font-medium placeholder:font-normal placeholder:text-[#8696a0]"
                                value={handle}
                                onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#e9edef] mb-1">Category</label>
                        <select
                            className="w-full p-3 bg-[#111b21] rounded-xl border border-[#2a3942] text-[#e9edef] focus:outline-none focus:ring-2 focus:ring-[#F97316] font-medium"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="BRAND">Brand / Business</option>
                            <option value="PUBLIC_FIGURE">Public Figure / Influencer</option>
                            <option value="ENTERTAINMENT">Entertainment</option>
                            <option value="COMMUNITY">Community / Local</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#e9edef] mb-1">Short Bio</label>
                        <textarea
                            placeholder="Tell the world what your page is about..."
                            className="w-full p-3 bg-[#111b21] rounded-xl border border-[#2a3942] text-[#e9edef] focus:outline-none focus:ring-2 focus:ring-[#F97316] font-medium placeholder:font-normal placeholder:text-[#8696a0]"
                            rows={3}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#F97316] text-[#111b21] font-bold p-4 rounded-xl hover:bg-[#EA6C0A] transition-colors disabled:opacity-50 mt-4 shadow-lg shadow-[#F97316]/20"
                    >
                        {loading ? 'Registering...' : 'Create Verified Page'}
                    </button>
                </form>
            </div>
        </div>
    );
};
