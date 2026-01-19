'use client'

import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useTranslations } from "next-intl";
import { Department } from "@/types/company";
import { resolveUrl } from "@/utils/upload";
import NavigationButtons from "@/components/shared/NavigationButtons";
import Image from "next/image";
import ImageAlt from "@/components/shared/ImageAlt";

interface AboutDepartmentsProps {
    departments: Department[];
    isArabic: boolean;
}

export default function AboutDepartments({ departments, isArabic }: AboutDepartmentsProps) {
    const t = useTranslations("about");

    // Helper function to get localized text
    const getLocalizedText = (en: string, ar: string) => isArabic ? ar : en;


    // Show empty state if no departments
    if (!departments || departments.length === 0) {
        return (
            <div className="relative mb-2">
                <div className="flex flex-col gap-4 mb-[24px]">
                    <div className="h-[3px] w-[90px] bg-primary"></div>
                    <h1 className="text-2xl text-secondary">
                        <span className="font-medium">{t('meetOur')}</span>{' '}
                        <span className="font-bold">{t('department')}</span>
                    </h1>
                </div>
                <div className="text-center text-gray-500 py-8">
                    <p>{t('noDepartmentsAvailable') || 'No departments available at the moment.'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative mb-2" data-aos="fade-up">
            <div className="flex flex-col gap-4 mb-[24px]">
                <div className="h-[3px] w-[90px] bg-primary"></div>
                <h1 className="text-2xl text-secondary">
                    <span className="font-medium">{t('meetOur')}</span>{' '}
                    <span className="font-bold">{t('department')}</span>
                </h1>
            </div>

            <Swiper
                modules={[Navigation, Pagination]}
                slidesPerView={1}
                navigation={{
                    nextEl: ".department-next",
                    prevEl: ".department-prev",
                }}
                pagination={{
                    clickable: true,
                    el: '.custom-pagination',
                    bulletClass: 'custom-bullet',
                    bulletActiveClass: 'custom-bullet-active',
                }}
                spaceBetween={20}
                className="w-full"
            >
                {departments.map((item) => (
                    <SwiperSlide key={item.id}>
                        <DepartmentSection
                            imageSrc={resolveUrl(item.imagePath)}
                            title={getLocalizedText(item.title_en, item.title_ar)}
                            title_en={item.title_en}
                            text={getLocalizedText(item.description_en, item.description_ar)}
                        />
                    </SwiperSlide>
                ))}

            </Swiper>
            <div className="custom-pagination flex gap-2 justify-center mt-6"></div>


            <NavigationButtons prevClassName="department-prev" nextClassName="department-next" />

        </div>

    );
}


interface DepartmentSectionProps {
    imageSrc: string;
    title: string;
    title_en: string;
    text: string;
}

function DepartmentSection({ imageSrc, title, title_en, text }: DepartmentSectionProps) {
    return (
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-[30px]">
            {/* Image with overlay */}
            <div className="relative w-full max-w-[513px] h-[240px] md:h-[300px] lg:h-[357px] rounded-[4px] overflow-hidden">
                {imageSrc ? <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover rounded-[4px] opacity-95 mix-blend-multiply"
                /> : (
                    <ImageAlt title={title_en} />
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0)] to-black opacity-60 rounded-[4px]" />
            </div>
            <Image width={26} height={20} src="/about/quotes.svg" alt="" />
            {/* Text */}
            <div className="flex-1 flex flex-col gap-6 justify-between min-h-full">
                <p className="font-inter font-normal text-[16px] md:text-[18px] lg:text-[20px] leading-[35px] text-[#363636] text-justify">
                    {text}
                </p>
                <div className="mx-auto w-fit ">
                    <Image width={26} height={20} src="/about/quotes.svg" alt="" className="scale-x-[-1]" />
                </div>
            </div>
        </div>
    );
}
