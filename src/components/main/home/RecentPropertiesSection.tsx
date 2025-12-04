'use client';

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import PropertyCard from "@/components/shared/properties/PropertyCard";
import { useLocale, useTranslations } from 'use-intl';
import SwiperNav from '@/components/shared/SwiperNav';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';

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
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const locale = useLocale();
    const isRTL = locale === 'ar';


    return (
        <section className='rounded-[14px] sm:rounded-[40px] md:rounded-[60px] lg:rounded-[83px]'
            style={{
                background: 'linear-gradient(180deg, var(--light) 0%, var(--lighter) 100%)',
            }}>
            <div className=' mt-10 py-[20px] px-2 sm:p-[40px] md:p-[50px] lg:p-[60px] container'
            >


                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] text-dark">{t('title')}</h1>
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <p className="text-sm sm:text-base text-dark leading-[26px] max-w-[700px]">
                            {t('description')}
                        </p>
                        <SwiperNav
                            currentPage={currentPage}
                            totalPages={totalPages}
                            prevClass="recent-prev"
                            nextClass="recent-next"
                            dir="rtl"
                        />

                    </div>
                </div>

                <div className="mt-[45px] relative">
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


                        loop={true}
                        onInit={(swiper) => {
                            const perView = swiper.params.slidesPerView as number;
                            setTotalPages(Math.ceil(properties.length / perView));
                        }}
                        onSlideChange={(swiper) => {
                            const perView = swiper.params.slidesPerView as number;
                            const page = Math.floor(swiper.realIndex / perView) + 1;
                            setTotalPages(Math.ceil(properties.length / perView));
                            setCurrentPage(page);
                        }}
                        className="swiper"
                    >
                        {properties.map((property) => (
                            <SwiperSlide key={property.id} >
                                <PropertyCard
                                    property={{
                                        id: property.id,
                                        title: property.title[locale as 'ar' | 'en'],
                                        address: property.address[locale as 'ar' | 'en'],
                                        price: property.price,
                                        imageUrl: property.imageUrl,
                                    }}
                                    locale={locale as 'ar' | 'en'}
                                />
                            </SwiperSlide>
                        ))}

                    </Swiper>
                </div>
            </div>
        </section>
    );
}

 
 
 