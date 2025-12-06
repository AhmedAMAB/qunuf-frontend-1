'use client'
import PrimaryButton from "@/components/shared/buttons/PrimaryButton";
import PropertyCategoryCard from "@/components/shared/properties/PropertyCategoryCard";
import SwiperNav from "@/components/shared/SwiperNav";
import { useState } from "react";
import { useLocale, useTranslations } from "use-intl";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { usePathname, useSearchParams } from "next/navigation";
import PropertyCategorySkeleton from "@/components/shared/properties/PropertyCategorySkeleton";
import { useIndicatorPosition } from "@/hooks/useIndicatorPosition";
import { updateUrlParams } from "@/utils/helpers";

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
        imageUrl: "/properties/property-4.jpg",
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
        imageUrl: "/properties/property-5.jpg",
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
        imageUrl: "/properties/property-6.jpg",
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
        imageUrl: "/properties/property-7.jpg",
    },

];

type category = 'house' | 'realEstate' | 'apartment'

export default function PropertyCategorySection() {
    const searchParams = useSearchParams();
    const locale = useLocale();
    const pathname = usePathname();
    const t = useTranslations('homePage.propertyCategory');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [activeCategory, setActiveCategory] = useState<category>(searchParams.get("category") as category || 'house');
    const activeSelector = `[data-category="${activeCategory}"]`;
    const indicatorRef = useIndicatorPosition(activeSelector);

    const [loading] = useState(false);
    const isRTL = locale === 'ar';



    const handleFilterClick = (value: category) => {

        const params = new URLSearchParams(searchParams.toString());
        params.set("category", value);
        setActiveCategory(value)

        updateUrlParams(pathname, params);
    };


    return (
        <section className="mt-10 ">
            <div className="py-[20px] px-2 sm:p-[40px] md:p-[50px] lg:p-[60px] bg-white container">


                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] text-dark">{t('title')}</h1>
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <p className="text-sm sm:text-base text-dark leading-[26px] max-w-[700px]">
                            {t('description')}
                        </p>
                        <div className="relative border border-secondary p-2 rounded-full flex flx gap-2">
                            <div
                                ref={indicatorRef}
                                className="absolute bg-secondary transition-all duration-300 ease-in-out rounded-full z-0 will-change-transform"
                            />
                            <PrimaryButton
                                data-category="house"
                                className={`text-nowrap transition-colors z-[1] ${activeCategory === 'house' ? 'text-white' : 'text-black'}`}
                                onClick={() => handleFilterClick('house')}
                            >
                                {t('filters.house')}
                            </PrimaryButton>

                            <PrimaryButton
                                data-category="realEstate"
                                className={`text-nowrap transition-colors z-[1] ${activeCategory === 'realEstate' ? 'text-white' : 'text-black'}`}
                                onClick={() => handleFilterClick('realEstate')}
                            >
                                {t('filters.realEstate')}
                            </PrimaryButton>

                            <PrimaryButton
                                data-category="apartment"
                                className={`text-nowrap transition-colors z-[1] ${activeCategory === 'apartment' ? 'text-white' : 'text-black'}`}
                                onClick={() => handleFilterClick('apartment')}
                            >
                                {t('filters.apartment')}
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
                <div className=" mt-[45px]  bg-white ">

                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={20}
                        navigation={{
                            nextEl: isRTL ? '.category-prev' : '.category-next',
                            prevEl: isRTL ? '.category-next' : '.category-prev',
                        }}

                        breakpoints={{

                            0: { slidesPerView: 1 },
                            1020: { slidesPerView: 2 },
                            1280: { slidesPerView: 3 },

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
                        {loading
                            ? Array.from({ length: 3 }).map((_, i) => (
                                <SwiperSlide key={`skeleton-${i}`}>
                                    <PropertyCategorySkeleton />
                                </SwiperSlide>
                            ))
                            : properties.map((property) => (
                                <SwiperSlide key={property.id}>
                                    <PropertyCategoryCard
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
                <div className="flex-center mt-[40px]">

                    <SwiperNav
                        currentPage={currentPage}
                        totalPages={totalPages}
                        prevClass="category-prev"
                        nextClass="category-next"
                        dir="rtl"
                    />

                </div>
            </div>
        </section>
    );
}