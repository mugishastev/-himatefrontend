import React, { useState, useRef, useEffect } from 'react';
import { Card } from './Card';

interface DropdownProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    align?: 'left' | 'right';
}

export const Dropdown: React.FC<DropdownProps> = ({ trigger, children, align = 'left' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
                {trigger}
            </div>
            {isOpen && (
                <div className={`absolute z-50 mt-2 w-48 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200 ${align === 'right' ? 'right-0' : 'left-0'}`}>
                    <Card className="p-2 border border-gray-100 overflow-hidden">
                        {children}
                    </Card>
                </div>
            )}
        </div>
    );
};
