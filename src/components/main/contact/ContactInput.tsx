import FormErrorMessage from "@/components/shared/forms/FormErrorMessage";

export default function ContactInput({
    id,
    label,
    // value, // We don't need this manually if using register()
    type = "text",
    wrapperClassName = "",
    required = false,
    error,
    ...props
}: {
    id: string;
    label: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    wrapperClassName?: string;
    error?: string | undefined,
    required?: boolean;
}) {
    return (
        <div className="w-full">
            <div
                className={`relative flex flex-col border-[1px] py-3 px-[20px] transition-all duration-200 ${wrapperClassName} ${error ? 'border-red-500' : 'border-[#E0E0E0] focus-within:border-primary'
                    }`}
            >
                {/* 1. The Input MUST have the "peer" class and a placeholder=" " */}
                <input
                    id={id}
                    type={type}
                    placeholder=" " // CRITICAL: This allows :placeholder-shown to work
                    className="peer focus:outline-0 text-sm font-medium text-primary caret-primary bg-transparent pt-2"
                    {...props}
                />

                {/* 2. The Label uses "peer" selectors to move up */}
                <label
                    htmlFor={id}
                    className={`absolute start-[20px] transition-all duration-200 pointer-events-none 
                        /* Default: Floated position (top) */
                        top-2 text-xs text-primary
                        
                        /* If the placeholder IS SHOWN (meaning input is empty) AND NOT focused, move to middle */
                        peer-placeholder-shown:top-1/2 
                        peer-placeholder-shown:-translate-y-1/2 
                        peer-placeholder-shown:text-sm 
                        peer-placeholder-shown:text-gray-400
                        
                        /* If focused, always move back up (overrides the empty state) */
                        peer-focus:top-2 
                        peer-focus:-translate-y-0 
                        peer-focus:text-xs 
                        peer-focus:text-primary
                    `}
                >
                    {label}
                    {required && <span className="text-red-500"> *</span>}
                </label>
            </div>
            <FormErrorMessage message={error} />
        </div>
    );
}