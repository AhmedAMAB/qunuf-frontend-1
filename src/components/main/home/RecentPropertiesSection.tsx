'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import PropertyCard from "@/components/shared/properties/PropertyCard";
import { useLocale, useTranslations } from 'use-intl';
import SwiperNav from '@/components/shared/SwiperNav';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import api from '@/libs/axios';
import { LuSearchX } from 'react-icons/lu';

const properties = [
    {
        id: "property-1",
        title: {
            ar: "منزل سيكاروانجي",
            en: "Sekarwangi Village",
        },
        address: {
            ar: "2972 طريق ويستهايمر. سانتا آنا، إلينوي 85486",
            en: "2972 Westheimer Rd. Santa Ana, Illinois 85486",
        },
        price: 943.65,
        imageUrl: "/properties/property-7.jpg",
    },
    {
        id: "property-2",
        title: {
            ar: "منزل سيكاروانجي",
            en: "Sekarwangi Village",
        },
        address: {
            ar: "2972 طريق ويستهايمر. سانتا آنا، إلينوي 85486",
            en: "2972 Westheimer Rd. Santa Ana, Illinois 85486",
        },
        price: 943.65,
        imageUrl: "/properties/property-2.jpg",
    },
    {
        id: "property-3",
        title: {
            ar: "منزل سيكاروانجي",
            en: "Sekarwangi Village",
        },
        address: {
            ar: "2972 طريق ويستهايمر. سانتا آنا، إلينوي 85486",
            en: "2972 Westheimer Rd. Santa Ana, Illinois 85486",
        },
        price: 943.65,
        imageUrl: "/properties/property-3.jpg",
    },
    {
        id: "property-4",
        title: {
            ar: "منزل سيكاروانجي",
            en: "Sekarwangi Village",
        },
        address: {
            ar: "2972 طريق ويستهايمر. سانتا آنا، إلينوي 85486",
            en: "2972 Westheimer Rd. Santa Ana, Illinois 85486",
        },
        price: 943.65,
        imageUrl: "/properties/property-4.jpg",
    },
    {
        id: "property-5",
        title: {
            ar: "منزل سيكاروانجي",
            en: "Sekarwangi Village",
        },
        address: {
            ar: "2972 طريق ويستهايمر. سانتا آنا، إلينوي 85486",
            en: "2972 Westheimer Rd. Santa Ana, Illinois 85486",
        },
        price: 943.65,
        imageUrl: "/properties/property-5.jpg",
    },

];

export default function RecentPropertiesSection() {
    const t = useTranslations('homePage.recentProperties');
    const tEnums = useTranslations("property.enums");
    const locale = useLocale();
    const isRTL = locale === 'ar';

    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                // Fetching with limit 5 and sorting by newest
                const res = await api.get('/properties/search', {
                    params: { limit: 5, sortBy: 'created_at', sortOrder: 'DESC' }
                });
                setProperties(res.data.records);
            } catch (error) {
                console.error("Failed to fetch recent properties", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecent();
    }, []);

    return (
        <section className='rounded-[14px] sm:rounded-[40px] lg:rounded-[83px] transition-all'
            style={{ background: 'linear-gradient(180deg, var(--light) 0%, var(--lighter) 100%)' }}>
            <div className='mt-10 py-[40px] lg:p-[60px] container'>

                {/* Header Section */}
                <div>
                    <h1 className="text-2xl sm:text-4xl lg:text-[48px] text-dark font-bold">{t('title')}</h1>
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <p className="text-sm sm:text-base text-dark leading-[26px] max-w-[700px]">
                            {t('description')}
                        </p>
                        {/* Only show Nav if we have properties */}
                        {!loading && properties.length > 0 && (
                            <SwiperNav
                                currentPage={currentPage}
                                totalPages={totalPages}
                                prevClass="recent-prev"
                                nextClass="recent-next"
                                dir={isRTL ? "rtl" : "ltr"}
                            />
                        )}
                    </div>
                </div>

                <div className="mt-[45px] relative">
                    {loading ? (
                        /* Loading Skeletons */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className='w-full h-[484px] rounded-[24px] bg-gray-200/50 animate-pulse' />
                            ))}
                        </div>
                    ) : properties.length === 0 ? (
                        /* Empty State: Not Found */
                        <div className="flex flex-col items-center justify-center py-20 text-center bg-white/30 rounded-[24px] border border-dashed border-gray-300">
                            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                                <LuSearchX size={48} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-dark">
                                {locale === 'ar' ? 'لا توجد عقارات حديثة' : 'No Recent Properties'}
                            </h3>
                            <p className="text-gray-500 mt-2 max-w-xs">
                                {locale === 'ar'
                                    ? 'نحن نقوم بتحديث قائمتنا باستمرار، يرجى العودة قريباً.'
                                    : 'We are constantly updating our list, please check back soon.'}
                            </p>
                        </div>
                    ) : (
                        /* Swiper Slider */
                        <Swiper
                            modules={[Navigation]}
                            spaceBetween={20}
                            navigation={{
                                nextEl: isRTL ? '.recent-prev' : '.recent-next',
                                prevEl: isRTL ? '.recent-next' : '.recent-prev',
                            }}
                            breakpoints={{
                                0: { slidesPerView: 1 },
                                768: { slidesPerView: 2 },
                                1020: { slidesPerView: 3 },
                                1536: { slidesPerView: 4 },
                            }}
                            onSlideChange={(swiper) => {
                                const perView = swiper.params.slidesPerView as number;
                                setCurrentPage(Math.floor(swiper.realIndex / perView) + 1);
                                setTotalPages(Math.ceil(properties.length / perView));
                            }}
                            onInit={(swiper) => {
                                const perView = swiper.params.slidesPerView as number;
                                setTotalPages(Math.ceil(properties.length / perView));
                            }}
                        >
                            {properties.map((property) => (
                                <SwiperSlide key={property.id}>
                                    <PropertyCard
                                        property={{
                                            id: property.id,
                                            title: property.name,
                                            address: `${tEnums(`propertyType.${property.propertyType}`)} - ${tEnums(`rentType.${property.rentType}`)}`,
                                            price: property.rentPrice,
                                            imageUrl: property.images?.find((img: any) => img.is_primary)?.url || property.images?.[0]?.url,
                                            slug: property.slug
                                        }}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
            </div>
        </section>
    );
}