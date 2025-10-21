'use client'

import SecondaryButton from "@/components/shared/buttons/SecondaryButton";
import SectionHeading from "../../SectionHeading";
import BlogContentCard from "./BlogContentCard";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Popup from "@/components/shared/Popup";
import BlogEditForm, { BlogFormType } from "./BlogEditForm";


const blogBlocks = [
    {
        id: '1',
        imageUrl: '/blogs/blog-1.jpg',
        title: 'Lorem Ipsum is simply dummy text',
        description:
            'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Et odit, minus, nostrum nobis',
        date: '2023-03-16',
    },
    {
        id: '2',
        imageUrl: '/blogs/blog-2.jpg',
        title: 'Another Blog Title',
        description:
            'Dolorem accusamus quis eligendi! Lorem Ipsum is simply dummy text of the printing',
        date: new Date(),
    },
    {
        id: '3',
        imageUrl: '/blogs/blog-3.jpg',
        title: 'New Insights into Real Estate Trends',
        description:
            'Discover how market shifts and digital platforms are reshaping property investment in 2025',
        date: '2025-10-21',
    },
];

export default function BlogsGrid() {
    const t = useTranslations('dashboard.admin.blog');
    const [showAdd, setShowAdd] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <SectionHeading title={t('title')} />
                <SecondaryButton
                    onClick={() => setShowAdd(true)}
                    className="bg-secondary hover:bg-secondary-hover font-semibold text-lighter sm:!py-2"
                >
                    {t('add')}
                </SecondaryButton>
            </div>

            <div className="space-y-4">
                {blogBlocks.map((block, index) => (
                    <BlogContentCard key={index} block={block} />
                ))}
            </div>

            <Popup

                show={showAdd}
                onClose={() => setShowAdd(false)}
                className="w-full md:w-[540px]"
                headerContent={
                    <p className="text-[24px] font-bold text-dark text-center">
                        {t('add')}
                    </p>
                }
            >
                <BlogEditForm

                    onCancel={() => setShowAdd(false)}
                    onAction={(data: BlogFormType) => {
                        console.log('New blog added:', data);
                        setShowAdd(false);
                        // Optionally push to blogBlocks or trigger a refetch
                    }}

                />
            </Popup>
        </div>
    );
}