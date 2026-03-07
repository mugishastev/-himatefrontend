import React, { useEffect } from 'react';
import { useUIStore } from '../../../store/ui.store';

export const ImageViewerModal: React.FC = () => {
    const { viewingImageUrl, closeModal } = useUIStore();

    // Close on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeModal();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [closeModal]);

    if (!viewingImageUrl) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={closeModal}
        >
            {/* Header controls */}
            <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-end px-6 bg-gradient-to-b from-black/50 to-transparent">
                <button
                    onClick={closeModal}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    title="Close (Esc)"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Image container */}
            <div
                className="max-w-[90vw] max-h-[90vh] relative flex items-center justify-center p-4 animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()} // Prevent clicking image from closing modal
            >
                <img
                    src={viewingImageUrl}
                    alt="Viewed image"
                    className="max-w-full max-h-[85vh] object-contain rounded-md shadow-2xl"
                />
            </div>
        </div>
    );
};
