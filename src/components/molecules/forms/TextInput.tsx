import FormErrorMessage from "./FormErrorMessage";
import { cn } from "@/lib/utils";

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
    suffix?: React.ReactNode;
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
        <div className={cn("flex flex-col gap-2 w-full", className)}>
            {label && (
                <label className="text-input font-semibold text-sm flex items-center gap-1">
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="relative w-full group/row">
                {/* Glow effect on focus */}
                <div className={cn(
                    "absolute -inset-0.5 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-xl opacity-0 blur-sm transition-opacity duration-200",
                    !error && "group-focus-within/row:opacity-100"
                )} />

                <input
                    {...props}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    readOnly={readonly}
                    disabled={disabled}
                    required={required}
                    className={cn(
                        "relative w-full h-[46px] px-4 rounded-xl text-sm font-medium",
                        "bg-white border-2 transition-all duration-200",
                        "text-dark placeholder:text-placeholder",
                        "focus:outline-none focus:ring-2 focus:ring-transparent",
                        error
                            ? "border-red-300  focus:border-red-400"
                            : "border-gray/20 hover:border-secondary/40 focus:border-secondary",
                        disabled && "bg-gray/5 cursor-not-allowed opacity-60",
                        readonly && "bg-gray/5 cursor-default",
                        suffix && ('rtl:pl-16 ltr:pr-16')
                    )}
                />

                {suffix && (
                    <div className={cn(
                        "absolute inset-y-0 flex items-center px-4 pointer-events-none",
                        "border-s border-gray/15 text-dark/60 font-semibold text-sm",
                        "ltr:right-0 rtl:left-0"
                    )}>
                        {suffix}
                    </div>
                )}
            </div>

            <FormErrorMessage message={error} />
        </div>
    );
}