import AuthHeader from '@/components/auth/AuthHeader';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';


export async function generateMetadata() {
    const t = await getTranslations('auth.forgotPassword');
    return {
        title: t('title'),
    };
}

export default async function ForgotPasswordPage() {
    const t = await getTranslations('auth.forgotPassword');
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
                            href="/sign-in"
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
