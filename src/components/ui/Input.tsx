import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
    // Detect if background is white from className to adjust text color automatically
    const isWhiteBg = className.includes('bg-white');
    const textColor = isWhiteBg ? 'text-gray-900 font-medium' : 'text-white';
    const placeholderColor = isWhiteBg ? 'placeholder:text-gray-400' : 'placeholder:text-gray-500';
    const defaultBg = isWhiteBg ? '' : 'bg-[#1F2937] border-[#374151]';

    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label className={`text-sm font-medium ${isWhiteBg ? 'text-gray-700' : 'text-text-secondary'}`}>
                    {label}
                </label>
            )}
            <input
                className={`w-full px-4 py-2.5 rounded-lg outline-none transition-all duration-200 focus:border-brand focus:ring-1 focus:ring-brand hover:border-gray-500 ${defaultBg} ${textColor} ${placeholderColor} cursor-text ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    } ${className}`}
                {...props}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
};
