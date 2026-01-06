'use client';

import Image from 'next/image';
import { useState } from 'react';
import Popup from '@/components/shared/Popup';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useLocale, useTranslations } from 'next-intl';
import ActionPopup from '@/components/shared/ActionPopup';
import { FaRegNewspaper } from 'react-icons/fa';
import BlogEditForm from './BlogEditForm';
import { resolveUrl } from '@/utils/upload';
import { Blog } from '@/types/dashboard/blog';

interface BlogContentCardProps {
    block: Blog
    onEdit: () => void;
    onDelete: () => void;
}

export default function BlogContentCard({ block, onEdit, onDelete }: BlogContentCardProps) {
    const locale = useLocale()
    const isAr = locale === 'ar';
    const title = isAr ? block.title_ar : block.title_en;
    const description = isAr ? block.description_ar : block.description_en;
    const formattedDate = new Date(block.created_at).toLocaleDateString('en', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <>
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
                    <div className='flex  flex-col'>
                        <div className='space-y-1'>
                            <h2 className="font-bold text-[28px] sm:text-[32px] text-dark">
                                {title}
                            </h2>
                            <div className="text-input text-sm">{formattedDate}</div>

                        </div>
                        <p className="text-lg sm:text-xl text-dark mt-6  whitespace-break-spaces">
                            {description}
                        </p>
                    </div>
                    <div className="flex gap-2 items-start justify-center md:justify-start">
                        <button
                            onClick={onDelete}
                            className="bg-red-500 text-white font-semibold rounded-full p-2 sm:!py-2"
                        >
                            <MdDelete size={16} />
                        </button>
                        <button
                            onClick={onEdit}
                            className="bg-primary text-lighter font-semibold rounded-full p-2 sm:!py-2"
                        >
                            <MdEdit size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

