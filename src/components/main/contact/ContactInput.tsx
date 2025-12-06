import FormErrorMessage from "@/components/shared/forms/FormErrorMessage";
import { useState } from "react";

export default function ContactInput({
    id,
    label,
    value,
    onChange,
    type = "text",
    wrapperClassName = "",
    required = false,
    error,
    ...props
}: {
    id: string;
    label: string;
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    wrapperClassName?: string;
    error?: string | undefined,
    required?: boolean;
}) {
    const [focused, setFocused] = useState(false);

    return (
        <div>
            <div
                className={`relative flex flex-col border-[1px]  ${error ? 'border-red-500' : 'border-[#E0E0E0]'} py-3 px-[20px] ${wrapperClassName}`}
            >
                {/* Floating label */}
                <label
                    htmlFor={id}
                    className={`absolute start-[20px] top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none
          ${focused || value ? "top-2 text-xs text-primary" : ""}
        `}
                >
                    {label}
                    {required && <span className="text-red-500"> *</span>}
                </label>

                {/* Input */}
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    required={required}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className="focus:outline-0 text-sm font-medium text-primary caret-primary bg-transparent"
                    {...props}
                />

            </div>
            <FormErrorMessage message={error} />
        </div>
    );
}
