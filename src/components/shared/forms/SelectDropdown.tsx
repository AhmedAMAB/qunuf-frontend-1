import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { IoCheckmark } from 'react-icons/io5';
import { cn } from '@/lib/utils';

interface Option {
    label: string;
    value: string;
}

interface SelectDropdownProps {
    label: string;
    options: Option[];
    value?: string;
    onChange: (value: string | undefined) => void;
    className?: string;
}

export default function SelectDropdown({
    label,
    options,
    value,
    onChange,
    className = "",
}: SelectDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={cn("relative w-full lg:w-[220px]", className)} ref={dropdownRef}>
            {/* Main Select Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "group relative flex items-center justify-between w-full h-[45px] px-4 rounded-xl",
                    "bg-white border-2 transition-all duration-200",
                    "hover:shadow-sm active:scale-[0.98]",
                    isOpen
                        ? "border-secondary shadow-sm ring-2 ring-secondary/20"
                        : "border-gray/20 hover:border-secondary/50"
                )}
            >
                {/* Hover glow effect */}
                <div className={cn(
                    "absolute -inset-0.5 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-xl blur-sm",
                    "opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"
                )} />

                {/* Selected text or placeholder */}
                <span className={cn(
                    "truncate text-sm font-medium transition-colors duration-200",
                    selectedOption
                        ? "text-dark"
                        : "text-placeholder"
                )}>
                    {selectedOption ? selectedOption.label : label}
                </span>

                {/* Chevron icon */}
                <FaChevronDown
                    className={cn(
                        "text-secondary/60 text-xs transition-all duration-200",
                        "group-hover:text-secondary",
                        isOpen && "rotate-180 text-secondary"
                    )}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray/20 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-60 overflow-y-auto thin-scrollbar">
                        {options.map((option, index) => {
                            const isSelected = option.value === value;
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full px-4 py-3 text-sm font-medium text-left",
                                        "flex items-center justify-between gap-2",
                                        "transition-all duration-150",
                                        "first:rounded-t-xl last:rounded-b-xl",
                                        isSelected
                                            ? "bg-gradient-to-r from-secondary/15 to-primary/15 text-primary"
                                            : "text-dark hover:bg-gradient-to-r hover:from-secondary/5 hover:to-primary/5"
                                    )}
                                    style={{
                                        animationDelay: `${index * 30}ms`,
                                        animation: 'slideInFromLeft 0.2s ease-out forwards',
                                    }}
                                >
                                    <span className="truncate">{option.label}</span>

                                    {isSelected && (
                                        <IoCheckmark
                                            className="text-primary shrink-0 animate-in zoom-in duration-200"
                                            size={18}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

// Add to your global CSS or Tailwind config:
// @keyframes slideInFromLeft {
//   from { opacity: 0; transform: translateX(-10px); }
//   to { opacity: 1; transform: translateX(0); }
// }