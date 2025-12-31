'use client';

import { useTranslations } from 'next-intl';
import TextInput from '../shared/forms/TextInput';
import SecondaryButton from '../shared/buttons/SecondaryButton';
import { useRouter } from '@/i18n/navigation';
import { useState } from 'react';
import api from '@/libs/axios';
import toast from 'react-hot-toast';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';



// Zod schema for validation
const forgotPasswordSchema = z.object({
    email: z.string().email({ message: 'invalidEmail' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
    const t = useTranslations('auth.forgotPassword.form');
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: '' },
    });

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email: data.email });

            toast.success(t('success.sent'));
            router.push('/auth/sign-in');
        } catch (err: any) {
            toast.error(err.response?.data?.message || t('errors.forgotPasswordFailed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="flex flex-col gap-4 md:gap-5" onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name="email"
                control={control}
                render={({ field }) => (
                    <TextInput
                        label={t('email.label')}
                        placeholder={t('email.placeholder')}
                        type="email"
                        {...field}
                        error={errors.email?.message ? t(`errors.${errors.email.message}`) : undefined}
                    />
                )}
            />

            <SecondaryButton
                type="submit"
                className="bg-secondary hover:bg-secondary-hover text-white py-2 lg:py-3 w-full"
                disabled={loading}
            >
                {loading ? t('loading') : t('send')}
            </SecondaryButton>
        </form>
    );
}