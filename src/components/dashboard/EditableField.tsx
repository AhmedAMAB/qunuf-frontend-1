'use client'
import { useState } from 'react';
import Popup from '../shared/Popup';
import TextInput from '../shared/forms/TextInput';
import SecondaryButton from '../shared/buttons/SecondaryButton';
import { useTranslations } from 'next-intl';


interface EditableFieldProps {
    label: string;
    value?: string;
    placeholder?: string;
}

export default function EditableField({ label, value = '', placeholder }: EditableFieldProps) {
    const [showPopup, setShowPopup] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const t = useTranslations('dashboard.account');
    const handleOpen = () => {
        setInputValue(value); // reset to original value
        setShowPopup(true);
    };

    const handleClose = () => setShowPopup(false);

    const handleConfirm = () => {
        // TODO: trigger update logic (e.g. API call or form state update)
        setShowPopup(false);
    };

    return (
        <div className="space-y-1 py-5 border-b border-b-gray">
            <div className="flex items-center justify-between text-sm text-muted">
                <span>{label}</span>
                <button
                    onClick={handleOpen}
                    className="text-primary underline focus:outline-none"
                >
                    {t('edit')}
                </button>
            </div>

            <div className="text-sm font-medium text-input ">
                {value || <span className="text-muted">{placeholder ?? t('notProvided')}</span>}
            </div>

            <Popup
                show={showPopup}
                onClose={handleClose}
                headerContent={<div className="text-lg font-semibold">{label}</div>}
            >
                <div className="space-y-6">
                    <TextInput
                        label={label}
                        placeholder={placeholder}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />

                    <div className="flex flex-col sm:flex-row gap-4 justify-end">
                        <SecondaryButton
                            onClick={handleConfirm}
                            className="bg-secondary hover:bg-secondary-hover text-white py-2 lg:py-3 w-full sm:w-[323px]"
                            disabled={!inputValue.trim()}
                        >
                            {t('update')}
                        </SecondaryButton>

                        <SecondaryButton
                            onClick={handleClose}
                            className="bg-[#F5F6F8] hover:bg-[#E9EAEC] text-[#B3B3B3] py-2 lg:py-3 w-full sm:w-[323px]"
                        >
                            {t('cancel')}
                        </SecondaryButton>
                    </div>
                </div>
            </Popup>
        </div>
    );
}
