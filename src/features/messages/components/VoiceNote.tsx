import React, { useState, useRef } from 'react';

interface VoiceNoteProps {
    audioUrl: string;
    isOwn: boolean;
}

export const VoiceNote: React.FC<VoiceNoteProps> = ({ audioUrl, isOwn }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className={`flex items-center gap-3 py-2 min-w-[200px] ${isOwn ? 'text-white' : 'text-text-primary'}`}>
            <button
                onClick={togglePlay}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isOwn ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-brand/10 hover:bg-brand/20 text-brand'
                    }`}
            >
                {isPlaying ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                )}
            </button>

            <div className="flex-1 flex flex-col gap-1">
                <div className="relative h-1 bg-current opacity-20 rounded-full overflow-hidden">
                    <div
                        className="absolute inset-y-0 left-0 bg-current transition-all duration-100"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="flex justify-between items-center px-0.5">
                    <div className="flex gap-1 items-end h-3">
                        {[...Array(12)].map((_, i) => {
                            const active = (i / 12) * 100 <= progress;
                            return (
                                <span
                                    key={i}
                                    className={`w-0.5 rounded-full transition-all ${active ? 'bg-current opacity-100' : 'bg-current opacity-30'}`}
                                    style={{ height: `${20 + Math.random() * 80}%` }}
                                />
                            );
                        })}
                    </div>
                    <span className="text-[10px] font-bold opacity-80 tabular-nums">
                        {isPlaying ? formatTime(currentTime) : formatTime(duration || 0)}
                    </span>
                </div>
            </div>

            <audio
                ref={audioRef}
                src={audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
                className="hidden"
            />
        </div>
    );
};
