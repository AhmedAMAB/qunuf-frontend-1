
import AuthHeader from '@/components/auth/AuthHeader';
import ResendVerificationEmailForm from '@/components/auth/ResendVerificationEmailForm';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
    const t = await getTranslations('auth.resendVerification');
    return {
        title: t('title'),
    };
}

export default async function ResendVerificationEmailPage() {
    const t = await getTranslations('auth.resendVerification');

    return (
        <section className="py-20 bg-[var(--bg-1)] mt-16">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-center">
                    <div className="w-full max-w-[800px] bg-white p-8 custom-shadow rounded-2xl">
                        <AuthHeader className="!mb-4" />
                        <h3 className="text-3xl font-bold mb-4 text-primary text-center">
                            {t('title')}
                        </h3>

                        <ResendVerificationEmailForm />
                    </div>
                </div>
            </div>
        </section>
    );
}
