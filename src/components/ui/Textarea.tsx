import React, { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="text-sm font-semibold text-text-primary px-1">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={`
                        w-full px-4 py-3 bg-bg-secondary border-2 border-transparent rounded-2xl
                        text-text-primary placeholder:text-text-muted outline-none
                        focus:border-brand/20 focus:ring-4 focus:ring-brand/5 focus:bg-white
                        transition-all duration-200 resize-none
                        ${error ? 'border-error/50 focus:border-error/50 focus:ring-error/5' : ''}
                        ${className}
                    `}
                    {...props}
                />
                {error && (
                    <p className="text-xs text-error font-medium px-1 animate-in fade-in slide-in-from-top-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';
