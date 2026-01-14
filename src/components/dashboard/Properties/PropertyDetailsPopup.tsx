'use client';

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import api from "@/libs/axios";
import { Property, PropertyStatus, PropertyType } from "@/types/dashboard/properties";
import { TableRowType } from "@/types/table";
import Image from "next/image";
import { BiArea, BiMoney, BiHash, BiDetail, BiBuildingHouse, BiMap, BiFile, BiWind, BiWrench, BiErrorCircle, BiGroup, BiCalendar, BiKey } from "react-icons/bi";
import { resolveUrl } from "@/utils/upload";

type PropertyDetailsPopupProps = {
    row: TableRowType<Property>;
    onClose: () => void;
};

export default function PropertyDetailsPopup({ row, onClose }: PropertyDetailsPopupProps) {
    const tEnums = useTranslations("property.enums");
    const t = useTranslations("dashboard.properties");
    const [details, setDetails] = useState<Property | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const locale = useLocale()
    useEffect(() => {
        const controller = new AbortController();
        async function fetchDetails() {
            try {
                setLoading(true);
                const res = await api.get(`/properties/${row.id}/full-details`, { signal: controller.signal });
                setDetails(res.data);
            } catch (err: any) {
                if (err?.name === "CanceledError") return;
                setError(err?.response?.data?.message || t("details.error"));
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }
        fetchDetails();
        return () => controller.abort();
    }, [row.id, t]);

    if (loading) return <DetailsSkeleton />;
    if (error) return <ErrorMessage error={error || "Failed to load property"} onClose={onClose} t={t} />;
    if (!details) return null;

    const primaryImage = details.images?.find(img => img.is_primary)?.url || details.images?.[0]?.url;

    return (
        <div className="w-[80vw] lg:w-[60vw] xl:w-[50vw] space-y-6 overflow-y-auto px-1 thin-scrollbar">
            {/* Header & Image */}
            <div className="flex flex-col md:flex-row gap-5 items-start">
                {primaryImage && (
                    <div className="relative w-full md:w-48 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image src={resolveUrl(primaryImage)} alt={details.name} fill className="object-cover" />
                    </div>
                )}
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-dark">{details.name}</h2>
                    <p className="text-sm text-gray-500 leading-relaxed">{details.description}</p>
                    {details.additionalDetails && (
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {details.additionalDetails}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(details.status)}`}>
                            {t(`statusOptions.${details.status}`)}
                        </span>
                        <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-semibold uppercase">
                            {tEnums(`propertyType.${details.propertyType}`)} -
                            {details.propertyType === PropertyType.COMMERCIAL
                                ? tEnums(`subType.commercial.${details.subType}`)
                                : tEnums(`subType.residential.${details.subType}`)}
                        </span>

                    </div>
                </div>
            </div>

            {/* Section 1: Financials & Basic Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-2xl">
                <IconDetailItem icon={<BiMoney />} label={t("details.price")} value={`${details.rentPrice?.toLocaleString()} / ${t(`details.${details.rentType}`)}`} />
                <IconDetailItem icon={<BiArea />} label={t("details.area")} value={`${details.area} m²`} />
                <IconDetailItem icon={<BiMoney className="text-orange-500" />} label={t("details.securityDeposit")} value={details.securityDeposit} />
                <IconDetailItem icon={<BiBuildingHouse />} label={t("details.isFurnished")} value={details.isFurnished ? t("details.yes") : t("details.no")} />
                <IconDetailItem
                    icon={<BiKey />}
                    label={t("details.isRented")}
                    value={details.isRented ? t("details.yes") : t("details.no")}
                />

                {/* ➕ Capacity */}
                {details.capacity && (
                    <IconDetailItem
                        icon={<BiGroup />} // or another suitable icon
                        label={t("details.capacity")}
                        value={details.capacity}
                    />
                )}

                {/* ➕ Construction Date */}
                {details.constructionDate && (
                    <IconDetailItem
                        icon={<BiCalendar />}
                        label={t("details.constructionDate")}
                        value={new Date(details.constructionDate).toLocaleDateString()}
                    />
                )}
                {details.state && (
                    <IconDetailItem
                        icon={<BiMap />}
                        label={t("details.state")}
                        value={locale === "ar" ? details.state.name_ar : details.state.name}
                    />
                )}

            </div>

            {/* Section 2: Facilities (JSONB) */}
            {details.facilities && (
                <div className="space-y-3">
                    <h3 className="text-sm font-bold flex items-center gap-2"><BiDetail /> {t("details.facilities")}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-2 border border-gray-100 p-4 rounded-xl">
                        {Object.entries(details.facilities).map(([key, val]) => (
                            <DetailItem key={key} label={t(`details.facilityKeys.${key}`)} value={typeof val === 'boolean' ? (val ? t("details.yes") : t("details.no")) : val} />
                        ))}
                    </div>
                </div>
            )}

            {/* Section 3: Infrastructure & Meters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Utility Meters */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                        <BiWrench /> {t("details.utilityMeters")}
                    </h3>
                    <div className="flex flex-col gap-2 flex-1 bg-blue-50/30 p-3 rounded-xl">
                        {(!details.electricityMeterNumber &&
                            !details.waterMeterNumber &&
                            !details.gasMeterNumber) ? (
                            <p className="text-sm text-gray-400 my-auto text-center">{t("details.noDataFound")}</p>
                        ) : (
                            <>
                                <DetailItem label={t("details.electricityMeter")} value={details.electricityMeterNumber} />
                                <DetailItem label={t("details.waterMeter")} value={details.waterMeterNumber} />
                                <DetailItem label={t("details.gasMeter")} value={details.gasMeterNumber} />
                            </>
                        )}
                    </div>
                </div>

                {/* Documents */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                        <BiFile /> {t("details.documents")}
                    </h3>
                    <div className="flex flex-col gap-2 flex-1 bg-gray-50 p-3 rounded-xl">
                        {(!details.documentNumber &&
                            !details.ownerIdNumber &&
                            !details.ownershipType &&
                            !details.documentType &&
                            !details.documentIssueDate &&
                            !details.issuedBy &&
                            !details.insurancePolicyNumber) ? (
                            <p className="text-sm text-gray-400 my-auto text-center">{t("details.noDataFound")}</p>
                        ) : (
                            <>
                                <DetailItem label={t("details.documentNumber")} value={details.documentNumber} />
                                <DetailItem label={t("details.ownerId")} value={details.ownerIdNumber} />
                                <DetailItem label={t("details.insurancePolicy")} value={details.insurancePolicyNumber} />
                                <DetailItem label={t("details.ownershipType")} value={details.ownershipType} />
                                <DetailItem label={t("details.documentType")} value={details.documentType} />
                                <DetailItem
                                    label={t("details.documentIssueDate")}
                                    value={new Date(details.documentIssueDate).toLocaleDateString()}
                                />
                                <DetailItem label={t("details.issuedBy")} value={details.issuedBy} />

                            </>
                        )}
                    </div>
                </div>

            </div>

            {/* Section 4: Nearby Amenities */}
            {(details.educationInstitutions?.length || details.healthMedicalFacilities?.length) && (
                <div className="space-y-3">
                    <h3 className="text-sm font-bold flex items-center gap-2"><BiMap /> {t("details.nearby")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <NearbyList title={t("details.education")} items={details.educationInstitutions} />
                        <NearbyList title={t("details.health")} items={details.healthMedicalFacilities} />
                    </div>
                </div>
            )}
        </div>
    );
}

/* Helper Components */

function DetailsSkeleton() {
    return (
        <div className="w-full md:w-[80vw] lg:w-[60vw] xl:w-[50vw]  space-y-6 animate-pulse">
            <div className="flex gap-4">
                <div className="w-32 h-32 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-3 py-2">
                    <div className="h-6 bg-gray-200 w-1/2 rounded" />
                    <div className="h-4 bg-gray-200 w-3/4 rounded" />
                </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl" />)}
            </div>
            <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl" />)}
            </div>
            <div className="h-40 bg-gray-50 rounded-xl" />
        </div>
    );
}

function DetailItem({ label, value }: { label: string; value?: string | number | null }) {
    if (value === undefined || value === null || value === "") return null;
    return (
        <div className="flex justify-between items-center md:block">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">{label}</p>
            <p className="text-sm text-dark font-medium">{value}</p>
        </div>
    );
}

function IconDetailItem({ icon, label, value }: { icon: React.ReactNode, label: string; value?: any }) {
    if (!value) return null;
    return (
        <div className="flex flex-col items-center text-center space-y-1">
            <span className="text-gray-400 text-xl">{icon}</span>
            <p className="text-[10px] font-bold text-gray-400 uppercase">{label}</p>
            <p className="text-xs font-bold text-dark">{value}</p>
        </div>
    );
}

function NearbyList({ title, items }: { title: string, items: any[] | null }) {
    if (!items?.length) return null;
    return (
        <div className="p-3 border border-gray-100 rounded-lg">
            <p className="text-xs font-bold mb-2 text-secondary">{title}</p>
            <ul className="space-y-1">
                {items.map((item, idx) => (
                    <li key={idx} className="text-xs flex justify-between">
                        <span>{item.name}</span>
                        <span className="text-gray-400">{item.distance_km} km</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ErrorMessage({ error, onClose, t }: { error: string; onClose: () => void; t: (key: string) => string }) {
    return (
        <div className="flex flex-col items-center justify-center text-center p-6 space-y-4 bg-red-50 border border-red-200 rounded-xl">
            {/* Icon + Title */}
            <div className="flex items-center gap-2 text-red-600">
                <BiErrorCircle className="text-2xl" />
                <h3 className="text-lg font-semibold">{t("details.errorTitle")}</h3>
            </div>

            {/* Error message */}
            <p className="text-sm text-red-700 font-medium">{error}</p>

            {/* Action button */}
            <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
            >
                {t("details.close")}
            </button>
        </div>
    );
}

function getStatusStyle(status: PropertyStatus) {
    switch (status) {
        case 'active': return 'bg-green-100 text-green-700';
        case 'pending': return 'bg-yellow-100 text-yellow-700';
        case 'rejected': return 'bg-red-100 text-red-700';
        case 'archived': return 'bg-gray-100 text-gray-700';
        default: return 'bg-blue-100 text-blue-700';
    }
}