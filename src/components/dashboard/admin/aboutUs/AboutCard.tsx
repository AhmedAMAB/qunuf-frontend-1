'use client';

import Image from 'next/image';
import { useLocale, useMessages, useTranslations } from 'next-intl';
import { useState } from 'react';
import SecondaryButton from '@/components/shared/buttons/SecondaryButton';
import { CompanySection, type CompanyInfo } from '@/types/company';
import { resolveUrl } from '@/utils/upload';


interface AboutCardProps {
    sectionKey: CompanySection;
    item: CompanyInfo | null;
    onOpen: ({ sectionKey, item }: { sectionKey: string | null, item: CompanyInfo | null }) => void;
}

export default function AboutCard({ sectionKey, item, onOpen }: AboutCardProps) {
    const t = useTranslations('dashboard.admin.about');

    const locale = useLocale();
    const isArabic = locale === 'ar';

    const title = item ? (isArabic ? item.title_ar : item.title_en) : t(`${sectionKey}.defaultTitle`);
    const description = item ? (isArabic ? item.content_ar : item.content_en) : '';


    function handleOpen() {
        onOpen({ sectionKey, item })
    }

    return (
        <>
            <div className="flex flex-col md:flex-row  bg-card-bg rounded-[14px]  w-full mx-auto">
                {/* Image */}
                <div className="w-[250px] h-[250px] rounded-[12px] overflow-hidden shrink-0 m-3">
                    <Image
                        src={item?.imagePath ? resolveUrl(item?.imagePath) : '/no-image.png'}
                        alt={title}
                        width={250}
                        height={250}
                        className="object-cover w-full h-full"
                    />
                </div>

                {/* Text */}
                <div className="flex gap-2 flex-col md:flex-row justify-between flex-1 m-4 md:m-5 text-center md:text-start">
                    <div>
                        <h2 className="font-bold text-[28px] sm:text-[32px] mb-4 text-dark">
                            {title}
                        </h2>
                        <p className="text-lg sm:text-xl text-dark whitespace-pre-line">
                            {description || t('noContent')}
                        </p>
                    </div>
                    <div className="flex items-center justify-center md:justify-start">
                        <SecondaryButton
                            onClick={handleOpen}
                            className="bg-secondary hover:bg-secondary-hover font-semibold text-lighter sm:!py-2"
                        >
                            {t('edit')}
                        </SecondaryButton>
                    </div>
                </div>
            </div>


        </>
    );
}
