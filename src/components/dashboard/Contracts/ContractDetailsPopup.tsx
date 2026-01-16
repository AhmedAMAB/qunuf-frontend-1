'use client';

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import api from "@/libs/axios";
import { Contract } from "@/types/dashboard/contract";
import { TableRowType } from "@/types/table";
import { BiErrorCircle, BiCalendar, BiMapPin, BiDollar, BiFile, BiUser } from "react-icons/bi";
import { format } from "date-fns";
import { PropertyType, RentType } from "@/types/dashboard/properties";

type ContractDetailsPopupProps = {
    row: TableRowType<Contract>;
    onClose: () => void;
};

export default function ContractDetailsPopup({ row, onClose }: ContractDetailsPopupProps) {
    const tUsers = useTranslations("dashboard.users");
    const tEnums = useTranslations("property.enums");
    const t = useTranslations("dashboard.contracts");
    const [details, setDetails] = useState<Contract | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const locale = useLocale();

    useEffect(() => {
        const controller = new AbortController();
        async function fetchDetails() {
            try {
                setLoading(true);
                const res = await api.get(`/contracts/${row.id}`, { signal: controller.signal });
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
    if (error) return <ErrorMessage error={error || "Failed to load contract"} onClose={onClose} t={t} />;
    if (!details) return null;

    const property = details.propertySnapshot;
    const landlord = details.landlordSnapshot;
    const tenant = details.tenantSnapshot;

    return (
        <div className="w-[80vw] lg:w-[60vw] xl:w-[50vw] space-y-6  px-1 thin-scrollbar max-h-[90vh]">
            {/* Header */}
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-dark">
                    {t("details.title")} {details.contractNumber || `#${details.id.slice(0, 8)}`}
                </h2>
                <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(details.status)}`}>
                        {t(`table.statusOptions.${details.status}`)}
                    </span>
                </div>
            </div>

            {/* Property Information */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold flex items-center gap-2">
                    <BiMapPin /> {t("details.property")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                    <DetailItem label={t("details.propertyName")} value={property?.name} />
                    <DetailItem
                        label={t("details.propertyType")}
                        value={property?.type ? `${tEnums(`propertyType.${property.type}`)} - ${tEnums(`subType.${property.type === PropertyType.RESIDENTIAL ? 'residential' : 'commercial'}.${property?.subType}`)}` : undefined}
                    />
                    <DetailItem label={t("details.area")} value={property?.area ? `${property.area} m²` : undefined} />
                    <DetailItem label={t("details.location")} value={property?.stateName} />
                </div>
            </div>

            {/* Rental Period */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold flex items-center gap-2">
                    <BiCalendar /> {t("details.rentalPeriod")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                    <DetailItem
                        label={t("details.startDate")}
                        value={details.startDate ? format(new Date(details.startDate), 'dd/MM/yyyy') : undefined}
                    />
                    <DetailItem
                        label={t("details.endDate")}
                        value={details.endDate ? format(new Date(details.endDate), 'dd/MM/yyyy') : undefined}
                    />
                    <DetailItem label={t("details.duration")} value={`${details.durationInMonths} ${t("details.months")}`} />
                    <DetailItem
                        label={t("details.rentType")}
                        value={details.rentType ? tEnums(`rentType.${details.rentType}`) : undefined}
                    />
                </div>
            </div>

            {/* Financial Details */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold flex items-center gap-2">
                    <BiDollar /> {t("details.financial")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                    <DetailItem
                        label={t("details.totalAmount")}
                        value={details.totalAmount ? `${details.totalAmount.toLocaleString()} SAR` : undefined}
                    />
                    <DetailItem
                        label={t("details.securityDeposit")}
                        value={details.securityDeposit ? `${Number(details.securityDeposit).toLocaleString()} SAR` : undefined}
                    />
                    <DetailItem
                        label={t("details.platformFee")}
                        value={details.platformFeePercentage ? `${details.platformFeePercentage}% (${Number(details.platformFeeAmount).toLocaleString()} SAR)` : undefined}
                    />
                </div>
            </div>

            {/* Parties */}
            {/* Parties */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold flex items-center gap-2">
                    <BiUser /> {t("details.parties")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Landlord Card */}
                    <div className="p-4 bg-gray-50 rounded-xl space-y-1">
                        <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">{t("details.landlord")}</h4>
                        <DetailItem label={t("details.name")} value={landlord?.name} />
                        <DetailItem label={t("details.email")} value={landlord?.email} />
                        <DetailItem label={t("details.phone")} value={landlord?.phoneNumber} />
                        <DetailItem label={t("details.nationality")} value={landlord?.nationality} />
                        <DetailItem
                            label={t("details.identityType")}
                            value={landlord?.identityType === 'other' ? landlord?.identityOtherType : tUsers(`details.identityTypes.${landlord?.identityType}`)}
                        />
                        <DetailItem label={t("details.identityNumber")} value={landlord?.identityNumber} />
                        <DetailItem label={t("details.identityIssueCountry")} value={landlord?.identityIssueCountry} />
                        <DetailItem label={t("details.birthDate")} value={landlord?.birthDate} />
                        <DetailItem label={t("details.shortAddress")} value={landlord?.shortAddress} />
                    </div>

                    {/* Tenant Card */}
                    <div className="p-4 bg-gray-50 rounded-xl space-y-1">
                        <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">{t("details.tenant")}</h4>
                        <DetailItem label={t("details.name")} value={tenant?.name} />
                        <DetailItem label={t("details.email")} value={tenant?.email} />
                        <DetailItem label={t("details.phone")} value={tenant?.phoneNumber} />
                        <DetailItem label={t("details.nationality")} value={tenant?.nationality} />
                        <DetailItem
                            label={t("details.identityType")}
                            value={tenant?.identityType === 'other' ? tenant?.identityOtherType : tUsers(`details.identityTypes.${tenant?.identityType}`)}
                        />
                        <DetailItem label={t("details.identityNumber")} value={tenant?.identityNumber} />
                        <DetailItem label={t("details.identityIssueCountry")} value={tenant?.identityIssueCountry} />
                        <DetailItem label={t("details.birthDate")} value={tenant?.birthDate ? format(new Date(tenant?.birthDate), 'dd/MM/yyyy') : 'Unknown'} />
                        <DetailItem label={t("details.shortAddress")} value={tenant?.shortAddress} />
                    </div>
                </div>
            </div>

            {/* Contract Terms */}
            {details.currentTerms && (
                <div className="space-y-3">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                        <BiFile /> {t("details.terms")}
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {details.currentTerms}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Contract Info */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold flex items-center gap-2">
                    <BiCalendar /> {t("details.contractInfo")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                    <DetailItem
                        label={t("details.createdAt")}
                        value={details.created_at ? format(new Date(details.created_at), 'dd/MM/yyyy HH:mm') : undefined}
                    />
                    {details.contractDate && (
                        <DetailItem
                            label={t("details.contractDate")}
                            value={format(new Date(details.contractDate), 'dd/MM/yyyy')}
                        />
                    )}
                    {details.terminationEffectiveDate && (
                        <DetailItem
                            label={t("details.terminationDate")}
                            value={format(new Date(details.terminationEffectiveDate), 'dd/MM/yyyy')}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

/* Helper Components */

function DetailsSkeleton() {
    return (
        <div className="w-full md:w-[80vw] lg:w-[60vw] xl:w-[50vw] space-y-6 animate-pulse">
            <div className="flex gap-4">
                <div className="flex-1 space-y-3 py-2">
                    <div className="h-6 bg-gray-200 w-1/2 rounded" />
                    <div className="h-4 bg-gray-200 w-3/4 rounded" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl" />)}
            </div>
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

function ErrorMessage({ error, onClose, t }: { error: string; onClose: () => void; t: (key: string) => string }) {
    return (
        <div className="flex flex-col items-center justify-center text-center p-6 space-y-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-2 text-red-600">
                <BiErrorCircle className="text-2xl" />
                <h3 className="text-lg font-semibold">{t("details.errorTitle")}</h3>
            </div>
            <p className="text-sm text-red-700 font-medium">{error}</p>
            <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
            >
                {t("details.close")}
            </button>
        </div>
    );
}

function getStatusStyle(status: string) {
    switch (status) {
        case 'active': return 'bg-green-100 text-green-700';
        case 'pending_landlord_acceptance': return 'bg-blue-100 text-blue-700';
        case 'pending_tenant_acceptance': return 'bg-yellow-100 text-yellow-700';
        case 'pending_signature': return 'bg-purple-100 text-purple-700';
        case 'cancelled': return 'bg-red-100 text-red-700';
        case 'terminated': return 'bg-red-100 text-red-700';
        case 'pending_termination': return 'bg-orange-100 text-orange-700';
        default: return 'bg-gray-100 text-gray-700';
    }
}

