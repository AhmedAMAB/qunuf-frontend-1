'use client'
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { useRef, useState } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";
import { cn } from "@/lib/utils";

export type Option = {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    disabled?: boolean;
};

type SelectProps = {
    options: Option[];
    placeholder?: string;
    className?: string;
    dir?: "ltr" | "rtl";
    value?: Option | null;
    triggerClassName?: string;
    dropdownClassName?: string;
    onChange?: (opt: Option) => void;
    openDirection?: "top" | "bottom";
    label?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    searchable?: boolean;
};

export default function SelectInput({
    options,
    className,
    placeholder = "اختر",
    dir = "ltr",
    value,
    triggerClassName = '',
    onChange,
    dropdownClassName = '',
    openDirection = "bottom",
    label,
    error,
    required,
    disabled,
    searchable = false,
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const selectRef = useRef(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useOutsideClick(selectRef, () => {
        setIsOpen(false);
        setSearchQuery("");
    });

    const handleSelect = (opt: Option) => {
        if (opt.disabled) return;
        onChange?.(opt);
        setIsOpen(false);
        setSearchQuery("");
    };

    const handleToggle = () => {
        if (disabled) return;
        const newState = !isOpen;
        setIsOpen(newState);
        if (newState && searchable) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }
    };

    const positionClass = openDirection === "top"
        ? "bottom-full mb-2"
        : "top-full mt-2";

    // Filter options based on search
    const filteredOptions = searchQuery
        ? options.filter(opt =>
            opt.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : options;

    return (
        <div className={cn("flex flex-col gap-2 w-full", className)} {...(dir ? { dir } : {})}>
            {/* Label */}
            {label && (
                <label className="text-input font-semibold text-sm flex items-center gap-1">
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="relative" ref={selectRef}>
                {/* Glow effect on focus */}
                <div className={cn(
                    "absolute -inset-0.5 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-xl opacity-0 blur-sm transition-opacity duration-200",
                    !error && isOpen && "opacity-100"
                )} />

                {/* Trigger Button */}
                <button
                    type="button"
                    onClick={handleToggle}
                    disabled={disabled}
                    className={cn(
                        "relative w-full h-[46px] px-4 rounded-xl text-sm font-medium",
                        "bg-white border-2 transition-all duration-200",
                        "flex items-center justify-between gap-3",
                        "focus:outline-none focus:ring-2 focus:ring-transparent",
                        error
                            ? "border-red-300 bg-red-50/30"
                            : isOpen
                                ? "border-secondary shadow-lg shadow-secondary/10"
                                : "border-gray/20 hover:border-secondary/40",
                        disabled && "bg-gray/5 cursor-not-allowed opacity-60",
                        triggerClassName
                    )}
                >
                    {/* Left side: Icon + Text */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        {value?.icon && (
                            <span className="flex-shrink-0 text-secondary">
                                {value.icon}
                            </span>
                        )}
                        <span className={cn(
                            "truncate text-start rtl:text-end",
                            value ? "text-dark" : "text-placeholder"
                        )}>
                            {value ? value.label : placeholder}
                        </span>
                    </div>

                    {/* Right side: Chevron */}
                    <FiChevronDown
                        className={cn(
                            "w-5 h-5 flex-shrink-0 text-grey-dark transition-transform duration-300",
                            isOpen && "rotate-180 text-secondary"
                        )}
                    />
                </button>

                {/* Dropdown */}
                {isOpen && (
                    <div
                        className={cn(
                            "absolute left-0 right-0 z-100",
                            "bg-dashboard-bg rounded-xl shadow-2xl border-2 border-secondary/20",
                            "overflow-hidden",
                            "animate__animated",
                            openDirection === "top" ? "animate__fadeInUp" : "animate__fadeInDown",
                            positionClass,
                            dropdownClassName
                        )}
                    >
                        {/* Search Input */}
                        {searchable && (
                            <div className="p-3 border-b border-gray/20 bg-lighter/30">
                                <div className="relative">
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search..."
                                        className={cn(
                                            "w-full h-9 px-3 pl-9 rtl:pr-9 rounded-lg text-sm",
                                            "bg-white border border-gray/20",
                                            "focus:outline-none focus:border-secondary/40",
                                            "placeholder:text-placeholder"
                                        )}
                                    />
                                    <svg
                                        className="absolute left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-placeholder"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        )}

                        {/* Options List */}
                        <div className="max-h-[300px] overflow-y-auto py-2 custom-scrollbar">
                            {filteredOptions.length === 0 ? (
                                <div className="px-4 py-8 text-center text-sm text-placeholder">
                                    <svg className="w-12 h-12 mx-auto mb-2 text-gray/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="font-medium">No options found</p>
                                </div>
                            ) : (
                                filteredOptions.map((opt, index) => {
                                    const isSelected = value?.value === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => handleSelect(opt)}
                                            disabled={opt.disabled}
                                            className={cn(
                                                "w-full px-4 py-2.5 text-sm font-medium text-start rtl:text-end",
                                                "flex items-center justify-between gap-3",
                                                "transition-all duration-200",
                                                "animate__animated animate__fadeInUp",
                                                opt.disabled
                                                    ? "opacity-40 cursor-not-allowed"
                                                    : isSelected
                                                        ? "bg-gradient-to-r from-secondary/10 to-primary/10 text-primary border-l-4 border-secondary rtl:border-l-0 rtl:border-r-4"
                                                        : "hover:bg-lighter/50 text-dark"
                                            )}
                                            style={{ animationDelay: `${index * 30}ms` }}
                                        >
                                            {/* Left side: Icon + Label */}
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                {opt.icon && (
                                                    <span className={cn(
                                                        "flex-shrink-0",
                                                        isSelected ? "text-secondary" : "text-grey-dark"
                                                    )}>
                                                        {opt.icon}
                                                    </span>
                                                )}
                                                <span className="truncate">{opt.label}</span>
                                            </div>

                                            {/* Right side: Check icon if selected */}
                                            {isSelected && (
                                                <FiCheck className="w-5 h-5 flex-shrink-0 text-secondary animate__animated animate__bounceIn" />
                                            )}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className={cn(
                    "flex items-center gap-2 text-red-600 text-xs font-medium",
                    "animate__animated animate__shakeX"
                )}>
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}