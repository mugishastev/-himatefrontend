import React from 'react';

interface AvatarProps {
    src?: string;
    alt?: string;
    fallback: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, fallback, size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-16 h-16 text-xl',
        xl: 'w-24 h-24 text-3xl',
    };

    return (
        <div className={`${sizeClasses[size]} rounded-full bg-brand/10 flex items-center justify-center font-bold text-brand overflow-hidden flex-shrink-0 ${className}`}>
            {src ? (
                <img src={src} alt={alt} className="w-full h-full object-cover" />
            ) : (
                fallback.charAt(0).toUpperCase()
            )}
        </div>
    );
};
