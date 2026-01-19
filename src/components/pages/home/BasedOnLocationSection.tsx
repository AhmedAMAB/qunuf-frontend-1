'use client'

import PropertyCardPreview from "@/components/shared/properties/PropertyCardPreview";
import { useIndicatorPosition } from "@/hooks/useIndicatorPosition";
import api from "@/libs/axios";
import { updateUrlParams } from "@/utils/helpers";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { LuSearchX } from "react-icons/lu";


type RentType = 'yearly' | 'monthly';

export default function BasedOnLocationSection() {
    const locale = useLocale();
    const t = useTranslations('homePage.basedOnLocationSection');
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeRentalType, setActiveRentalType] = useState<RentType>(
        (searchParams.get("rentalType") as RentType) || "monthly"
    );

    const activeSelector = `[data-rent-type="${activeRentalType}"]`;
    const indicatorRef = useIndicatorPosition(activeSelector);

    useEffect(() => {
        const fetchByLocation = async () => {
            setLoading(true);
            try {
                const res = await api.get('/properties/search', {
                    params: {
                        rentType: activeRentalType,
                        limit: 12,
                        sortBy: 'created_at',
                        sortOrder: 'DESC'
                    }
                });
                setProperties(res.data.records || []);
            } catch (error) {
                console.error("Location fetch failed", error);
                setProperties([]);
            } finally {
                setLoading(false);
            }
        };
        fetchByLocation();
    }, [activeRentalType]);

    const handleFilterClick = (value: RentType) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("rentalType", value);
        setActiveRentalType(value);
        updateUrlParams(pathname, params);
    };

    return (
        <section className="mt-[40px] mx-2">
            <div className="container">
                {/* Header */}
                <div className="flex flex-col gap-5 ">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] text-dark font-bold">
                        {t('title')}
                    </h1>
                    <p className="text-sm sm:text-base text-dark leading-[26px] max-w-[700px]">
                        {t('description')}
                    </p>
                </div>

                {/* Rental type toggle */}
                <div className="flex flex-col sm:flex-row gap-4 items-center mt-8">
                    <div className="relative bg-lighter p-1.5 flex rounded-lg shadow-inner">
                        <div
                            ref={indicatorRef}
                            className="absolute bg-secondary transition-all duration-300 ease-in-out rounded-md z-0"
                        />
                        {(['yearly', 'monthly'] as RentType[]).map((type) => (
                            <button
                                key={type}
                                data-rent-type={type}
                                onClick={() => handleFilterClick(type)}
                                className={`relative z-[1] flex items-center justify-center py-2 px-8 rounded-md transition-colors duration-300 font-medium ${activeRentalType === type ? "text-white" : "text-dark"
                                    }`}
                            >
                                {t(type)}
                            </button>
                        ))}
                    </div>
                    <span className="text-dark font-medium opacity-70">{t('rent')}</span>
                </div>

                {/* Content Area */}
                <div className="my-10 min-h-[400px]">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-[450px] w-full bg-gray-100 animate-pulse rounded-[5px]" />
                            ))}
                        </div>
                    ) : properties.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-100 rounded-xl">
                            <LuSearchX size={50} className="text-gray-300 mb-4" />
                            <h3 className="text-lg font-bold text-dark">
                                {locale === 'ar' ? 'لا توجد عقارات متاحة' : 'No properties available'}
                            </h3>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                            {properties.map((property) => (
                                <PropertyCardPreview
                                    key={property.id}
                                    property={{
                                        id: property.id,
                                        title: property.name,
                                        address: property.address,// not exist
                                        location: property.city?.[locale] || property.district?.[locale],// not exist
                                        price: property.rentPrice,
                                        imageUrl: property.images?.[0]?.url,
                                        bathrooms: property.facilities.bathrooms,
                                        bedrooms: property.facilities.bedrooms,
                                        guests: property.capacity,
                                        rate: property.rating || 5,
                                        isMonthly: activeRentalType === 'monthly',
                                        slug: property.slug
                                    }}
                                    locale={locale as 'ar' | 'en'}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}