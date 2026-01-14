import { Control, Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useState, KeyboardEvent, useMemo } from "react";
import { MdClose } from "react-icons/md";
import FormErrorMessage from "@/components/shared/forms/FormErrorMessage";

interface Props {
    control: Control<any>;
    name: string;
    label?: string;
    placeholder?: string;
    errors: any
}

export function FeaturesTagsInput({ control, name, label, placeholder, errors }: Props) {
    const t = useTranslations("dashboard.properties.form");
    const [inputValue, setInputValue] = useState("");

    const errorMessage = useMemo(() => {
        // Access the specific error for this field name (e.g., 'features')
        const fieldError = errors?.[name];

        if (!fieldError) return null;

        // 1. If it's a direct error on the array itself (e.g., .max(30))
        if (fieldError.message) {
            return fieldError.message;
        }

        // 2. If it's an error on specific items within the array (e.g., .string().max(50))
        // React Hook Form provides an array/object of errors for field arrays
        if (typeof fieldError === 'object') {
            // Find the first nested error that has a message
            const nestedErrors = Object.values(fieldError);
            const firstError = nestedErrors.find((e: any) => e?.message) as any;
            return firstError?.message || null;
        }

        return null;
    }, [errors, name]);
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { value = [], onChange }, fieldState: { error } }) => {

                const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const trimmed = inputValue.trim();

                        // Validation: Not empty, not duplicate, max length 50
                        if (trimmed && !value.includes(trimmed) && trimmed.length <= 50) {
                            onChange([...value, trimmed]);
                            setInputValue("");
                        }
                    }
                };

                const removeTag = (tagToRemove: string) => {
                    onChange(value.filter((tag: string) => tag !== tagToRemove));
                };

                return (
                    <div className="space-y-2 w-full">
                        {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}

                        <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md bg-white min-h-[50px]">
                            {/* Render Tags */}
                            {value.map((tag: string, index: number) => (
                                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary/10 text-secondary">
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="ml-2 text-secondary hover:text-secondary-hover focus:outline-none"
                                    >
                                        <MdClose />
                                    </button>
                                </span>
                            ))}

                            {/* Input Field */}
                            <input
                                type="text"
                                className="flex-1 outline-none min-w-[120px] bg-transparent text-sm h-8"
                                placeholder={value.length === 0 ? placeholder : ""}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                maxLength={50}
                            />
                        </div>

                        <p className="text-xs text-gray-500">{t("featuresHint")}</p>
                        <FormErrorMessage message={errorMessage} />
                    </div>
                );
            }}
        />
    );
}