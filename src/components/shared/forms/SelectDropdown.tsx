import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { FiFilter } from 'react-icons/fi';

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

    // إغلاق القائمة عند النقر خارج المكون
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
        <div className={`relative w-full lg:w-[220px] ${className}`} ref={dropdownRef}>
            {/* الزر الرئيسي (Main Select) */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center justify-between w-full h-[45px] px-3 rounded-md 
                    bg-[#F5F6F8] transition-all duration-200
                    border-2 ${isOpen ? 'border-secondary shadow-sm' : 'border-[#E5E7EB]'}
                `}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    {/* النص المختار أو الـ Placeholder */}
                    <span className={`truncate text-[14px] ${selectedOption ? 'text-dark font-medium' : 'text-placeholder font-normal'}`}>
                        {selectedOption ? selectedOption.label : label}
                    </span>
                </div>

                <FaChevronDown
                    className={`text-gray-400 text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* القائمة المنسدلة (Dropdown Menu) */}
            {isOpen && (
                <ul className="absolute z-50 w-full mt-2 bg-white border border-[#E5E7EB] rounded-md shadow-xl max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                    {options.map((option) => (
                        <li
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`
                                px-4 py-2.5 text-[14px] cursor-pointer transition-colors
                                flex items-center justify-between
                                ${option.value === value ? 'bg-secondary/10 text-secondary font-bold' : 'text-dark hover:bg-gray-50'}
                            `}
                        >
                            {option.label}
                            {option.value === value && (
                                <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}