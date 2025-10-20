'use client';

import React from 'react';

interface KeywordSearchProps {
    value: string;
    onChange: (val: string) => void;
    searchPlaceholder?: string;
    inputRef?: React.RefObject<HTMLInputElement | null>;  // ✅ ref كـ prop عادي
    className?: string
}

export default function KeywordSearch({
    value,
    onChange,
    searchPlaceholder = 'ابحث...',
    inputRef,
    className
}: KeywordSearchProps) {
    return (
        <div className={`flex items-center justify-between rounded-[8px] border border-dark px-3 py-2 w-full  md:max-w-[310px] ${className}`}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#6a7282"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
            </svg>
            <input
                ref={inputRef} // ✅ استخدام ref من prop
                className="flex-1  w-full bg-transparent focus:outline-none ms-[3px]"
                placeholder={searchPlaceholder}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
