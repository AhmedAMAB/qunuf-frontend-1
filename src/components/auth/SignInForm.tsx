'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';

import { useAuth } from '@/contexts/AuthContext';
import TextInput from '../shared/forms/TextInput';
import PasswordInput from '../shared/forms/PasswordInput';
import SecondaryButton from '../shared/buttons/SecondaryButton';
import { Link } from "@/i18n/navigation";

// Zod schema for validation
const loginSchema = z.object({
    email: z.string().min(1, { message: 'email.required' }).email({ message: 'email.invalid' }),
    password: z.string().trim().min(1, { message: 'errors.requiredPassword' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function SignInForm() {
    const t = useTranslations('auth.signIn');
    const router = useRouter();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    const onSubmit = async (data: LoginFormValues) => {
        setLoading(true);
        try {
            const { accessToken, refreshToken, user: fetchedUser } = await login(data);
            toast.success(t('success.signedIn'));

            await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accessToken, refreshToken, user: fetchedUser }),
            });

            router.push('/');
        } catch (err: any) {
            const msg = err?.response?.data?.message || t('errors.loginFailed');
            const errorMsg = msg === 'Refresh token not provided in the request body'
                ? t('errors.incorrectEmailOrPassword')
                : msg;
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };
    const searchParams = useSearchParams();
    const loginError = searchParams?.get('error');
    const loginSuccess = searchParams?.get('success');

    useEffect(() => {

        if (loginError === 'confirmation_failed') {
            toast.error(t('emailConfirmationFailed'));

            // 🔥 Remove query param from URL without reload
            const params = new URLSearchParams(window.location.search);
            params.delete('error');
            params.delete('error_message');

            const newUrl =
                window.location.pathname + '?' + params.toString();

            router.replace(newUrl, { scroll: false });
        }

        if (loginSuccess === 'verified') {
            toast.success(t('success.verified'));

            // 🔥 Remove query param from URL without reload
            const params = new URLSearchParams(window.location.search);
            params.delete('success');

            const newUrl =
                window.location.pathname + '?' + params.toString();

            router.replace(newUrl, { scroll: false });
        }

    }, [t, router, loginError])
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
                        error={errors.email?.message ? t(errors.email.message) : undefined}
                    />
                )}
            />

            {/* Password */}
            <Controller
                name="password"
                control={control}
                render={({ field }) => (
                    <PasswordInput
                        label={t('password.label')}
                        placeholder={t('password.placeholder')}
                        {...field}
                        error={errors.password?.message ? t(errors.password.message) : undefined}
                    />
                )}
            />

            <div className="flex justify-between items-center text-sm">
                <Link
                    href="/auth/forgot-password"
                    className="text-primary font-semibold underline"
                >
                    {t('forgotPassword')}
                </Link>
            </div>

            <SecondaryButton
                type="submit"
                className="bg-secondary hover:bg-secondary-hover text-white py-2 lg:py-3 w-full"
                disabled={loading}
            >
                {loading ? t('loading') : t('login')}
            </SecondaryButton>

            <div className="text-center text-sm mt-4">
                {t('noAccount')}{' '}
                <Link
                    href="/auth/sign-up"
                    className="text-primary font-semibold underline"
                >
                    {t('register')}
                </Link>
            </div>
        </form>
    );
}
