import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
    // Detect if background is light from className to adjust text color automatically
    const isLightBg = /\b(bg-white|bg-gray-50|bg-slate-50|bg-slate-100|bg-gray-100)\b/.test(className);
    const textColor = isLightBg ? 'text-gray-950 font-medium' : 'text-white';
    const placeholderColor = isLightBg ? 'placeholder:text-gray-500' : 'placeholder:text-gray-400';
    const defaultBg = isLightBg ? '' : 'bg-[#1F2937] border-[#374151]';

    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label className={`text-sm font-medium ${isLightBg ? 'text-gray-700' : 'text-text-secondary'}`}>
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
