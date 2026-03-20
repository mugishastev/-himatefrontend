import React, { useState, useRef } from 'react';

export const WALLPAPER_STORAGE_KEY = 'himate_chat_wallpaper';

export type WallpaperOption = {
    id: string;
    label: string;
    style: React.CSSProperties;
    preview: string; // CSS bg shorthand for the tiny swatch
};

export const WALLPAPER_OPTIONS: WallpaperOption[] = [
    // ── Dark (default) ────────────────────────────────────────
    {
        id: 'dark-default',
        label: 'Dark',
        style: { backgroundColor: '#0b141a' },
        preview: '#0b141a',
    },
    {
        id: 'dark-slate',
        label: 'Slate',
        style: { backgroundColor: '#1e293b' },
        preview: '#1e293b',
    },
    {
        id: 'dark-charcoal',
        label: 'Charcoal',
        style: { backgroundColor: '#1a1a2e' },
        preview: '#1a1a2e',
    },
    // ── Gradients ────────────────────────────────────────────
    {
        id: 'grad-midnight',
        label: 'Midnight',
        style: { background: 'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)' },
        preview: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)',
    },
    {
        id: 'grad-ocean',
        label: 'Ocean',
        style: { background: 'linear-gradient(135deg,#005c97 0%,#363795 100%)' },
        preview: 'linear-gradient(135deg,#005c97,#363795)',
    },
    {
        id: 'grad-aurora',
        label: 'Aurora',
        style: { background: 'linear-gradient(135deg,#00b4db 0%,#0083b0 50%,#005c97 100%)' },
        preview: 'linear-gradient(135deg,#00b4db,#0083b0)',
    },
    {
        id: 'grad-forest',
        label: 'Forest',
        style: { background: 'linear-gradient(135deg,#134e5e 0%,#71b280 100%)' },
        preview: 'linear-gradient(135deg,#134e5e,#71b280)',
    },
    {
        id: 'grad-dusk',
        label: 'Dusk',
        style: { background: 'linear-gradient(135deg,#373b44 0%,#4286f4 100%)' },
        preview: 'linear-gradient(135deg,#373b44,#4286f4)',
    },
    {
        id: 'grad-rose',
        label: 'Rose',
        style: { background: 'linear-gradient(135deg,#ee9ca7 0%,#ffdde1 100%)' },
        preview: 'linear-gradient(135deg,#ee9ca7,#ffdde1)',
    },
    {
        id: 'grad-peach',
        label: 'Peach',
        style: { background: 'linear-gradient(135deg,#f7971e 0%,#ffd200 100%)' },
        preview: 'linear-gradient(135deg,#f7971e,#ffd200)',
    },
    {
        id: 'grad-purple',
        label: 'Purple',
        style: { background: 'linear-gradient(135deg,#8e2de2 0%,#4a00e0 100%)' },
        preview: 'linear-gradient(135deg,#8e2de2,#4a00e0)',
    },
    // ── Patterns ─────────────────────────────────────────────
    {
        id: 'pattern-dots',
        label: 'Dots',
        style: {
            backgroundColor: '#0d1821',
            backgroundImage: 'radial-gradient(circle, #ffffff18 1px, transparent 1px)',
            backgroundSize: '24px 24px',
        },
        preview: '#0d1821',
    },
    {
        id: 'pattern-grid',
        label: 'Grid',
        style: {
            backgroundColor: '#111827',
            backgroundImage:
                'linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px)',
            backgroundSize: '30px 30px',
        },
        preview: '#111827',
    },
    {
        id: 'pattern-whatsapp',
        label: 'Classic',
        style: { backgroundColor: '#efeae2' },
        preview: '#efeae2',
    },
    {
        id: 'pattern-light',
        label: 'Light',
        style: { backgroundColor: '#f0f4fa' },
        preview: '#f0f4fa',
    },
];

interface Props {
    onClose: () => void;
    onSelect: (wallpaper: { id: string; style: React.CSSProperties }) => void;
    currentId: string;
}

export const WallpaperPicker: React.FC<Props> = ({ onClose, onSelect, currentId }) => {
    const [hovered, setHovered] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleCustomImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        onSelect({
            id: 'custom',
            style: {
                backgroundImage: `url(${url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            },
        });
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-[#111b21] rounded-2xl shadow-2xl border border-[#2a3942] w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a3942]">
                    <div>
                        <h2 className="text-[#d1d7db] text-lg font-semibold">Chat Wallpaper</h2>
                        <p className="text-[#8696a0] text-[13px] mt-0.5">Choose a background for your chat</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 text-[#aebac1] transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Swatches */}
                <div className="overflow-y-auto flex-1 p-5">
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                        {WALLPAPER_OPTIONS.map(w => (
                            <button
                                key={w.id}
                                title={w.label}
                                onMouseEnter={() => setHovered(w.id)}
                                onMouseLeave={() => setHovered(null)}
                                onClick={() => { onSelect({ id: w.id, style: w.style }); onClose(); }}
                                className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-150 ring-2 ${currentId === w.id ? 'ring-[#00a884] scale-105' : 'ring-transparent hover:scale-105'}`}
                                style={{ background: w.preview }}
                            >
                                {currentId === w.id && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                        <div className="w-6 h-6 rounded-full bg-[#00a884] flex items-center justify-center">
                                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                                {(hovered === w.id && currentId !== w.id) && (
                                    <div className="absolute inset-x-0 bottom-0 py-1 bg-black/50 text-white text-[10px] text-center truncate font-medium">
                                        {w.label}
                                    </div>
                                )}
                            </button>
                        ))}

                        {/* Custom image upload tile */}
                        <button
                            title="Upload custom image"
                            onClick={() => fileRef.current?.click()}
                            className={`aspect-square rounded-xl border-2 border-dashed border-[#2a3942] flex flex-col items-center justify-center gap-1 hover:border-[#00a884] hover:text-[#00a884] text-[#8696a0] transition-all hover:scale-105 ${currentId === 'custom' ? 'border-[#00a884] text-[#00a884]' : ''}`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-[9px] font-medium uppercase tracking-wide leading-tight text-center">Custom</span>
                        </button>
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleCustomImage} />
                    </div>
                </div>
            </div>
        </div>
    );
};
