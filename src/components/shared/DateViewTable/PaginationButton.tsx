'use client';

import React from 'react';

interface PaginationButtonProps {
    label: string;
    icon?: React.ReactNode;
    currentPage: number;
    isDisabled: boolean,
    onPageChange: () => void;
    iconPosition?: 'left' | 'right'
}

export default function PaginationButton({
    label,
    icon,
    isDisabled,
    onPageChange,
    iconPosition = 'left'
}: PaginationButtonProps) {

    return (
        <button
            onClick={() => onPageChange()}
            disabled={isDisabled}
            className={`border border-dark flex items-center  justify-center gap-1 text-dark px-2 py-[6px] lg:px-3 lg:py-2 text-sm  lg:text-base  rounded-[8px] duration-300  ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray'
                }`}
        >
            {iconPosition === 'left' ? (
                <>
                    {icon}
                    <span>{label}</span>
                </>
            ) : (
                <>
                    <span>{label}</span>
                    {icon}
                </>
            )}

        </button >
    );
}
