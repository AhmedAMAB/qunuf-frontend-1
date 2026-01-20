'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { searchVariants } from '@/lib/variants';
import { LuSearch } from 'react-icons/lu'; // Using Lu icons to match your Lucide style

interface KeywordSearchProps {
    value: string;
    onChange: (val: string) => void;
    searchPlaceholder?: string;
    inputRef?: React.RefObject<HTMLInputElement | null>;
    className?: string;
    variant?: 'default' | 'minimal';
}

export default function KeywordSearch({
    value,
    onChange,
    searchPlaceholder = '...',
    inputRef,
    className,
    variant = 'default' // Default to your current style
}: KeywordSearchProps) {
    const [isFocused, setIsFocused] = useState(false);

    // Style logic for the new minimal header variant
    const isMinimal = variant === 'minimal';

    return (
        <div className={cn(
            "relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200",
            // Variant Logic
            isMinimal
                ? "bg-gray-50/80 border-transparent focus-within:bg-white focus-within:ring-2 focus-within:ring-secondary/20"
                : "border border-gray-100 bg-white shadow-sm focus-within:border-secondary",
            "w-full md:max-w-[320px] animate-in fade-in duration-300",
            isFocused && "scale-[1.01] shadow-md",
            className
        )}>
            <LuSearch
                className={cn(
                    "w-5 h-5 transition-colors duration-150",
                    isFocused ? "text-secondary" : "text-gray-400"
                )}
            />

            <input
                ref={inputRef}
                className="flex-1 w-full bg-transparent text-dark font-medium placeholder:text-gray-400 focus:outline-none text-sm"
                placeholder={searchPlaceholder}
                type="text"
                value={value}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}