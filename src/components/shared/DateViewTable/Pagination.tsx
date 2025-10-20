'use client';

import React from 'react';
import { generatePagination } from '@/utils/helpers';
import { GoArrowLeft, GoArrowRight } from 'react-icons/go';
import { LuArrowLeftToLine, LuArrowRightToLine } from 'react-icons/lu';
import PaginationButton from './PaginationButton';
import { useTranslations } from 'next-intl';

interface PaginationProps {
    currentPage: number;
    pageCount: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, pageCount, onPageChange }: PaginationProps) {
    const t = useTranslations('dashboard.pagination');
    if (pageCount <= 1) return null;

    return (
        <div className="flex text-nowrap lg:justify-center items-center flex-wrap gap-2">
            {/* First Page */}
            <PaginationButton
                label={t('firstPage')}
                icon={<LuArrowLeftToLine size={20} className='rtl:rotate-180' />}
                isDisabled={currentPage === 1}
                currentPage={currentPage}
                onPageChange={() => onPageChange(1)}
            />
            {/* Previous Page */}
            <PaginationButton
                label={t('previous')}
                icon={<GoArrowLeft size={20} className='rtl:rotate-180' />}
                isDisabled={currentPage === 1}
                currentPage={currentPage}
                onPageChange={() => onPageChange(currentPage > 1 ? currentPage - 1 : 1)}
            />

            {/* Page Numbers */}
            <div className="flex text-nowrap justify-center gap-2">
                {generatePagination(currentPage, pageCount).map((item, idx) =>
                    item === '...' ? (
                        <span key={idx} className="lg:px-3 lg:py-2 text-sm  lg:text-base font-bold text-secondary">...</span>
                    ) : (
                        <button
                            key={idx}
                            onClick={() => onPageChange(Number(item))}
                            className={`px-2 py-[6px]  lg:px-3 lg:py-2 text-sm  lg:text-base min-w-[32px] min-h-[32px] lg:min-w-[42px] lg:min-h-[42px] rounded-[8px] duration-300 ${currentPage === item
                                ? 'bg-[var(--primary)] text-white font-semibold'
                                : 'bg-card-bg border border-dark text-dark hover:bg-gray'
                                }`}
                        >
                            {item}
                        </button>
                    )
                )}
            </div>

            {/* Next Page */}
            <PaginationButton
                label={t('next')}
                iconPosition='right'
                icon={<GoArrowRight size={20} className='rtl:rotate-180' />}
                isDisabled={currentPage === pageCount}
                currentPage={currentPage}
                onPageChange={() => onPageChange(currentPage < pageCount ? currentPage + 1 : pageCount)}
            />

            {/* Last Page */}
            <PaginationButton
                label={t('lastPage')}
                iconPosition='right'
                icon={<LuArrowRightToLine size={20} className='rtl:rotate-180' />}
                isDisabled={currentPage === pageCount}
                currentPage={currentPage}
                onPageChange={() => onPageChange(pageCount)}
            />
        </div>
    );
}
