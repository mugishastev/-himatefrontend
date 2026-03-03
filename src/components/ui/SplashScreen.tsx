import React, { useEffect, useState } from 'react';

export const SplashScreen: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        // Minimum display time for the splash screen
        const timer = setTimeout(() => {
            setIsFading(true);
            setTimeout(() => setIsVisible(false), 500); // Wait for fade out animation
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
            <div className="relative flex flex-col items-center animate-in fade-in zoom-in-95 duration-700 ease-out">
                {/* Logo with pulse effect */}
                <div className="relative w-32 h-32 mb-8">
                    <div className="absolute inset-0 bg-brand/20 rounded-full animate-ping duration-1000"></div>
                    <img
                        src="/logo.png"
                        alt="Himate Logo"
                        className="relative z-10 w-full h-full object-contain"
                    />
                </div>

                {/* Application Name */}
                <h1 className="text-4xl font-black text-brand tracking-tighter mb-2 animate-in slide-in-from-bottom-4 duration-1000 delay-300">
                    Himate
                </h1>

                {/* Tagline */}
                <p className="text-gray-400 font-medium tracking-wide animate-in slide-in-from-bottom-4 duration-1000 delay-500">
                    Stay connected, everywhere.
                </p>
            </div>

            {/* Loading Indicator at bottom */}
            <div className="absolute bottom-12 flex flex-col items-center">
                <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand animate-progress rounded-full"></div>
                </div>
            </div>

            <style>{`
                @keyframes progress {
                    0% { width: 0%; }
                    50% { width: 70%; }
                    100% { width: 100%; }
                }
                .animate-progress {
                    animation: progress 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};
