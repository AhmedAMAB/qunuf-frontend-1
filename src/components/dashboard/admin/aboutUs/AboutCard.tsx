'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import SecondaryButton from '@/components/shared/buttons/SecondaryButton';
import Popup from '@/components/shared/Popup';
import AboutSectionForm from './AboutSectionForm';
import { AboutSectionFormType } from './AboutSectionForm';

interface AboutCardProps {
    block: {
        key: string;
        imageUrl: string;
        description: string;
    };
}

export default function AboutCard({ block }: AboutCardProps) {
    const t = useTranslations('dashboard.admin.about');
    const tComman = useTranslations('comman');
    const [showPopup, setShowPopup] = useState(false);

    return (
        <>
            <div className="flex flex-col md:flex-row items-center bg-card-bg rounded-[14px] p-3 w-full mx-auto">
                {/* Image */}
                <div className="w-[250px] h-[250px] rounded-[12px] overflow-hidden shrink-0">
                    <Image
                        src={block.imageUrl}
                        alt={t(`${block.key}.title`)}
                        width={250}
                        height={250}
                        className="object-cover w-full h-full"
                    />
                </div>

                {/* Text */}
                <div className="flex gap-2 flex-col md:flex-row justify-center flex-1 px-4 md:px-8 text-center md:text-start">
                    <div>
                        <h2 className="font-bold text-[28px] sm:text-[32px] mb-4 text-dark">
                            {t(`${block.key}.title`)}
                        </h2>
                        <p className="text-lg sm:text-xl text-dark">
                            {block.description}
                        </p>
                    </div>
                    <div className="flex items-center justify-center md:justify-start">
                        <SecondaryButton
                            onClick={() => setShowPopup(true)}
                            className="bg-secondary hover:bg-secondary-hover font-semibold text-lighter sm:!py-2"
                        >
                            {t('edit')}
                        </SecondaryButton>
                    </div>
                </div>
            </div>

            {/* Popup */}
            <Popup
                show={showPopup}
                onClose={() => setShowPopup(false)}
                className="w-full md:w-[540px]"
                headerContent={
                    <p className="text-[24px] font-bold text-dark text-center">
                        {t(`${block.key}.title`)}
                    </p>
                }
            >
                <AboutSectionForm
                    initialData={{
                        message: block.description,
                        image: { url: block.imageUrl },
                    }}
                    onCancel={() => setShowPopup(false)}
                    onAction={(data: AboutSectionFormType) => {
                        console.log('Updated:', data);
                        setShowPopup(false);
                    }}
                    cancelText={tComman('cancel')}
                    actionText={tComman('save')}
                />
            </Popup>
        </>
    );
}
