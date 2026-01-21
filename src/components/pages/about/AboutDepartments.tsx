'use client';

import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useTranslations } from "next-intl";
import { Department } from "@/types/company";
import { resolveUrl } from "@/utils/upload";
import NavigationButtons from "@/components/atoms/NavigationButtons";
import Image from "next/image";
import ImageAlt from "@/components/atoms/ImageAlt";
import { cn } from "@/lib/utils"; // Assuming you have this utility from previous steps

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
            <div className="relative mb-12" data-aos="fade-up">
                <div className="flex flex-col gap-4 mb-8">
                    <div className="h-[4px] w-[90px] bg-primary rounded-full"></div>
                    <h1 className="text-3xl text-secondary">
                        <span className="font-medium">{t('meetOur')}</span>{' '}
                        <span className="font-bold">{t('department')}</span>
                    </h1>
                </div>
                <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <p className="text-gray-500 font-medium">{t('noDepartmentsAvailable') || 'No departments available at the moment.'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative mb-16 group" data-aos="fade-up">
            {/* Section Header */}
            <div className="flex flex-col gap-4 mb-10">
                <div className="h-[4px] w-[90px] bg-primary rounded-full animate-pulse"></div>
                <h1 className="text-3xl md:text-4xl text-secondary">
                    <span className="font-medium">{t('meetOur')}</span>{' '}
                    <span className="font-bold text-primary">{t('department')}</span>
                </h1>
            </div>

            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                slidesPerView={1}
                speed={800} // Smoother transition speed
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                }}
                navigation={{
                    nextEl: ".department-next",
                    prevEl: ".department-prev",
                }}
                pagination={{
                    clickable: true,
                    el: '.custom-pagination',
                    bulletClass: 'w-3 h-3 bg-gray-300 rounded-full cursor-pointer transition-all duration-300 hover:bg-primary/50',
                    bulletActiveClass: '!bg-primary !w-8', // Elongated active bullet
                }}
                spaceBetween={40}
                className="w-full !pb-12" // Add padding bottom for pagination
            >
                {departments.map((item) => (
                    <SwiperSlide key={item.id}>
                        <DepartmentSection
                            imageSrc={resolveUrl(item.imagePath)}
                            title={getLocalizedText(item.title_en, item.title_ar)}
                            title_en={item.title_en}
                            text={getLocalizedText(item.description_en, item.description_ar)}
                            isArabic={isArabic}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Controls Container */}
            <div className="flex items-center justify-between mt-4 px-2">
                <div className="custom-pagination flex gap-2"></div>
                <NavigationButtons
                    prevClassName="department-prev"
                    nextClassName="department-next"
                />
            </div>
        </div>
    );
}

interface DepartmentSectionProps {
    imageSrc: string;
    title: string;
    title_en: string;
    text: string;
    isArabic: boolean;
}

function DepartmentSection({ imageSrc, title, title_en, text, isArabic }: DepartmentSectionProps) {
    return (
        <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12 bg-white rounded-3xl p-2 lg:p-0">

            {/* Image Card */}
            <div className="relative w-full lg:w-[45%] h-[280px] md:h-[350px] lg:h-[400px] shrink-0 group overflow-hidden rounded-2xl shadow-lg transform transition-all hover:shadow-2xl">
                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                ) : (
                    <ImageAlt title={title_en} />
                )}

                {/* Modern Gradient Overlay */}
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80" /> */}

                {/* Title on Image (Mobile/Tablet view mostly, or artistic choice) */}
                <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-white text-2xl font-bold translate-y-2 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        {title}
                    </h3>
                    <div className="h-1 w-12 bg-primary mt-3 rounded-full origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100"></div>
                </div>
            </div>

            {/* Text Content */}
            <div className="flex-1 flex flex-col justify-center py-4 lg:py-8 relative">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10" />

                <div className="relative px-6 py-4">
                    {/* Opening Quote */}
                    <div className="absolute top-0 left-0 lg:-left-2 text-primary/20 transform -translate-y-1/2">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
                        </svg>
                    </div>

                    <p className={`font-inter font-normal text-lg md:text-[19px] leading-relaxed text-gray-600 text-justify relative z-10 ${isArabic ? 'font-arabic' : ''}`}>
                        {text}
                    </p>

                    {/* Closing Quote */}
                    <div className="absolute bottom-0 right-0 lg:-right-2 text-primary/20 transform translate-y-1/2">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="rotate-180">
                            <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}