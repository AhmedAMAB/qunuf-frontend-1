'use client'

import AuthHeader from '@/components/atoms/AuthHeader';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useState } from 'react';
import api from '@/libs/axios';
import toast from 'react-hot-toast';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';


import Link from 'next/link';
import TextInput from '@/components/molecules/forms/TextInput';
import SecondaryButton from '@/components/atoms/buttons/SecondaryButton';

export default function ForgotPasswordClient() {
    const t = useTranslations('auth.forgotPassword');

    return (
        <section className="py-20 bg-[var(--bg-1)] mt-16">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-center">
                    <div className="w-full max-w-[800px] bg-white p-8 custom-shadow rounded-2xl">
                        <AuthHeader className='!mb-4' />
                        <h3 className="text-3xl font-bold mb-4 text-primary text-center">
                            {t('title')}
                        </h3>

                        <ForgotPasswordForm />

                        <Link
                            href="/auth/sign-in"
                            className="mt-4 block text-primary font-semibold underline hover:text-primary-hover transition"
                        >
                            {t('backToLogin')}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}



// Zod schema for validation
const forgotPasswordSchema = z.object({
    email: z.string().trim().email({ message: 'invalidEmail' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

function ForgotPasswordForm() {
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
