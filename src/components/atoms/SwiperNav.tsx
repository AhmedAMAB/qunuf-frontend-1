// components/atoms/SwiperNav.tsx
'use client';

import { GoArrowLeft, GoArrowRight } from "react-icons/go";

type SwiperNavProps = {
    currentPage: number;
    totalPages: number;
    prevClass: string;   // 👈 prop for prev button class
    nextClass: string;   // 👈 prop for next button class
    dir?: 'rtl' | 'ltr';
};

export default function SwiperNav({
    currentPage,
    totalPages,
    prevClass,
    nextClass,
    dir = 'ltr',
}: SwiperNavProps) {
    return (
        <div className="flex gap-4 items-center" dir={dir}>
            {/* Prev button */}
            <button
                className={`${totalPages === 1 ? 'opacity-30 pointer-events-none' : ''} ${prevClass} !block text-primary w-[60px] sm:w-[80px] lg:w-[100px] py-2 sm:py-3 lg:py-4 px-4 sm:px-6 lg:px-8 border border-primary rounded-[70px] flex-center`}
            >
                <GoArrowRight size={24} />
            </button>

            {/* Counter */}
            <div className="text-black">
                <span className="font-bold">
                    {String(currentPage).padStart(2, '0')}
                </span>
                /
                <span>{String(totalPages).padStart(2, '0')}</span>
            </div>

            {/* Next button */}
            <button
                className={`${totalPages === 1 ? 'opacity-30 pointer-events-none' : ''} ${nextClass} !block text-primary w-[60px] sm:w-[80px] lg:w-[100px] py-2 sm:py-3 lg:py-4 px-4 sm:px-6 lg:px-8 border border-primary rounded-[70px] flex-center`}
            >
                <GoArrowLeft size={24} />
            </button>
        </div>
    );
}
