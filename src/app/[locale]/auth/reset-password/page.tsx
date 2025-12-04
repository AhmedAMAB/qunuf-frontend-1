import AuthHeader from '@/components/auth/AuthHeader';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export async function generateMetadata() {
    const t = await getTranslations('auth.resetPassword');
    return {
        title: t('title'),
    };
}

export default async function ResetPasswordPage() {
    const t = await getTranslations('auth.resetPassword');

    return (
        <section className="py-20 bg-[var(--bg-1)] mt-16">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-center">
                    <div className="w-full max-w-[800px] bg-white p-8 custom-shadow rounded-2xl">
                        <AuthHeader className="!mb-4" />
                        <h3 className="text-3xl font-bold mb-4 text-primary text-center">
                            {t('title')}
                        </h3>

                        <ResetPasswordForm />

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
