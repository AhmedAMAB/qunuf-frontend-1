interface TextInputProps {
    label: string;
    placeholder?: string;
    value?: string;
    type?: string
    className?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TextInput({
    label,
    placeholder,
    value,
    type = 'text',
    className,
    onChange,
}: TextInputProps) {
    return (

        <div className={`flex flex-col gap-2 w-full ${className}`}>
            <label
                className="text-input font-medium text-[14px] leading-[20px]"
                style={{ fontWeight: 500 }}
            >
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="border border-gray rounded-[8px] p-6 h-[44px] text-[16px] leading-[24px] text-dark placeholder-[var(--placeholder)]"
            />
        </div>
    );
}
