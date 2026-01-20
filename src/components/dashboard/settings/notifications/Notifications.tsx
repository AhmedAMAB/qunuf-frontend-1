'use client'

import BreadcrumbsHeader from "@/components/atoms/BreadcrumbsHeader";
import { useDashboardHref } from "@/hooks/dashboard/useDashboardHref";
import { useRouter } from "@/i18n/navigation";
import DashboardCard from "../../DashboardCard";
import { useTranslations, useLocale } from "next-intl";
import { useNotifications } from "@/contexts/NotificationContext";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import api from "@/libs/axios";
import { Notification } from "@/types/dashboard/notifications";
import SelectInput, { Option } from "@/components/molecules/forms/SelectInput";


export default function Notifications() {
    const { getHref } = useDashboardHref();
    const t = useTranslations('dashboard.notification');
    const locale = useLocale();
    const isRTL = locale === 'ar';

    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
    const [pageNotifications, setPageNotifications] = useState<Notification[]>([]);

    const {
        unreadNotificationCount,
        subscribe,
        markOneAsRead,
        markAllAsRead,
        getNotificationIcon,
    } = useNotifications();

    const notificationsApiRef = useRef<AbortController | null>(null);

    // --- Data Loading ---
    const loadNotifications = useCallback(async (targetPage, targetLimit) => {
        if (notificationsApiRef.current) notificationsApiRef.current.abort();
        const controller = new AbortController();
        notificationsApiRef.current = controller;

        try {
            setLoading(true);
            const res = await api.get(`/notifications?limit=${targetLimit}&page=${targetPage}`, {
                signal: controller.signal
            });
            const { records = [], pagination: { total, totalPages } } = res.data || {};
            setPageNotifications(records);
            setPagination(prev => ({ ...prev, total, totalPages }));
        } catch (error: any) {
            if (error?.name !== "CanceledError") toast.error(t('failedToLoad'));
        } finally {
            if (notificationsApiRef.current === controller) setLoading(false);
        }
    }, [t]);



    useEffect(() => {
        loadNotifications(pagination.page, pagination.limit);
    }, [pagination.page, pagination.limit]);

    // --- Subscription Logic ---
    useEffect(() => {
        const unsubscribe = subscribe((action) => {
            switch (action.type) {
                case "MARK_ONE_AS_READ":
                    setPageNotifications(prev => prev.map(n => n.id === action.payload.id ? { ...n, isRead: true } : n));
                    break;
                case "MARK_ALL_AS_READ":
                    setPageNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                    break;
                case "NEW_NOTIFICATION":
                    setPagination(prev => ({ ...prev, total: prev.total + 1 }));

                    setPageNotifications(prev => {
                        const exists = prev.some(n => n.id === action.payload.id);
                        if (exists) return prev;

                        const newList = [action.payload, ...prev];

                        if (newList.length > pagination.limit) {
                            return newList.slice(0, pagination.limit);
                        }

                        return newList;
                    });
                    break;
            }
        });
        return () => unsubscribe();
    }, [subscribe, pagination.page, loadNotifications]);

    const handleMarkRead = async (e: React.MouseEvent, notification: Notification) => {
        e.preventDefault();
        e.stopPropagation();
        await markOneAsRead(notification);
    };

    const options: Option[] = [
        { value: 5, label: '5' },
        { value: 10, label: '10' },
        { value: 20, label: '20' },
        { value: 50, label: '50' },
    ]

    const selectedLimit = useMemo(() => {
        return options.find(o => o.value === pagination.limit)
    }, [pagination.limit])
    const handleItemsPerPageChange = limit => {
        setPagination(prev => ({
            ...prev,
            limit,
            page: 1, // Reset to first page when changing items per page
        }));
    };

    const PagesCount = Math.ceil(pagination.total / pagination.limit)
    return (
        <div className="space-y-4">
            <BreadcrumbsHeader
                title={t('title')}
                breadcrumbs={[
                    { label: t('accountSettings'), href: getHref('settings') },
                    { label: t('notifications') },
                ]}
            >
                <button
                    onClick={() => markAllAsRead()}
                    disabled={unreadNotificationCount === 0}
                    className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:opacity-90 transition"
                >
                    {t('markAllAsRead')}
                    <span className="bg-white text-primary rounded-full px-2 py-0.5 text-xs">
                        {unreadNotificationCount}
                    </span>
                </button>
            </BreadcrumbsHeader>

            {/* <PushNotificationToggle /> */}

            <DashboardCard className="mt-4">
                <h2 className="border-b-2 border-primary font-bold pb-3 w-fit text-primary">
                    {t('overview')}
                </h2>

                <div className="mt-6">
                    {loading ? (
                        <NotificationSkeleton />
                    ) : pageNotifications.length > 0 ? (
                        <div className="divide-y divide-[#6C668533]">
                            {pageNotifications.map((notif) => (
                                <div
                                    data-notification-id={notif.id}
                                    key={notif.id}
                                    onClick={() => {
                                        markOneAsRead(notif);
                                    }}
                                    className={`flex items-center gap-4 py-5 px-3 transition cursor-pointer hover:bg-gray-50 group ${!notif.isRead ? 'bg-secondary/5' : ''}`}
                                >
                                    {/* Unread Indicator Ball */}
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${notif.isRead ? 'bg-transparent' : 'bg-primary animate-pulse'}`} />

                                    <div className="p-3 bg-white rounded-lg shadow-sm">
                                        {getNotificationIcon(notif.relatedEntityType || '')}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className={`text-sm truncate ${!notif.isRead ? 'font-bold text-primary' : 'font-medium text-gray-600'}`}>
                                            {notif.title}
                                        </h4>
                                        <p className="text-xs text-muted truncate">{notif.message}</p>
                                    </div>

                                    {!notif.isRead && (
                                        <button
                                            onClick={(e) => handleMarkRead(e, notif)}
                                            className="text-[10px] text-primary underline opacity-0 group-hover:opacity-100 transition whitespace-nowrap"
                                        >
                                            {t('markRead')}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-10 text-center text-muted">{t('noNotifications')}</div>
                    )}
                </div>


                {/* --- Pagination --- */}

                <div className="mt-8 flex flex-col xs:flex-row items-center xs:justify-between l gap-4  border-t pt-6">
                    {PagesCount > 0 ? <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                            disabled={pagination.page <= 1}
                            className={`px-6 py-2 cursor-pointer bg-primary text-white font-medium transition
                                    ${isRTL ? "rounded-r-md" : "rounded-l-md"} 
                                    disabled:opacity-30 disabled:cursor-not-allowed`}
                        >
                            {t('prev')}
                        </button>

                        <span className="px-6 py-2 text-sm font-semibold text-primary bg-gray-50 border-y border-gray-100">
                            {t('pageInfo', { current: pagination.page, total: PagesCount })}
                        </span>

                        <button
                            onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                            disabled={pagination.page >= PagesCount}
                            className={`px-6 py-2 cursor-pointer bg-primary text-white font-medium transition
                                    ${isRTL ? "rounded-l-md" : "rounded-r-md"} 
                                    disabled:opacity-30 disabled:cursor-not-allowed`}
                        >
                            {t('next')}
                        </button>
                    </div> : <div></div>}
                    <SelectInput
                        options={options}
                        value={selectedLimit}
                        onChange={selectedOption => handleItemsPerPageChange(Number(selectedOption.value))}
                        placeholder={t('selectItemsPerPage')}
                        openDirection="top"
                        // cnLabel="text-sm text-gray-600"
                        // cnSelect="text-sm text-gray-700"
                        className="!w-[100px]  xs:ms-auto"
                    />
                </div>

            </DashboardCard>
        </div>
    );
}

// --- Skeleton Component ---
function NotificationSkeleton() {
    return (
        <div className="space-y-2 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-5 border-b border-gray-100">
                    <div className="w-2 h-2 rounded-full bg-gray-200" />
                    <div className="w-12 h-12 bg-gray-100 rounded-lg" />
                    <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                        <div className="h-2 bg-gray-100 rounded w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}