'use client'
import SearchField from "@/components/shared/forms/SearchField";
import { MessageCard } from "./MessageCard";
import { useTranslations } from "next-intl";
import { useState } from "react";
import TablePagination from "@/components/shared/DateViewTable/TablePagination";
import SectionHeading from "../../SectionHeading";


const mockedMessages = [
    {
        userName: 'Angela Moss',
        phone: '+12 345 6789 0',
        email: 'angelamoss@mail.com',
        description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
    },
    {
        userName: 'Bassem Youssef',
        phone: '+20 101 234 5678',
        email: 'bassem.youssef@mail.com',
        description:
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type.",
    },
    {
        userName: 'Layla Hassan',
        phone: '+44 7700 900123',
        email: 'layla.hassan@mail.com',
        description:
            "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    },
    {
        userName: 'Omar El-Sharif',
        phone: '+33 612 345 678',
        email: 'omar.elsharif@mail.com',
        description:
            "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in classical Latin literature.",
    },
    {
        userName: 'Angela Moss',
        phone: '+12 345 6789 0',
        email: 'angelamoss@mail.com',
        description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
    },
    {
        userName: 'Bassem Youssef',
        phone: '+20 101 234 5678',
        email: 'bassem.youssef@mail.com',
        description:
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type.",
    },
    {
        userName: 'Layla Hassan',
        phone: '+44 7700 900123',
        email: 'layla.hassan@mail.com',
        description:
            "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    },
    {
        userName: 'Omar El-Sharif',
        phone: '+33 612 345 678',
        email: 'omar.elsharif@mail.com',
        description:
            "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in classical Latin literature.",
    },

];


export default function ContactGrid() {
    const t = useTranslations('dashboard.admin.contactUs');
    const [search, setSearch] = useState('');
    const pageSize = 2;
    const totalRowsCount = mockedMessages.length;
    const pageCount = Math.ceil(totalRowsCount / pageSize);
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <SectionHeading title={t('title')} />
                <SearchField
                    value={search}
                    onChange={setSearch}
                    searchPlaceholder={t('searchPlaceholder')}
                    className="lg:!max-w-[510px]"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {mockedMessages.map((msg, index) => (
                    <MessageCard key={index} {...msg} />
                ))}
            </div>
            <div className="flex justify-center">
                <TablePagination
                    pageCount={pageCount}
                    pageSize={pageSize}
                    totalRowsCount={totalRowsCount}
                />
            </div>
        </div>
    );
}