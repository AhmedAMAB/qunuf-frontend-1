'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import TextInput from '@/components/shared/forms/TextInput';
import PopupActionButtons from './PopupActionButtons';


interface Props {
    value?: string | null; // ISO date: yyyy-mm-dd
    error?: string;
    isLoading: boolean;
    onSave: (value: Date | null) => void;
    close: () => void;
}

export function BirthDatePopup({ value, error, isLoading, onSave, close }: Props) {
    const t = useTranslations('dashboard.account');
    const [birthDate, setBirthDate] = useState(value ?? '');

    useEffect(() => {
        setBirthDate(value ?? '');
    }, [value]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!birthDate) return;
        onSave(birthDate ? new Date(birthDate) : null);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <TextInput

                type="date"
                label={t('birthDate')}
                placeholder={t('placeholders.birthDate')}
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                error={error ? t(error) : ""}
            />

            <PopupActionButtons
                onCancel={close}
                isLoading={isLoading}
            />
        </form>
    );
}
