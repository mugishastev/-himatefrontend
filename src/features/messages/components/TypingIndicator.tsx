import React from 'react';

export const TypingIndicator: React.FC = () => {
    return (
        <div className="flex items-center space-x-1 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-2xl w-fit shadow-sm border border-gray-100 animate-in fade-in duration-300">
            <span className="text-xs text-text-secondary font-medium mr-1">Typing</span>
            <div className="flex space-x-1">
                <div className="w-1 h-1 bg-brand rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1 h-1 bg-brand rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1 h-1 bg-brand rounded-full animate-bounce"></div>
            </div>
        </div>
    );
};
