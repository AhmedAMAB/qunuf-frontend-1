'use client';

import React from 'react';
import { generatePagination } from '@/utils/helpers';
import { GoArrowLeft, GoArrowRight } from 'react-icons/go';
import { LuArrowLeftToLine, LuArrowRightToLine } from 'react-icons/lu';
import PaginationButton from './PaginationButton';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface PaginationProps {
    currentPage: number;
    pageCount: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, pageCount, onPageChange }: PaginationProps) {
    const t = useTranslations('dashboard.pagination');

    if (pageCount <= 1) return null;

    return (
        <div className="flex items-center justify-center flex-wrap gap-2">
            {/* First Page */}
            <PaginationButton
                label={t('firstPage')}
                icon={<LuArrowLeftToLine size={18} className="rtl:rotate-180" />}
                isDisabled={currentPage === 1}
                currentPage={currentPage}
                onPageChange={() => onPageChange(1)}
            />

            {/* Previous Page */}
            <PaginationButton
                label={t('previous')}
                icon={<GoArrowLeft size={18} className="rtl:rotate-180" />}
                isDisabled={currentPage === 1}
                currentPage={currentPage}
                onPageChange={() => onPageChange(currentPage > 1 ? currentPage - 1 : 1)}
            />

            {/* Page Numbers */}
            <div className="flex items-center gap-1.5">
                {generatePagination(currentPage, pageCount).map((item, idx) =>
                    item === '...' ? (
                        <span
                            key={idx}
                            className="px-3 py-2 text-sm font-bold text-secondary/60"
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            key={idx}
                            onClick={() => onPageChange(Number(item))}
                            className={cn(
                                "relative min-w-[40px] min-h-[40px] px-3 py-2 rounded-xl",
                                "text-sm font-semibold transition-all duration-200",
                                "active:scale-95",
                                currentPage === item
                                    ? "bg-gradient-to-br from-secondary to-primary text-white shadow-md hover:shadow-lg"
                                    : "bg-white border border-gray/20 text-dark hover:border-secondary hover:bg-secondary/5 hover:shadow-sm"
                            )}
                        >
                            {/* Active page glow effect */}
                            {currentPage === item && (
                                <div className="absolute -inset-1 bg-gradient-to-br from-secondary/30 to-primary/30 rounded-xl blur-md -z-10" />
                            )}
                            <span className="relative">{item}</span>
                        </button>
                    )
                )}
            </div>

            {/* Next Page */}
            <PaginationButton
                label={t('next')}
                iconPosition="right"
                icon={<GoArrowRight size={18} className="rtl:rotate-180" />}
                isDisabled={currentPage === pageCount}
                currentPage={currentPage}
                onPageChange={() => onPageChange(currentPage < pageCount ? currentPage + 1 : pageCount)}
            />

            {/* Last Page */}
            <PaginationButton
                label={t('lastPage')}
                iconPosition="right"
                icon={<LuArrowRightToLine size={18} className="rtl:rotate-180" />}
                isDisabled={currentPage === pageCount}
                currentPage={currentPage}
                onPageChange={() => onPageChange(pageCount)}
            />
        </div>
    );
}