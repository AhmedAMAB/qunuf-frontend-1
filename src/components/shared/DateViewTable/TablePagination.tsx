'use client';

import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Pagination from './Pagination';
import { updateUrlParams } from '@/utils/helpers';
import { useTranslations } from 'next-intl';

interface PaginationControllerProps {
    pageCount: number;
    pageSize: number;
    totalRowsCount: number;
}

export default function TablePagination({ pageCount, pageSize, totalRowsCount }: PaginationControllerProps) {

    const t = useTranslations('dashboard.pagination');
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const currentPage = Number(searchParams.get('page')) || 1;

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        updateUrlParams(pathname, params);
    };

    const startEntry = (currentPage - 1) * pageSize + 1;
    const endEntry = Math.min(currentPage * pageSize, totalRowsCount);

    return (
        totalRowsCount > 0 && (
            <div className="flex justify-between flex-col-reverse flex-nowrap lg:flex-row lg:items-center gap-3 pt-5 lg:pt-7 mb-2">
                {pageCount > 1 ? <Pagination
                    currentPage={currentPage}
                    pageCount={pageCount}
                    onPageChange={handlePageChange}
                /> : <div></div>}
                <span className="text-sm text-dark lg:text-nowrap">
                    {t('showingEntries', {
                        start: startEntry,
                        end: endEntry,
                        total: totalRowsCount
                    })}
                </span>
            </div>
        )
    );
}
