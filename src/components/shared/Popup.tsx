'use client';

import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { MdClose } from 'react-icons/md';
import { useOutsideClick } from '@/hooks/useOutsideClick';

interface PopupProps {
    children: React.ReactNode;
    onClose?: () => void;
    show: boolean;
    className?: string;
    headerContent?: React.ReactNode
}

export default function Popup({ children, onClose, show, className, headerContent }: PopupProps) {
    const popupRef = useRef<HTMLDivElement>(null);

    useOutsideClick(popupRef, () => {
        if (show) onClose?.();
    });

    if (typeof document === 'undefined') return null;

    if (!children) return null;
    return createPortal(
        <div
            data-popup
            className={`px-2 popup fixed inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 ${show ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            style={{ zIndex: 100 }}
        >
            <div
                ref={popupRef}
                className={` max-h-[90vh] overflow-y-auto w-fit sm:min-w-[300px]  relative bg-white rounded-xl shadow-lg p-4 md:p-5 lg:p-6  space-y-2 transition-all duration-300 scale-100  ${className}`}
            >
                {/* Close Button */}

                <div className="flex ">
                    <div className='flex-1'>
                        {headerContent}
                    </div>
                    {onClose && (<button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 ms-auto ps-2"
                        aria-label="إغلاق"
                    >
                        <MdClose className="w-5 h-5" />
                    </button>)}
                </div>

                {children}
            </div>
        </div>,
        document.body
    );
}
