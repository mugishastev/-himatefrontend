import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label className="text-sm font-medium text-text-secondary">
                    {label}
                </label>
            )}
            <input
                className={`w-full px-4 py-2.5 bg-[#1F2937] border border-[#374151] rounded-lg outline-none transition-all duration-200 focus:border-brand focus:ring-1 focus:ring-brand hover:border-gray-500 text-white placeholder:text-gray-500 cursor-text ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    } ${className}`}
                {...props}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
};
