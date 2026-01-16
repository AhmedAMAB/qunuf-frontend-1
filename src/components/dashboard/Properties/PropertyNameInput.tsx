'use client';

import { useEffect, useRef, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import TextInput from '@/components/shared/forms/TextInput';
import { useTranslations } from 'next-intl';
import api from '@/libs/axios';
import { BiCheckCircle, BiXCircle } from 'react-icons/bi';

interface PropertyNameInputProps {
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    error?: string;
    label: string;
    placeholder: string;
    initialEditName?: string; // The original name when editing
    propertyId?: string; // Current property ID when editing (to exclude from uniqueness check)
    setError?: (name: string, error: { type: string; message: string }) => void; // React Hook Form setError
    clearErrors?: () => void; // React Hook Form clearErrors
}

export default function PropertyNameInput({
    value,
    onChange,
    onBlur,
    error,
    label,
    placeholder,
    initialEditName,
    propertyId,
    setError,
    clearErrors,
}: PropertyNameInputProps) {
    const t = useTranslations('dashboard.properties.form');
    const [isChecking, setIsChecking] = useState(false);
    const [isUnique, setIsUnique] = useState<boolean | null>(null);
    const [checkError, setCheckError] = useState<string | null>(null);

    const { debouncedValue } = useDebounce({
        value,
        delay: 500,
    });

    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => {
        const checkUniqueness = async () => {
            if (abortRef.current) abortRef.current.abort();

            const controller = new AbortController();
            abortRef.current = controller;

            // Skip check if name is empty or too short
            if (!debouncedValue || debouncedValue.trim().length < 3 || debouncedValue.trim().length > 100) {
                setIsUnique(null);
                setCheckError(null);
                // Clear form error when name is too short or empty
                clearErrors?.();
                return;
            }

            // If editing and name matches initial, it's valid
            if (initialEditName && debouncedValue.trim() === initialEditName.trim()) {
                setIsUnique(true);
                setCheckError(null);
                clearErrors?.();
                return;
            }

            // Check uniqueness via API
            setIsChecking(true);
            try {
                const response = await api.get<{ isUnique: boolean }>(
                    `/properties/check-slug?name=${encodeURIComponent(debouncedValue.trim())}${propertyId ? `&excludeId=${propertyId}` : ''}`,
                    { signal: controller.signal }
                );
                setIsUnique(response.data.isUnique);

                if (response.data.isUnique) {
                    setCheckError(null);
                    clearErrors?.();
                } else {
                    const errorMessage = t('validation.nameExists');
                    setCheckError(errorMessage);
                    setError?.('name', {
                        type: 'manual',
                        message: errorMessage,
                    });
                }
            } catch (err: any) {
                setIsUnique(false);
                const errorMessage = err?.response?.data?.message || t('validation.checkFailed');
                setCheckError(errorMessage);
                setError?.('name', {
                    type: 'manual',
                    message: errorMessage,
                });
            } finally {
                if (abortRef.current === controller) setIsChecking(false);
            }
        };

        checkUniqueness();
    }, [debouncedValue, initialEditName, propertyId, t]);

    // Reset validation when value changes
    useEffect(() => {
        if (value !== debouncedValue) {
            setIsUnique(null);
            setCheckError(null);
            // Clear form error when user starts typing again
            clearErrors?.();
        }
    }, [value, debouncedValue, clearErrors]);

    // Determine the error message to show
    const displayError = error || checkError || null;
    const showSuccess = isUnique === true && !isChecking && value.trim().length >= 3;

    return (
        <div>
            <div className="relative">
                <TextInput
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={onBlur}
                    label={label}
                    placeholder={placeholder}
                    error={displayError}
                />
                {/* Success/Error indicator - positioned inside input */}
                {value.trim().length >= 3 && (
                    <div className="flex items-center gap-2 pointer-events-none mt-2">
                        {isChecking ? (
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                <div className="w-4 h-4 border-2 border-gray-300 border-t-secondary rounded-full animate-spin" />
                                <span className="text-xs">{t('validation.checking')}</span>
                            </div>
                        ) : showSuccess ? (
                            <div className="flex items-center gap-1 text-sm text-green-600">
                                <BiCheckCircle className="text-lg" />
                                <span className="text-xs font-medium">{t('validation.nameAvailable')}</span>
                            </div>
                        )
                            : null}
                    </div>
                )}
            </div>
        </div>
    );
}

