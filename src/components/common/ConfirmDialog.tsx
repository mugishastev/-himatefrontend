import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'primary' | 'error';
    isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'primary',
    isLoading = false,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-6">
                <p className="text-text-secondary leading-relaxed">
                    {message}
                </p>
                <div className="flex space-x-3 pt-2">
                    <Button
                        variant="ghost"
                        className="flex-1"
                        onClick={onClose}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        variant={variant === 'error' ? 'ghost' : 'primary'}
                        className={`flex-1 ${variant === 'error' ? 'text-error hover:bg-error/10' : ''}`}
                        onClick={onConfirm}
                        isLoading={isLoading}
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
