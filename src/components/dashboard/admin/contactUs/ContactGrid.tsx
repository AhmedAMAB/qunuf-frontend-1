"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { useDebounce } from "@/hooks/useDebounce";
import api from "@/libs/axios";
import { ErrorCard } from "@/components/shared/ErrorCard";
import SectionHeading from "../../SectionHeading";
import SearchField from "@/components/shared/forms/SearchField";
import { MessageCard } from "./MessageCard";
import Pagination from "@/components/shared/Pagination";
import EmptyState from "@/components/shared/EmptyState";

export default function ContactGrid() {
    const t = useTranslations("dashboard.admin.contactUs");

    // Search
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const { debouncedValue, setDebouncedValue } = useDebounce({ value: search, delay: 350, onDebounce: () => setPage(1) });

    // Data State
    const [messages, setMessages] = useState([]);
    const [pagination, setPagination] = useState({
        limit: 10,
        total: 0,
        totalPages: 1,
    });

    const { limit } = pagination;

    // UI State
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Abort Controller
    const abortRef = useRef<AbortController | null>(null);

    // -----------------------------
    // Fetch Data
    // -----------------------------
    const fetchData = useCallback(
        async (page: number, search: string) => {
            if (abortRef.current) abortRef.current.abort();

            const controller = new AbortController();
            abortRef.current = controller;

            try {
                setLoading(true);
                setError(null);

                const res = await api.get(
                    `/contact-us?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
                    { signal: controller.signal }
                );

                const { records, pagination: serverPagination } = res.data.data;

                setMessages(records);

                setPagination((p) => ({
                    ...p,
                    total: serverPagination.total,
                    totalPages: serverPagination.totalPages,
                }));

            } catch (err: any) {
                if (err?.name === "CanceledError") return;
                setError(err?.response?.data?.message || "Failed to load messages");
            } finally {
                if (abortRef.current === controller) setLoading(false);
            }
        },
        [limit]
    );

    // Fetch when page OR search changes
    useEffect(() => {
        fetchData(page, debouncedValue.trim());
    }, [page, debouncedValue.trim()]);

    // Error case
    if (!loading && error) {
        return (
            <ErrorCard
                message={error}
                onAction={() => fetchData(1, debouncedValue)}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <SectionHeading title={t("title")} />

                <SearchField
                    value={search}
                    onChange={setSearch}
                    searchPlaceholder={t("searchPlaceholder")}
                    className="lg:!max-w-[510px]"
                />
            </div>

            {/* Loading Skeleton */}
            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {Array(8)
                        .fill(0)
                        .map((_, i) => (
                            <MessageSkeletonCard
                                key={i} />
                        ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && messages.length === 0 && (
                <EmptyState title={t("emptyTitle")} message={t("emptyMessage")}
                    actionLabel={t('resetFilters')} onAction={() => {
                        setSearch('')
                        setDebouncedValue('')
                        setPage(1)
                    }} />
            )}

            {/* Grid */}
            {!loading && messages.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {messages.map((msg: any) => (
                        <MessageCard key={msg.id} {...msg} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            <Pagination
                page={page}
                total={pagination.total}
                setPage={setPage}
                loading={loading}
                totalPages={pagination.totalPages}
                limit={pagination.limit}
            />
        </div>
    );
}


function MessageSkeletonCard() {
    return (
        <div className="bg-card-bg rounded-[14px] p-4 animate-pulse">
            <div className="w-[44px] h-[44px] rounded-[12px] bg-gray-300 ml-auto mb-2" />

            <div className="w-[111px] h-[105px] bg-gray-300 rounded-[12px] mx-auto mb-4" />

            <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-gray-300 rounded-[12px]" />
                <div className="h-4 w-32 bg-gray-300 rounded" />
            </div>

            <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-gray-300 rounded-[12px]" />
                <div className="h-4 w-40 bg-gray-300 rounded" />
            </div>

            <div className="h-4 w-full bg-gray-300 rounded mb-1" />
            <div className="h-4 w-3/4 bg-gray-300 rounded" />
        </div>
    );
}
