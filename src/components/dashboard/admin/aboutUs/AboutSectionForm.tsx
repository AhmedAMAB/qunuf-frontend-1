'use client';

import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import TextInput from '@/components/shared/forms/TextInput';
import Uploader from '@/components/shared/forms/Uploader';
import ActionButtons from '@/components/shared/ActionButtons';
import { FileItem } from '@/utils/upload';
import TextAreaInput from '@/components/shared/forms/TextAreaInput';


export interface AboutSectionFormType {
    message: string;
    image: FileItem;
}

interface AboutSectionFormProps {
    initialData?: AboutSectionFormType;
    onCancel: () => void;
    onAction: (data: AboutSectionFormType) => void;
    cancelText: string;
    actionText: string;
}

export default function AboutSectionForm({
    initialData,
    onCancel,
    onAction,
    cancelText,
    actionText,
}: AboutSectionFormProps) {
    const t = useTranslations('dashboard.admin.about.form');
    const tUploader = useTranslations('comman.form.uploader');

    const { control, handleSubmit, watch, setValue } = useForm<AboutSectionFormType>({
        defaultValues: initialData || {
            message: '',
            image: {}
        },
    });

    return (
        <form onSubmit={handleSubmit(onAction)} className="space-y-6 ">
            {/* Image Upload */}
            <Uploader
                control={control}
                name="image"
                accept="image/*"
                allowMultiple={false}
                rules={[
                    tUploader('rules.maxSize', { size: 5 }),
                    tUploader('rules.maxFiles', { count: 1 }),
                ]}
                maxFiles={1}
                maxSizeMB={5}
            />
            {/* Message (Textarea) */}
            <TextAreaInput
                label={t('message')}
                placeholder={t('messagePlaceholder')}
                value={watch('message')}
                onChange={(e) => setValue('message', e.target.value)}
                rows={6}
            />


            {/* Action Buttons */}
            <ActionButtons
                onAction={onCancel}
                onCancel={handleSubmit(onAction)}
                actionText={cancelText}
                cancelText={actionText}
                isDisabled={false}
            />
        </form>
    );
}
