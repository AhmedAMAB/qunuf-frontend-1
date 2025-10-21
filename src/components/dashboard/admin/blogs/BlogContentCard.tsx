'use client';

import Image from 'next/image';
import { useState } from 'react';
import Popup from '@/components/shared/Popup';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useTranslations } from 'next-intl';
import ActionPopup from '@/components/shared/ActionPopup';
import { FaRegNewspaper } from 'react-icons/fa';
import BlogEditForm from './BlogEditForm';

interface BlogContentCardProps {
    block: {
        id: string;
        imageUrl: string;
        title: string;
        description: string;
        date: string | Date;
    };
}

export default function BlogContentCard({ block }: BlogContentCardProps) {
    const [showPopup, setShowPopup] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const formattedDate = new Date(block.date).toLocaleDateString('en', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <>
            <div className="flex flex-col md:flex-row gap-5 md:gap-7 lg:gap-10 bg-lighter rounded-[14px] p-3 w-full mx-auto">
                {/* Image */}
                <div className="w-[250px] h-[250px] rounded-[12px] overflow-hidden shrink-0">
                    <Image
                        src={block.imageUrl}
                        alt={block.title}
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
                                {block.title}
                            </h2>
                            <div className="text-input text-sm">{formattedDate}</div>

                        </div>
                        <p className="text-lg sm:text-xl text-dark mt-6 ">
                            {block.description}
                        </p>
                    </div>
                    <div className="flex gap-2 items-start justify-center md:justify-start">
                        <button
                            onClick={() => setShowDelete(true)}
                            className="bg-red-500 text-white font-semibold rounded-full p-2 sm:!py-2"
                        >
                            <MdDelete size={16} />
                        </button>
                        <button
                            onClick={() => setShowPopup(true)}
                            className="bg-primary text-lighter font-semibold rounded-full p-2 sm:!py-2"
                        >
                            <MdEdit size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <Popup
                show={showDelete}
                onClose={() => setShowDelete(false)}
            >
                <DeleteBlogPopup onClose={() => setShowDelete(false)} />
            </Popup>


            {/* Popup */}
            <Popup
                show={showPopup}

                onClose={() => setShowPopup(false)}
                className="w-full md:w-[540px]"
                headerContent={
                    <p className="text-[24px] font-bold text-dark text-center">
                        {block.title}
                    </p>
                }
            >
                <BlogEditForm

                    initialData={{
                        title: block.title,
                        description: block.description,
                        image: { url: block.imageUrl },
                        date: typeof block.date === 'string' ? block.date : block.date.toISOString().split('T')[0],
                    }}
                    onCancel={() => setShowPopup(false)}
                    onAction={(data) => {
                        console.log('Updated blog:', data);
                        setShowPopup(false);
                    }}

                />
            </Popup>

        </>
    );
}




interface DeleteBlogPopupProps {
    onClose: () => void;
}

function DeleteBlogPopup({ onClose }: DeleteBlogPopupProps) {
    const t = useTranslations('dashboard.admin.blog');

    return (
        <ActionPopup
            title={t('delete.title')}
            subtitle={t('delete.subtitle')}
            MainIcon={FaRegNewspaper}
            mainIconColor="#FD5257"
            cancelText={t('delete.cancel')}
            actionText={t('delete.actionText')}
            onCancel={onClose}
            onAction={() => onClose()}
        />
    );
}