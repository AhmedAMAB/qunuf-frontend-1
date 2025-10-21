'use client';

import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import TextInput from '@/components/shared/forms/TextInput';
import TextAreaInput from '@/components/shared/forms/TextAreaInput';
import Uploader from '@/components/shared/forms/Uploader';
import ActionButtons from '@/components/shared/ActionButtons';
import { FileItem } from '@/utils/upload';

export interface BlogFormType {
    title: string;
    description: string;
    image: FileItem;
    date: string;
}

interface BlogEditFormProps {
    initialData?: BlogFormType;
    onCancel: () => void;
    onAction: (data: BlogFormType) => void;
}

export default function BlogEditForm({
    initialData,
    onCancel,
    onAction,

}: BlogEditFormProps) {
    const t = useTranslations('dashboard.admin.blog');
    const tUploader = useTranslations('comman.form.uploader');

    const { control, handleSubmit, watch, setValue } = useForm<BlogFormType>({
        defaultValues: initialData || {
            title: '',
            description: '',
            image: {},
            date: '',
        },
    });

    return (
        <form onSubmit={handleSubmit(onAction)} className="space-y-6">
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

            {/* Title */}
            <TextInput
                label={t('form.title')}
                placeholder={t('form.titlePlaceholder')}
                value={watch('title')}
                onChange={(e) => setValue('title', e.target.value)}
            />
            {/* Date */}
            <TextInput
                label={t('form.date')}
                placeholder={t('form.datePlaceholder')}
                value={watch('date')}
                onChange={(e) => setValue('date', e.target.value)}
                type="date"
            />

            {/* Description */}
            <TextAreaInput
                label={t('form.description')}
                placeholder={t('form.descriptionPlaceholder')}
                value={watch('description')}
                onChange={(e) => setValue('description', e.target.value)}
                rows={6}
            />


            {/* Action Buttons */}
            <ActionButtons
                onAction={onCancel}
                onCancel={handleSubmit(onAction)}
                actionText={t('form.actionText')}
                cancelText={t('form.cancel')}
                isDisabled={false}
            />
        </form>
    );
}
