'use client';

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import api from "@/libs/axios";
import { User } from "@/types/dashboard/user";
import { TableRowType } from "@/types/table";
import Image from "next/image";
import { BiErrorCircle, BiUser, BiEnvelope, BiPhone, BiCalendar, BiMapPin, BiIdCard, BiGlobe } from "react-icons/bi";
import { resolveUrl } from "@/utils/upload";
import Link from "next/link";
import { getDashboardHref } from "@/utils/dashboardPaths";

type UserDetailsPopupProps = {
    row: TableRowType<User>;
    onClose: () => void;
};

export default function UserDetailsPopup({ row, onClose }: UserDetailsPopupProps) {
    const t = useTranslations("dashboard.users");
    const [details, setDetails] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const locale = useLocale();

    useEffect(() => {
        const controller = new AbortController();
        async function fetchDetails() {
            try {
                setLoading(true);
                const res = await api.get(`/users/${row.id}/full-details`, { signal: controller.signal });
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
    if (error) return <ErrorMessage error={error || "Failed to load user"} onClose={onClose} t={t} />;
    if (!details) return null;

    return (
        <div className="w-[80vw] lg:w-[60vw] xl:w-[50vw] space-y-6 overflow-y-auto px-1 thin-scrollbar">
            {/* Header & Image */}
            <div className="flex flex-col md:flex-row gap-5 items-start">
                {details.imagePath && (
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image src={resolveUrl(details.imagePath)} alt={details.name} fill className="object-cover" />
                    </div>
                )}
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-dark">
                        <Link
                            href={getDashboardHref('chats', { user: details.id })}
                            className="text-primary hover:text-primary/80 transition-colors underline"
                        >
                            {details.name}
                        </Link>
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(details.status)}`}>
                            {t(`statusOptions.${details.status}`)}
                        </span>
                        <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-semibold uppercase">
                            {t(`roleOptions.${details.role}`)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Section 1: Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl">
                <IconDetailItem icon={<BiEnvelope />} label={t("details.email")} value={details.email} />
                {details.pendingEmail && (
                    <IconDetailItem icon={<BiEnvelope className="text-orange-500" />} label={t("details.pendingEmail")} value={details.pendingEmail} />
                )}
                <IconDetailItem icon={<BiPhone />} label={t("details.phoneNumber")} value={details.phoneNumber || t("details.notProvided")} />
                <IconDetailItem
                    icon={<BiCalendar />}
                    label={t("details.birthDate")}
                    value={details.birthDate ? new Date(details.birthDate).toLocaleDateString() : t("details.notProvided")}
                />
                {details.lastLogin && (
                    <IconDetailItem
                        icon={<BiCalendar />}
                        label={t("details.lastLogin")}
                        value={new Date(details.lastLogin).toLocaleString()}
                    />
                )}
                {!details.lastLogin && (
                    <IconDetailItem
                        icon={<BiCalendar />}
                        label={t("details.lastLogin")}
                        value={t("details.never")}
                    />
                )}
            </div>

            {/* Section 2: Identity & Nationality */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold flex items-center gap-2">
                    <BiIdCard /> {t("details.identity")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                    {details.nationality && (
                        <DetailItem
                            label={t("details.nationality")}
                            value={locale === "ar" ? details.nationality.name_ar : details.nationality.name}
                        />
                    )}
                    <DetailItem
                        label={t("details.identityType")}
                        value={details.identityType ? t(`details.identityTypes.${details.identityType}`) : t("details.notProvided")}
                    />
                    <DetailItem
                        label={t("details.identityNumber")}
                        value={details.identityNumber || t("details.notProvided")}
                    />
                    {details.identityIssueCountry && (
                        <DetailItem
                            label={t("details.identityIssueCountry")}
                            value={locale === "ar" ? details.identityIssueCountry.name_ar : details.identityIssueCountry.name}
                        />
                    )}
                    {details.identityType === 'other' && details.identityOtherType && (
                        <DetailItem
                            label={t("details.identityOtherType")}
                            value={details.identityOtherType}
                        />
                    )}
                </div>
            </div>

            {/* Section 3: Address */}
            {details.shortAddress && (
                <div className="space-y-3">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                        <BiMapPin /> {t("details.address")}
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-xl">
                        <DetailItem label={t("details.shortAddress")} value={details.shortAddress} />
                    </div>
                </div>
            )}

            {/* Section 4: Account Info */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold flex items-center gap-2">
                    <BiUser /> {t("details.accountInfo")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                    <DetailItem
                        label={t("details.createdAt")}
                        value={new Date(details.created_at).toLocaleString()}
                    />
                    {details.updated_at && (
                        <DetailItem
                            label={t("details.updatedAt")}
                            value={new Date(details.updated_at).toLocaleString()}
                        />
                    )}
                    <DetailItem
                        label={t("details.notificationsEnabled")}
                        value={details.notificationsEnabled ? t("details.yes") : t("details.no")}
                    />
                    {details.notificationUnreadCount !== undefined && (
                        <DetailItem
                            label={t("details.unreadNotifications")}
                            value={details.notificationUnreadCount.toString()}
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
                <div className="w-32 h-32 bg-gray-200 rounded-xl" />
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
        case 'inactive': return 'bg-gray-100 text-gray-700';
        case 'pending_verification': return 'bg-yellow-100 text-yellow-700';
        case 'suspended': return 'bg-red-100 text-red-700';
        case 'deleted': return 'bg-red-100 text-red-700';
        default: return 'bg-blue-100 text-blue-700';
    }
}
