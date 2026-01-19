'use client';

import Image from 'next/image';
import { useState } from 'react';
import { MdDelete, MdEdit, MdKeyboardArrowDown } from 'react-icons/md';
import { useLocale, useTranslations } from 'next-intl';
import { resolveUrl } from '@/utils/upload';
import { Blog } from '@/types/dashboard/blog';
import SecondaryButton from '@/components/shared/buttons/SecondaryButton';

interface BlogContentCardProps {
    block: Blog
    onEdit: () => void;
    onDelete: () => void;
}


export default function BlogContentCard({ block, onEdit, onDelete }: BlogContentCardProps) {
    const locale = useLocale();
    const t = useTranslations('comman'); // Assuming 'seeMore' is in common
    const [isExpanded, setIsExpanded] = useState(false);

    const isAr = locale === 'ar';
    const title = isAr ? block.title_ar : block.title_en;
    const description = isAr ? block.description_ar : block.description_en;

    // Character limit for the "trimmed" view
    const CHAR_LIMIT = 150;
    const shouldShowButton = description?.length > CHAR_LIMIT;
    const displayedText = isExpanded ? description : `${description?.slice(0, CHAR_LIMIT)}...`;

    const formattedDate = new Date(block.created_at).toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="flex flex-col md:flex-row max-md:items-center gap-5 md:gap-7 lg:gap-10 bg-card-bg rounded-[14px] p-3 w-full mx-auto">
            {/* Image */}
            <div className="w-[250px] h-[250px] rounded-[12px] overflow-hidden shrink-0">
                <Image
                    src={resolveUrl(block.imagePath)}
                    alt={title}
                    width={250}
                    height={250}
                    className="object-cover w-full h-full"
                />
            </div>

            {/* Text */}
            <div className="flex gap-2 flex-col md:flex-row justify-between flex-1 text-center md:text-start">
                <div className='flex flex-col flex-1'>
                    <div className='space-y-1'>
                        <h2 className="font-bold text-[28px] sm:text-[32px] text-dark">
                            {title}
                        </h2>
                        <div className="text-input text-sm">{formattedDate}</div>
                    </div>

                    <div className="mt-6">
                        <p className="text-lg sm:text-xl text-dark whitespace-break-spaces inline">
                            {shouldShowButton ? displayedText : description}
                        </p>

                        {shouldShowButton && (
                            <SecondaryButton
                                // Transition added for hover, and min-width to prevent "jumping" when text changes
                                className="mt-4 bg-secondary hover:bg-opacity-90 transition-all duration-200 text-white !w-fit min-w-[120px] text-sm font-semibold shadow-sm active:scale-95"
                                onClick={() => setIsExpanded(!isExpanded)}
                            >
                                <span className="flex items-center gap-2">
                                    {isExpanded ? t('seeLess') : t('seeMore')}
                                    {/* Optional: Add an icon that rotates */}
                                    <MdKeyboardArrowDown
                                        className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                        size={20}
                                    />
                                </span>
                            </SecondaryButton>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 items-start justify-center md:justify-start">
                    <button onClick={onDelete} className="bg-red-500 text-white rounded-full p-2">
                        <MdDelete size={16} />
                    </button>
                    <button onClick={onEdit} className="bg-primary text-lighter rounded-full p-2">
                        <MdEdit size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}