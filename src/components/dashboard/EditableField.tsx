'use client'
import { useState, ReactNode } from 'react';
import Popup from '../atoms/Popup';
import { useTranslations } from 'next-intl';

interface EditableFieldProps {
    label: string;
    valueDisplay: string | ReactNode;
    popupClassName?: string;
    renderPopup: (onClose: () => void) => ReactNode;
}

export default function EditableField({ label, valueDisplay, popupClassName, renderPopup }: EditableFieldProps) {
    const [showPopup, setShowPopup] = useState(false);
    const t = useTranslations('dashboard.account');

    return (
        <div className="space-y-1 py-5 border-b border-b-gray">
            <div className="flex items-center justify-between text-muted">
                <span>{label}</span>
                <button onClick={() => setShowPopup(true)} className="text-primary underline">
                    {t('edit')}
                </button>
            </div>

            <div className="text-sm font-medium text-input">
                {valueDisplay || <span className="text-muted italic">{t('notProvided')}</span>}
            </div>

            <Popup
                show={showPopup}
                className={popupClassName}
                onClose={() => setShowPopup(false)}
                headerContent={<div className="text-lg font-semibold">{label}</div>}
            >
                {renderPopup(() => setShowPopup(false))}
            </Popup>
        </div>
    );
}