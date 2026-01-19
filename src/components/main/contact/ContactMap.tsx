'use client';

import { useValues } from '@/contexts/GlobalContext';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';


const LocationMap = dynamic(() => import('../../../components/shared/LocationMap'), {
    ssr: false,
});

export default function ContactMap() {
    const t = useTranslations("contact");
    const { settings, loadingSettings } = useValues();

    return (
        <div className="col-span-6 relative h-full flex justify-center items-center">
            {/* Reversed: right-0 -> left-0 AND rounded-r -> rounded-l */}
            <div className="absolute top-0 bottom-0 left-0 h-full w-[300px] bg-secondary rounded-l-4xl"></div>

            {/* Margins: changed from me (margin-end) to ms (margin-start) to push content away from the new left box */}
            <div className="w-full max-w-[650px] my-12 md:my-16 lg:my-20 ms-12 md:ms-16 lg:ms-20 z-10">
                {loadingSettings ? (
                    <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px] bg-gray-600 animate-pulse rounded-lg" />
                ) : settings?.latitude && settings?.longitude ? (
                    <LocationMap lat={settings.latitude} lng={settings.longitude} zoom={6} />
                ) : (
                    <p className="text-white text-center">{t('nolocation')}</p>
                )}
            </div>
        </div>
    );
}