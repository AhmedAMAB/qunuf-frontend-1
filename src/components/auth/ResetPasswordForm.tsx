'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TextInput from '../shared/forms/TextInput';
import PasswordInput from '../shared/forms/PasswordInput';
import SecondaryButton from '../shared/buttons/SecondaryButton';
import api from '@/libs/axios';
import z from 'zod';
import { Link } from '@/i18n/navigation';

const resetPasswordSchema = z.object({
    email: z.email({ message: 'email.invalid' }),
    code: z.string().min(1, { message: 'code.required' }),
    password: z
        .string()
        .min(8, { message: 'password.minLength' })
        .max(20, { message: 'password.maxLength' })
        .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$!%*?&])/, { message: 'password.pattern' }),
    confirmPassword: z
        .string()
        .min(8, { message: 'password.minLength' })
        .max(20, { message: 'password.maxLength' })
        .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$!%*?&])/, { message: 'password.pattern' }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "confirmPassword.mismatch",
    path: ["confirmPassword"],
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
    const t = useTranslations('auth.resetPassword.form');
    const searchParams = useSearchParams()
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { email: searchParams.get("email") || '', code: searchParams.get("code") || '', password: '', confirmPassword: '' },
    });

    const onSubmit = async (data: ResetPasswordFormValues) => {
        setLoading(true);
        try {
            await api.post('/auth/reset-password', {
                email: data.email,
                code: data.code,
                password: data.password,
            });
            toast.success(t('success.sent'));
            router.push('/auth/sign-in');
        } catch (err: any) {
            toast.error(err.response?.data?.message || t('errors.failed'));
        } finally {
            setLoading(false);
        }
    };

    const email = searchParams.get("email");
    const code = searchParams.get("code");

    // ❗ If missing — show error UI instead of form
    if (!email || !code) {
        return (
            <div className="flex flex-col gap-4 text-center">
                <p className="text-red-500 font-semibold">
                    {t('errors.invalidLink')}
                </p>
                <Link
                    href={'/auth/forgot-password'}
                    className="text-primary underline"
                >
                    {t('errors.requestNewLink')}
                </Link>
            </div>
        );
    }


    return (
        <form className="flex flex-col gap-4 md:gap-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <Controller
                name="email"
                control={control}
                render={({ field }) => (
                    <TextInput
                        label={t('email.label')}
                        placeholder={t('email.placeholder')}
                        type="email"
                        {...field}
                        readonly
                        disabled
                        error={errors.email?.message ? t(`errors.${errors.email.message}`) : undefined}
                    />
                )}
            />

            {/* New Password */}
            <Controller
                name="password"
                control={control}
                render={({ field }) => (
                    <PasswordInput
                        label={t('password.label')}
                        placeholder={t('password.placeholder')}
                        {...field}
                        error={errors.password?.message ? t(`errors.${errors.password.message}`) : undefined}
                    />
                )}
            />

            {/* Confirm New Password */}
            <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                    <PasswordInput
                        label={t('confirmPassword.label')}
                        placeholder={t('confirmPassword.placeholder')}
                        {...field}
                        error={errors.confirmPassword?.message ? t(`errors.${errors.confirmPassword.message}`) : undefined}
                    />
                )}
            />

            <SecondaryButton
                type="submit"
                className="bg-secondary hover:bg-secondary-hover text-white py-2 lg:py-3 w-full"
                disabled={loading}
            >
                {loading ? t('loading') : t('reset')}
            </SecondaryButton>
        </form>
    );
}
