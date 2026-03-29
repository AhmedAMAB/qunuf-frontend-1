

// ─── ContactGrid.tsx ──────────────────────────────────────────────────────────
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { useDebounce } from "@/hooks/useDebounce";
import api from "@/libs/axios";
import { ErrorCard } from "@/components/atoms/ErrorCard";
import SectionHeading from "../../SectionHeading";
import SearchField from "@/components/molecules/forms/SearchField";
import { MessageCard } from "./MessageCard";
import Pagination from "@/components/atoms/Pagination";
import EmptyState from "@/components/atoms/EmptyState";

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function MessageSkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      {/* accent bar */}
      <div className="h-1 bg-gray-200 w-full" />
      <div className="p-5 space-y-4">
        {/* identity row */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-200 shrink-0" />
          <div className="space-y-2 flex-1 min-w-0">
            <div className="h-3.5 bg-gray-200 rounded-full w-3/5" />
            <div className="h-2.5 bg-gray-100 rounded-full w-1/4" />
          </div>
        </div>
        <div className="h-px bg-gray-100" />
        {/* contact rows */}
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5">
              <div className="w-8 h-8 rounded-lg bg-gray-200 shrink-0" />
              <div className="h-3 bg-gray-200 rounded-full flex-1" />
            </div>
          ))}
        </div>
        <div className="h-px bg-gray-100" />
        {/* message block */}
        <div className="rounded-xl bg-gray-50 p-3 space-y-1.5">
          <div className="h-2.5 bg-gray-200 rounded-full w-full" />
          <div className="h-2.5 bg-gray-200 rounded-full w-4/5" />
          <div className="h-2.5 bg-gray-100 rounded-full w-2/3" />
        </div>
      </div>
    </div>
  );
}

// ─── Grid ─────────────────────────────────────────────────────────────────────
export default function ContactGrid() {
  const t = useTranslations("dashboard.admin.contactUs");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { debouncedValue, setDebouncedValue } = useDebounce({
    value: search,
    delay: 350,
    onDebounce: () => setPage(1),
  });

  const [messages, setMessages] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(
    async (page: number, search: string) => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        setLoading(true);
        setError(null);
        const res = await api.get(
          `/contact-us?page=${page}&limit=${pagination.limit}&search=${encodeURIComponent(search)}`,
          { signal: controller.signal }
        );
        const { records, pagination: sp } = res.data;
        setMessages(records);
        setPagination((p) => ({ ...p, total: sp.total, totalPages: sp.totalPages }));
      } catch (err: any) {
        if (err?.name === "CanceledError") return;
        setError(err?.response?.data?.message || "Failed to load messages");
      } finally {
        if (abortRef.current === controller) setLoading(false);
      }
    },
    [pagination.limit]
  );

  useEffect(() => {
    fetchData(page, debouncedValue.trim());
  }, [page, debouncedValue]);

  if (!loading && error) {
    return <ErrorCard message={error} onAction={() => fetchData(1, debouncedValue)} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionHeading title={t("title")} />
        <SearchField
          value={search}
          onChange={setSearch}
          searchPlaceholder={t("searchPlaceholder")}
          variant="minimal"
          className="sm:!max-w-[360px] h-[44px]"
        />
      </div>

      {/* Grid — skeleton or real cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {loading
          ? Array(8).fill(0).map((_, i) => <MessageSkeletonCard key={i} />)
          : messages.map((msg: any) => <MessageCard key={msg.id} {...msg} />)}
      </div>

      {/* Empty state */}
      {!loading && messages.length === 0 && (
        <EmptyState
          title={t("emptyTitle")}
          message={t("emptyMessage")}
          actionLabel={t("resetFilters")}
          onAction={() => {
            setSearch("");
            setDebouncedValue("");
            setPage(1);
          }}
        />
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