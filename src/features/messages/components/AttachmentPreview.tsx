import React from 'react';
import { formatFileSize } from '../../../utils/formatters';

interface AttachmentPreviewProps {
    file: File;
    onRemove: () => void;
}

export const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({ file, onRemove }) => {
    const isImage = file.type.startsWith('image/');

    return (
        <div className="relative group p-2 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center space-x-3 w-64">
            <div className="w-12 h-12 rounded-lg bg-brand/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                {isImage ? (
                    <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                )}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-primary truncate">{file.name}</p>
                <p className="text-[10px] text-text-secondary">{formatFileSize(file.size)}</p>
            </div>
            <button
                onClick={onRemove}
                className="p-1 hover:bg-bg-secondary rounded-full text-text-muted hover:text-error transition-colors"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};
