'use client'
import Pagination from "@/components/shared/DateViewTable/Pagination";
import EmptyState from "@/components/shared/EmptyState";
import PropertyCardGrid from "@/components/shared/properties/PropertyCardGrid";
import { usePathname, useRouter } from "@/i18n/navigation";
import api from "@/libs/axios";
import { Property } from "@/types/dashboard/properties";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


const mapParamsToDto = (searchParams: URLSearchParams) => {
    const dto: any = {
        page: searchParams.get("page") || "1",
        limit: "12",
    };

    // Helper to only add defined/non-empty values
    const addIfValid = (dtoKey: string, paramKey: string, transform?: (v: string) => any) => {
        const value = searchParams.get(paramKey);
        if (value && value !== 'all' && value !== 'undefined') {
            dto[dtoKey] = transform ? transform(value) : value;
        }
    };

    addIfValid("stateId", "location");
    addIfValid("rentType", "period");
    addIfValid("propertyType", "type");
    addIfValid("subTypes", "subtype"); // Keeps as comma string for backend @Transform
    addIfValid("features", "features"); // Keeps as comma string for backend @Transform

    addIfValid("bathroom", "bathroom");
    addIfValid("bedroom", "bedroom");

    // Handle Furnished logic
    addIfValid("isFurnished", "furnished")

    // Numerical Ranges
    addIfValid("minPrice", "priceMin", Number);
    addIfValid("maxPrice", "priceMax", Number);
    addIfValid("minArea", "scquarefeetMin", Number);
    addIfValid("maxArea", "scquarefeetMax", Number);
    addIfValid("minYear", "yearBuiltMin", Number);
    addIfValid("maxYear", "yearBuiltMax", Number);

    return dto;
};

export default function PropertiesList({ locale }: { locale: string }) {
    const t = useTranslations('property.grid')
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
            setLoading(true);
            try {
                const dtoParams = mapParamsToDto(new URLSearchParams(searchParams.toString()));
                const queryString = new URLSearchParams(dtoParams as any).toString();

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
    }, [searchParams]);


    const handlePageChange = (page: number) => {

        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };



    if (loading) return <PropertyGridSkeleton />;

    if (!properties?.length) {
        return (
            !loading && !properties?.length && (
                <EmptyState title={t("emptyTitle")} message={t("emptyMessage")} />
            )
        )
    }


    return (
        <div className="flex flex-col gap-2">
            <div className="grid grid-cols-12 gap-4 xl:gap-5">
                {properties.map((property) => (
                    <div key={property.id} className="col-span-12 sm:col-span-6 xl:col-span-4 2xl:col-span-3">
                        <PropertyCardGrid property={property} locale={locale} />
                    </div>
                ))}
            </div>
            <div className="mx-auto">
                <Pagination currentPage={Number(page)} pageCount={pagination.totalPages} onPageChange={handlePageChange} />
            </div>
        </div>
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