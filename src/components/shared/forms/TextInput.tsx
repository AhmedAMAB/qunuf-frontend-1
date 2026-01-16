import FormErrorMessage from "./FormErrorMessage";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    placeholder?: string;
    value?: string | number;
    type?: string;
    className?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    suffix?: React.ReactNode; // Can be text or an icon
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TextInput({
    label,
    placeholder,
    value,
    className,
    onChange,
    error,
    required,
    disabled,
    readonly,
    suffix,
    type = "text",
    ...props
}: TextInputProps) {
    return (
        <div className={`flex flex-col gap-2 w-full ${className}`}>
            {label && <label
                className="text-input font-medium text-[14px] leading-[20px]"
                style={{ fontWeight: 500 }}
            >
                {label}
            </label>
            }
            <div className="relative w-full">
                <input
                    {...props}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    readOnly={readonly}
                    disabled={disabled}
                    required={required}
                    className={`w-full border ${error ? 'border-red-500' : 'border-gray'
                        } rounded-[8px] p-6 h-[44px] text-[16px] leading-[24px] text-dark placeholder-[var(--placeholder)] ${suffix ? (document.dir === 'rtl' ? 'pl-12' : 'pr-12') : ''
                        }`}
                />

                {suffix && (
                    <div className="absolute inset-y-0 flex items-center px-4 text-gray-400 pointer-events-none 
                        ltr:right-0 rtl:left-0 border-s border-gray-100 my-2">
                        <span className="text-[14px] font-medium">
                            {suffix}
                        </span>
                    </div>
                )}
            </div>

            <FormErrorMessage message={error} />
        </div>
    );
}