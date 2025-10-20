'use client';

import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Image from 'next/image';
import TextInput from '@/components/shared/forms/TextInput';
import ActionButtons from '@/components/shared/ActionButtons';

interface TeamMemberFormProps {
    initialData?: TeamMemberFormType;
    onCancel: () => void;
    onAction: (data: TeamMemberFormType) => void;
    cancelText: string;
    actionText: string;
}

export interface TeamMemberFormType {
    name: string;
    email: string;
    phone: string;
    imageUrl?: string;
}

export default function TeamMemberForm({
    initialData,
    onCancel,
    onAction,
    cancelText,
    actionText,
}: TeamMemberFormProps) {
    const t = useTranslations('dashboard.admin.team.form');
    const [fileName, setFileName] = useState<string | null>(
        initialData?.imageUrl ? initialData.imageUrl.split('/').pop() ?? null : null
    );
    const [preview, setPreview] = useState<string | undefined>(
        initialData?.imageUrl
    );


    const { register, handleSubmit, watch } = useForm<TeamMemberFormType>({
        defaultValues: initialData || {
            name: '',
            email: '',
            phone: '',
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setPreview(URL.createObjectURL(file));
        }
        else {
            setFileName(null);
            setPreview(undefined)
        }
    };


    return (
        <form onSubmit={handleSubmit(onAction)} className="space-y-6">

            {/* Image Upload */}
            <div className="flex flex-col sm:flex-row items-center gap-4 overflow-hidden">
                <div className="shrink-0 w-[100px] h-[100px]  bg-lighter rounded-[8px] overflow-hidden flex items-center justify-center">
                    {preview ? <Image
                        src={preview}
                        alt="Preview"
                        width={100}
                        height={100}
                        className="object-cover w-full h-full"
                    /> :
                        (
                            <svg width="44" height="36" viewBox="0 0 44 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.667969 4.59994C0.667969 2.2067 2.60807 0.266602 5.0013 0.266602H39.0013C41.3945 0.266602 43.3346 2.2067 43.3346 4.59994V31.2666C43.3346 33.6598 41.3945 35.5999 39.0013 35.5999H5.0013C2.60807 35.5999 0.667969 33.6598 0.667969 31.2666V4.59994ZM5.0013 2.2666C3.71264 2.2666 2.66797 3.31127 2.66797 4.59994V31.2666C2.66797 32.5553 3.71264 33.5999 5.0013 33.5999H39.0013C40.29 33.5999 41.3346 32.5553 41.3346 31.2666V4.59994C41.3346 3.31127 40.29 2.2666 39.0013 2.2666H5.0013Z" fill="var(--primary)" />
                                <ellipse cx="10.6693" cy="9.59993" rx="4.33333" ry="4.33333" fill="var(--primary)" />
                                <path d="M6.33594 27.9336V25.9573C6.33594 25.5153 6.51153 25.0913 6.82409 24.7788L12.2122 19.3907C12.8413 18.7616 13.8536 18.7375 14.5118 19.3359L15.8432 20.5462C16.4948 21.1386 17.4947 21.1218 18.1261 20.508L27.8243 11.0791C28.4777 10.4439 29.5202 10.4512 30.1646 11.0956L37.8478 18.7788C38.1603 19.0913 38.3359 19.5153 38.3359 19.9573V27.9336C38.3359 28.8541 37.5898 29.6003 36.6693 29.6003H8.0026C7.08213 29.6003 6.33594 28.8541 6.33594 27.9336Z" fill="var(--primary)" />
                            </svg>

                        )}
                </div>
                <label className="bg-lighter  gap-2 text-primary px-4 py-2 rounded-[8px] cursor-pointer w-full">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
                        <div className="border border-primary rounded-[8px] px-2 py-1 w-fit">
                            {t('upload')}
                        </div>
                        <div className="text-gray-500 text-sm sm:text-base max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                            {fileName ? fileName : t('noFile')}
                        </div>
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        {...register('imageUrl')}
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </label>
            </div>

            {/* Inputs */}
            <TextInput
                label={t('name')}
                placeholder={t('namePlaceholder')}
                value={watch('name')}
                {...register('name')}
            />
            <TextInput
                label={t('email')}
                placeholder={t('emailPlaceholder')}
                value={watch('email')}
                {...register('email')}
            />
            <TextInput
                label={t('phone')}
                placeholder={t('phonePlaceholder')}
                value={watch('phone')}
                {...register('phone')}
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
