'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/libs/axios';
import { toast } from 'react-hot-toast';

import TextInput from '@/components/molecules/forms/TextInput';
import TextAreaInput from '@/components/molecules/forms/TextAreaInput';
import Uploader from '@/components/molecules/forms/Uploader';
import ActionButtons from '@/components/atoms/ActionButtons';
import FormErrorMessage from '@/components/molecules/forms/FormErrorMessage';

/* ---------------------------------- */
/* Schema */
/* ---------------------------------- */
export const getBlogSchema = (t: (key: string, params?: any) => string, isEdit?: boolean) =>
    z.object({
        title_en: z
            .string()
            .trim()
            .max(255, { message: t('validation.maxLength', { max: 255 }) })
            .nonempty({ message: t('validation.required') }),

        title_ar: z
            .string()
            .trim()
            .max(255, { message: t('validation.maxLength', { max: 255 }) })
            .nonempty({ message: t('validation.required') }),

        description_en: z
            .string()
            .trim()
            .nonempty({ message: t('validation.required') }),

        description_ar: z
            .string()
            .trim()
            .nonempty({ message: t('validation.required') }),

        image: isEdit
            ? z.any().optional()
            : z
                .any()
                .refine(
                    (val) => val && val.file,
                    { message: t('validation.imageRequired') }
                ),

    });

export type BlogFormType = z.infer<ReturnType<typeof getBlogSchema>>;

/* ---------------------------------- */
/* Props */
/* ---------------------------------- */
interface BlogEditFormProps {
    initialData?: BlogFormType & { id?: string };
    onClose: () => void;
    onSuccess: (blog: BlogFormType) => void;
}

/* ---------------------------------- */
/* Component */
/* ---------------------------------- */
export default function BlogEditForm({
    initialData,
    onClose,
    onSuccess,
}: BlogEditFormProps) {
    const tUploader = useTranslations('comman.form.uploader');
    const t = useTranslations('dashboard.admin.blog.form');

    const isEdit = !!initialData?.id;
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
        formState: { errors },
        reset,
    } = useForm<BlogFormType>({
        resolver: zodResolver(getBlogSchema(t, isEdit)),
        defaultValues: initialData || {
            title_en: '',
            title_ar: '',
            description_en: '',
            description_ar: '',
            image: null,
        },
    });

    /* ---------------------------------- */
    /* Submit */
    /* ---------------------------------- */
    const onSubmit = useCallback(
        async (data: BlogFormType) => {
            const toastId = toast.loading(
                isEdit ? t('actions.updating') : t('actions.creating')
            );
            setLoading(true);

            try {
                const formData = new FormData();
                formData.append('title_en', data.title_en);
                formData.append('title_ar', data.title_ar);
                formData.append('description_en', data.description_en);
                formData.append('description_ar', data.description_ar);

                if (data.image?.file) {
                    formData.append('image', data.image.file);
                }

                let res;
                if (isEdit && initialData?.id) {
                    res = await api.put(`/blogs/${initialData.id}`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    toast.success(t('actions.updateSuccess'), { id: toastId });
                } else {
                    res = await api.post('/blogs', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    toast.success(t('actions.createSuccess'), { id: toastId });
                }

                onClose();
                reset()
                onSuccess(res.data);
            } catch (err: any) {
                toast.error(
                    err?.response?.data?.message || t('actions.error'),
                    { id: toastId }
                );
            } finally {
                setLoading(false);
            }
        },
        [isEdit, initialData, onSuccess, t]
    );

    /* ---------------------------------- */
    /* Render */
    /* ---------------------------------- */
    return (
        <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Titles */}
                <TextInput
                    type='text'
                    label={t('title_en')}
                    {...register('title_en')}
                    value={watch('title_en') ?? ''}
                    onChange={(e) => setValue('title_en', e.target.value)}
                    error={errors.title_en?.message}
                />

                <TextInput
                    type='text'
                    label={t('title_ar')}
                    {...register('title_ar')}
                    value={watch('title_ar') ?? ''}
                    onChange={(e) => setValue('title_ar', e.target.value)}
                    error={errors.title_ar?.message}
                />

                {/* Descriptions */}
                <TextAreaInput
                    label={t('description_en')}
                    {...register('description_en')}
                    value={watch('description_en') ?? ''}
                    onChange={(e) => setValue('description_en', e.target.value)}
                    error={errors.description_en?.message}
                />

                <TextAreaInput
                    label={t('description_ar')}
                    {...register('description_ar')}
                    value={watch('description_ar') ?? ''}
                    onChange={(e) => setValue('description_ar', e.target.value)}
                    error={errors.description_ar?.message}
                />

                {/* Image */}
                <div className="md:col-span-2">
                    <Uploader
                        control={control}
                        name="image"
                        accept="image/*"
                        allowMultiple={false}
                        rules={[
                            tUploader('rules.maxSize', { size: 10 }),
                            tUploader('rules.maxFiles', { count: 1 }),
                        ]}
                        maxFiles={1}
                        maxSizeMB={10}
                    />
                    <FormErrorMessage message={errors.image?.message as string} />
                </div>
            </div>

            {/* Actions */}
            <ActionButtons
                onAction={handleSubmit(onSubmit)}
                onCancel={onClose}
                actionText={isEdit ? t('actions.update') : t('actions.create')}
                cancelText={t('actions.cancel')}
                isDisabled={loading}
            />
        </form>
    );
}
