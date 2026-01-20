import { useEffect, useState } from 'react';
import SelectInput, { Option } from './SelectInput';
import FormErrorMessage from './FormErrorMessage';

type SelectFieldProps = {
    label: string;
    options: Option[];
    placeholder?: string;
    value?: Option | null;
    onChange?: (opt: Option) => void;
    className?: string;
    triggerClassName?: string;
    dropdownClassName?: string;
    error?: string;
};

export default function SelectField({
    label,
    options,
    placeholder = 'Select',
    value,
    onChange,
    className,
    triggerClassName,
    dropdownClassName,
    error
}: SelectFieldProps) {
    const [internalValue, setInternalValue] = useState<Option | null>(value ?? null);

    const handleChange = (opt: Option) => {
        setInternalValue(opt);
        onChange?.(opt);
    };

    useEffect(() => {
        setInternalValue(value)
    }, [value])

    return (
        <div className={`flex flex-col gap-2 ${className ?? ''}`}>
            <label
                className="text-input font-medium text-[14px] leading-[20px]"
                style={{ fontWeight: 500 }}
            >
                {label}
            </label>
            <SelectInput
                options={options}
                placeholder={placeholder}
                className="border border-gray w-full rounded-[8px]"
                triggerClassName={`bg-white rounded-[8px] ${triggerClassName ?? ''}`}
                value={internalValue}
                onChange={handleChange}
                dropdownClassName={dropdownClassName}
            />
            <FormErrorMessage message={error} />
        </div>
    );
}
