import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from "@/i18n/navigation";
import StepTitle from './StepTitle';

export default function Step4() {
    const t = useTranslations('bookings.step4');

    return (
        <div className="space-y-12">
            <StepTitle title={t('title')} />

            <div className="space-y-10">
                <Image
                    src="/payment-completed.png"
                    width={491}
                    height={378}
                    alt={t('imageAlt')}
                    className="mx-auto"
                />

                {/* Summary Card */}
                <div className="bg-lighter rounded-xl shadow-sm px-6 py-5 max-w-xl mx-auto text-center space-y-4">
                    <p className="text-dark text-lg sm:text-xl font-medium leading-snug">
                        {t('message.line1')}
                    </p>
                    <p className="text-dark text-lg sm:text-xl font-medium leading-snug">
                        {t('message.line2')}
                    </p>
                </div>

                {/* CTA */}
                <Link
                    href="/"
                    className="text-base text-light underline hover:text-primary transition-colors block w-fit mx-auto"
                >
                    {t('homeLink')}
                </Link>
            </div>
        </div>
    );
}
