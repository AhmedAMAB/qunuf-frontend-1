'use client'
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";



export type Option = {
    label: string;
    value: string;
};

type SelectProps = {
    options: Option[];
    placeholder?: string;
    className?: string;
    dir?: "ltr" | "rtl";
    value?: Option | null;
    triggerClassName?: string;
    onChange?: (opt: Option) => void;
};

export default function SelectInput({
    options,
    className,
    placeholder = "اختر",
    dir = "ltr",
    value,
    triggerClassName = '',
    onChange,
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null)
    useOutsideClick(selectRef, () => setIsOpen(false))

    const handleSelect = (opt: Option) => {
        onChange?.(opt);
        setIsOpen(false);
    };

    return (
        <div className={`relative w-fit ${className}`} {...(dir ? { dir } : {})} ref={selectRef}>
            {/* Trigger */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between rounded-md  py-[14px] px-4 gap-2 cursor-pointer  bg-[#F6F6F6] ${triggerClassName}`}
            >
                {/* Text */}
                <span className="font-normal text-[16px] leading-[20px] text-dark">
                    {value ? value.label : placeholder}
                </span>

                {/* Icon */}
                <FiChevronDown
                    className={`w-[16px] h-[16px] transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-md shadow-lg z-10 overflow-y-auto max-h-[400px]">
                    {options.map((opt) => (
                        <div
                            key={opt.value}
                            onClick={() => handleSelect(opt)}
                            className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
