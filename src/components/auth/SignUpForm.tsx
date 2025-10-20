'use client';

import { useTranslations } from 'next-intl';
import { Link } from "@/i18n/navigation";
import TextInput from '../shared/forms/TextInput';
import PasswordInput from '../shared/forms/PasswordInput';
import SecondaryButton from '../shared/buttons/SecondaryButton';
import RoleSelector from './RoleSelector';

export default function SignUpForm() {
    const t = useTranslations('auth.signUp');

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
            <RoleSelector />
            <SecondaryButton
                onClick={() => { }}
                className="bg-secondary hover:bg-secondary-hover text-white py-2 lg:py-3 w-full"
                disabled={false}
            >
                {t('register')}
            </SecondaryButton>
            <div className="text-center text-sm mt-4">
                {t('haveAccount')}{' '}
                <Link
                    href="/sign-in"
                    className="text-primary font-semibold underline"
                >
                    {t('login')}
                </Link>
            </div>
        </form>
    );
}
