type TextAreaInputProps = {
    label?: string; // optional
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    className?: string;
    rows?: number;
};

export default function TextAreaInput({
    label,
    placeholder,
    value,
    onChange,
    className,
    rows = 4,
}: TextAreaInputProps) {
    return (
        <div className={`flex flex-col gap-2 w-full ${className}`}>
            {label && (
                <label
                    className="text-input font-medium text-[14px] leading-[20px]"
                    style={{ fontWeight: 500 }}
                >
                    {label}
                </label>
            )}
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                className="border border-gray rounded-[8px] p-3 text-[16px] leading-[24px] text-dark placeholder-[var(--placeholder)] resize-none"
            />
        </div>
    );
}
