'use client'
import Pagination from "@/components/molecules/DateViewTable/Pagination";
import EmptyState from "@/components/atoms/EmptyState";
import { usePathname, useRouter } from "@/i18n/navigation";
import api from "@/libs/axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { IoBedOutline } from "react-icons/io5";
import { LuBath, LuMove } from "react-icons/lu";
import { Property } from "@/types/dashboard/properties";
import { resolveUrl } from "@/utils/upload";
import { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { LiaCouchSolid } from "react-icons/lia";
import Tooltip from "@/components/atoms/Tooltip";
import FilterProperties from "./FilterProperties";
import { FilterState } from "@/constants/properties/constant";
import { FilterProvider, useFilter } from "@/hooks/properties/useFilterProperties";
import { useDebounce } from "@/hooks/useDebounce";


const mapFiltersToDto = (filters: FilterState, page: string | number) => {
    const dto: any = {
        page: page.toString(),
        limit: "12",
    };

    // Helper to only add defined/non-empty values

    const addIfValid = (dtoKey: string, value: any, transform?: (v: any) => any) => {
        // Only add if value is not 'all', not empty, and not the initial zero/max defaults if you prefer
        if (value !== undefined && value !== null && value !== 'all' && value !== '') {
            if (Array.isArray(value) && value.length === 0) return;
            dto[dtoKey] = transform ? transform(value) : value;
        }
    };


    addIfValid("stateId", filters.location);
    addIfValid("rentType", filters.period);
    addIfValid("propertyType", filters.type);
    addIfValid("subTypes", filters.subtype, (v) => v.join(",")); // backend expects comma string
    addIfValid("features", filters.features, (v) => v.join(","));

    addIfValid("bathroom", filters.bathroom);
    addIfValid("bedroom", filters.bedroom);
    addIfValid("isFurnished", filters.furnished);

    // Numerical Ranges
    addIfValid("minPrice", filters.priceMin);
    addIfValid("maxPrice", filters.priceMax);
    addIfValid("minArea", filters.scquarefeetMin);
    addIfValid("maxArea", filters.scquarefeetMax);
    addIfValid("minYear", filters.yearBuiltMin);
    addIfValid("maxYear", filters.yearBuiltMax)

    return dto;
};

export default function PropertySearchPage() {
    return (
        <FilterProvider>
            <PropertiesList />
        </FilterProvider>
    );
}

function PropertiesList() {
    const locale = useLocale();
    const t = useTranslations('property')
    const { filters } = useFilter(); // Consume Context
    const { debouncedValue: debouncedFilters } = useDebounce({ value: filters, delay: 300 });
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [properties, setProperties] = useState([]);
    const page = searchParams.get('page') || 1;
    const [pagination, setPagination] = useState({
        limit: 15,
        total: 0,
        totalPages: 1,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            console.log('loading')
            setLoading(true);
            try {
                const dtoParams = mapFiltersToDto(debouncedFilters, page);
                const queryString = new URLSearchParams(dtoParams).toString();

                const res = await api.get(`/properties/search?${queryString}`);
                const { records, pagination: serverPagination } = res.data;

                setProperties(records);
                setPagination(p => ({
                    ...p,
                    total: serverPagination.total,
                    totalPages: serverPagination.totalPages,
                }));
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, [debouncedFilters, page]);


    const handlePageChange = (page: number) => {

        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };


    return (

        <section className="mt-28 mx-2">
            <div className="container ">
                <div className="flex flex-col gap-4 md:gap-6 mb-10 lg:grid lg:grid-cols-[335px_1fr]">
                    <div className="z-[45] relative max-sm:w-full max-sm:max-w-[416px] max-sm:mx-auto flex justify-between lg:block">
                        <FilterProperties />
                        <h1 className="block lg:hidden text-2xl md:text-4xl text-dark font-bold">
                            {t("filter.header")}
                        </h1>
                    </div>
                    <div className="flex-1 flex flex-col">
                        <h1 className="hidden lg:block pb-4 text-3xl md:text-4xl text-dark font-bold">
                            {t("filter.header")}
                        </h1>
                        {loading ? (
                            <div className="flex-1">

                                <PropertyGridSkeleton />
                            </div>
                        ) : !loading && !properties?.length ? (
                            <EmptyState title={t("grid.emptyTitle")} message={t("grid.emptyMessage")} />
                        ) :
                            (<div className="flex-1 flex flex-col gap-2">
                                <div className="flex-1">
                                    <div className="grid grid-cols-12 gap-4 xl:gap-5">
                                        {properties.map((property) => (
                                            <div key={property.id} className="col-span-12 sm:col-span-6 xl:col-span-4 2xl:col-span-3">
                                                <PropertyCardGrid property={property} locale={locale} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mx-auto">
                                    <Pagination currentPage={Number(page)} pageCount={pagination.totalPages} onPageChange={handlePageChange} />
                                </div>
                            </div>)}
                    </div>
                </div>
            </div>
        </section>

    );
}


export type PropertyGrid = {
    id: string;
    title: string;
    address: string;
    price: number;
    imageUrl: string;
    location: string;
    bathrooms: number;
    bedrooms: number;
    garages: number;
    totalArea: number;
    slug: string;
};

function PropertyCardGrid({ property }: { property: Property; locale: string }) {
    const tEnums = useTranslations("property.enums");
    const t = useTranslations('property')
    // Get primary image or fallback to first image
    const displayImage = property.images?.find(img => img.is_primary)?.url || property.images?.[0]?.url;

    return (

        <div className="h-full relative max-w-[416px] rounded-[5px] w-full mx-auto flex flex-col transition hover:shadow-2xl hover:-translate-y-1 bg-white"
            style={{ boxShadow: "0px 4px 10px 0px #00000012" }}>
            <div className="relative h-[250px] overflow-hidden rounded-t-[5px]">
                <Image
                    src={displayImage ? resolveUrl(displayImage) : '/placeholder-property.jpg'}
                    alt={property.name}
                    fill
                    className="object-cover image-scale"
                />
            </div>

            <div className="flex-1 flex flex-col gap-2 p-4">
                <Link href={`/properties/${property.slug}`} className="block font-semibold text-lg text-dark hover:text-primary transition truncate">
                    {property.name}
                </Link>

                {/* Show Complex Name or Location Code */}
                <p className="text-sm text-gray-500 truncate">
                    {property.complexName || property.nationalAddressCode}
                </p>

                {/* Price and Rent Type */}
                <div className="flex items-baseline gap-1 mt-1">
                    <p className="text-primary font-bold text-xl lg:text-[22px]">
                        {Number(property.rentPrice).toLocaleString()}
                        <span className="text-sm font-medium ms-1">SAR</span>
                    </p>
                    <span className="text-gray-400 text-sm font-medium">
                        / {tEnums(`rentType.${property.rentType}`)}
                    </span>
                </div>

                <div className="grid grid-cols-4 gap-3 justify-between items-end border-t border-[#7A74741A] pt-[10px]">
                    <InfoWithTooltip
                        icon={<IoBedOutline size={21} />}
                        label={t('grid.bedrooms')}
                        value={property.facilities.bathrooms}
                    />
                    <InfoWithTooltip
                        icon={<LuBath size={21} />}
                        label={t('grid.bathrooms')}
                        value={property.facilities.bathrooms}
                    />

                    <InfoWithTooltip
                        icon={
                            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.5202 0.5H4.14683C3.13601 0.501763 2.1671 0.904089 1.45234 1.61885C0.737585 2.3336 0.335259 3.30252 0.333496 4.31333V16.6867C0.335259 17.6975 0.737585 18.6664 1.45234 19.3812C2.1671 20.0959 3.13601 20.4982 4.14683 20.5H16.5202C17.531 20.4982 18.4999 20.0959 19.2146 19.3812C19.9294 18.6664 20.3317 17.6975 20.3335 16.6867V4.31333C20.3317 3.30252 19.9294 2.3336 19.2146 1.61885C18.4999 0.904089 17.531 0.501763 16.5202 0.5ZM19.0002 16.6867C18.9984 17.3439 18.7366 17.9736 18.2718 18.4383C17.8071 18.9031 17.1774 19.1649 16.5202 19.1667H4.14683C3.48963 19.1649 2.85986 18.9031 2.39515 18.4383C1.93044 17.9736 1.66859 17.3439 1.66683 16.6867V4.31333C1.66859 3.65614 1.93044 3.02636 2.39515 2.56165C2.85986 2.09694 3.48963 1.83509 4.14683 1.83333H16.5202C17.1774 1.83509 17.8071 2.09694 18.2718 2.56165C18.7366 3.02636 18.9984 3.65614 19.0002 4.31333V16.6867Z" fill="var(--primary)" />
                                <path d="M16.9328 11.8492C16.7384 11.8492 16.5518 11.9264 16.4143 12.064C16.2768 12.2015 16.1995 12.388 16.1995 12.5825V15.3325L5.50018 4.63317H8.25018C8.44467 4.63317 8.6312 4.55591 8.76872 4.41838C8.90625 4.28086 8.98351 4.09433 8.98351 3.89984C8.98351 3.70535 8.90625 3.51882 8.76872 3.38129C8.6312 3.24377 8.44467 3.1665 8.25018 3.1665H3.50551C3.37131 3.1665 3.24261 3.21981 3.14772 3.31471C3.05282 3.4096 2.99951 3.5383 2.99951 3.6725V8.41717C2.99951 8.61166 3.07677 8.79819 3.2143 8.93572C3.35183 9.07324 3.53835 9.1505 3.73285 9.1505C3.92734 9.1505 4.11386 9.07324 4.25139 8.93572C4.38892 8.79819 4.46618 8.61166 4.46618 8.41717V5.66717L15.1655 16.3665H12.4155C12.221 16.3665 12.0345 16.4438 11.897 16.5813C11.7594 16.7188 11.6822 16.9053 11.6822 17.0998C11.6822 17.2943 11.7594 17.4809 11.897 17.6184C12.0345 17.7559 12.221 17.8332 12.4155 17.8332H17.1602C17.2944 17.8332 17.4231 17.7799 17.518 17.685C17.6129 17.5901 17.6662 17.4614 17.6662 17.3272V12.5825C17.6662 12.388 17.5889 12.2015 17.4514 12.064C17.3139 11.9264 17.1273 11.8492 16.9328 11.8492Z" fill="var(--primary)" />
                            </svg>
                        }
                        label={t('grid.totalArea')}
                        value={property.area}
                    />
                    <InfoWithTooltip
                        icon={<LiaCouchSolid size={22} />}
                        label={t('grid.livingRooms')}
                        value={property.facilities.livingRooms}
                    />
                </div>

            </div>
        </div>

    );
}


type InfoWithTooltipProps = {
    icon: ReactNode;
    label: string;
    value: string | number;
};

function InfoWithTooltip({ icon, label, value }: InfoWithTooltipProps) {
    const cleanValue = typeof value === 'number'
        ? Math.trunc(value)
        : (!isNaN(Number(value)) && value !== '')
            ? Math.trunc(Number(value))
            : value;

    return (
        <Tooltip content={`${label} ${cleanValue}`}>
            <div className="flex flex-col gap-1 relative max-w-full">
                <div className="flex gap-2 items-center">
                    <div className="shrink-0 text-primary">{icon}</div>
                    <span className="text-sm">{cleanValue}</span>
                </div>
                <span className="text-input font-medium text-[13px] truncate peer">{label}</span>
            </div>
        </Tooltip>
    );
}


function PropertyGridSkeleton() {
    return (
        <div className="grid grid-cols-12 gap-4 xl:gap-5">
            {[...Array(16)].map((_, i) => (
                <div key={i} className="col-span-12 sm:col-span-6 xl:col-span-4 2xl:col-span-3">
                    <div
                        className="h-full relative max-w-[416px] rounded-[5px] w-full mx-auto flex flex-col bg-white overflow-hidden"
                        style={{ boxShadow: "0px 4px 10px 0px #00000012" }}
                    >
                        {/* Image Placeholder */}
                        <div className="h-[250px] w-full bg-gray-200 animate-pulse" />

                        <div className="flex-1 flex flex-col gap-3 p-4">
                            {/* Title Placeholder */}
                            <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded" />

                            {/* Complex Name Placeholder */}
                            <div className="h-4 w-1/2 bg-gray-100 animate-pulse rounded" />

                            {/* Price Placeholder */}
                            <div className="h-7 w-1/3 bg-gray-200 animate-pulse rounded mt-1" />

                            {/* Info Grid Placeholder */}
                            <div className="grid grid-cols-4 gap-3 border-t border-gray-50 pt-[15px] mt-2">
                                {[...Array(4)].map((_, j) => (
                                    <div key={j} className="flex flex-col gap-2">
                                        <div className="h-5 w-5 bg-gray-100 animate-pulse rounded-full" />
                                        <div className="h-3 w-8 bg-gray-50 animate-pulse rounded" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}