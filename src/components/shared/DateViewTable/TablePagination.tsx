'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { updateUrlParams } from '@/utils/helpers';
import Pagination from './Pagination';

interface PaginationControllerProps {
    pageCount: number;
    pageSize: number;
    total: number;
}

export default function TablePagination({ pageCount, pageSize, total }: PaginationControllerProps) {
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
    const endEntry = Math.min(currentPage * pageSize, total);

    if (total === 0) return null;

    return (
        <div className={cn(
            "flex justify-between items-center gap-6 pt-8 mt-4",
            "flex-col-reverse lg:flex-row",
            "border-t border-gray/10 animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out"
        )}>
            {/* 1. Pagination Controls */}
            <div className="flex-1 w-full lg:w-auto flex justify-center lg:justify-start">
                {pageCount > 1 ? (
                    <Pagination
                        currentPage={currentPage}
                        pageCount={pageCount}
                        onPageChange={handlePageChange}
                    />
                ) : (
                    <div className="h-10" /> // Maintain height consistency
                )}
            </div>

            {/* 2. Premium Entry Info Badge */}
            <div className={cn(
                "group flex items-center gap-3 px-5 py-2.5 rounded-2xl",
                "bg-dashboard-bg border border-gray/15 shadow-sm",
                "transition-all duration-200 hover:border-secondary/30 hover:shadow-md"
            )}>
                {/* Visual Status Indicator */}
                <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-20"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                </div>

                <div className="flex items-center gap-1.5 text-sm font-semibold text-dark/70">
                    <span className="hidden sm:inline opacity-60 font-medium">
                        {t('showingEntries', { start: '', end: '', total: '' }).split(' ')[0]}
                    </span>

                    {/* Primary Highlighted Numbers */}
                    <div className="flex items-center gap-1 bg-secondary/5 px-2 py-0.5 rounded-lg border border-secondary/10">
                        <span className="text-primary font-bold tabular-nums tracking-tight">
                            {startEntry}
                        </span>
                        <span className="text-secondary/40 font-light">-</span>
                        <span className="text-primary font-bold tabular-nums tracking-tight">
                            {endEntry}
                        </span>
                    </div>

                    <span className="opacity-40 font-light mx-0.5">{t('of') || '/'}</span>

                    <span className="text-dark font-bold tabular-nums">
                        {total}
                    </span>
                </div>
            </div>
        </div>
    );
}