import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

interface PasswordInputProps {
    label: string;
    placeholder?: string;
    value?: string;
    error?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PasswordInput({
    label,
    placeholder,
    value,
    error,
    onChange,
}: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    const toggleVisibility = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent form submission or blur
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            <label
                className="text-input font-medium text-[14px] leading-[20px]"
                style={{ fontWeight: 500 }}
            >
                {label}
            </label>
            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`hidden-passowrd border ${error ? 'border-red-500' : 'border-gray'} rounded-[8px] p-6 h-[44px] text-[16px] leading-[24px] text-dark placeholder-[var(--placeholder)] w-full pr-12`}
                />
                <button
                    type="button"
                    onMouseDown={toggleVisibility}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[20px] text-[#49475A] focus:outline-none"
                >
                    {showPassword ? <FiEye /> : <FiEyeOff />}
                </button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
}
