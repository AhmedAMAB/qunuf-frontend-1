'use client';

import { useTranslations } from 'next-intl';
import { Link } from "@/i18n/navigation";
import TextInput from '../shared/forms/TextInput';
import PasswordInput from '../shared/forms/PasswordInput';
import SecondaryButton from '../shared/buttons/SecondaryButton';

export default function SignInForm() {
    const t = useTranslations('auth.signIn');

    return (
        <form className="flex flex-col gap-4 md:gap-5">
            <TextInput
                label={t('email.label')}
                placeholder={t('email.placeholder')}
                type="email"
            />
            <PasswordInput
                label={t('password.label')}
                placeholder={t('password.placeholder')}
            />
            <div className="flex justify-between items-center text-sm">
                <Link
                    href="/forgot-password"
                    className="text-primary font-semibold underline"
                >
                    {t('forgotPassword')}
                </Link>
                <div></div>
            </div>

            <SecondaryButton
                onClick={() => { }}
                className="bg-secondary hover:bg-secondary-hover text-white py-2 lg:py-3 w-full"
                disabled={false}
            >
                {t('login')}
            </SecondaryButton>
            <div className="text-center text-sm mt-4">
                {t('noAccount')}{' '}
                <Link
                    href="/sign-up"
                    className="text-primary font-semibold underline"
                >
                    {t('register')}
                </Link>
            </div>
        </form>
    );
}
