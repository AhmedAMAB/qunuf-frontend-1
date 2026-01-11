import { BsBell } from "react-icons/bs";
import Dropdown, { MenuProps, TriggerProps } from "./Dropdown";
import PingIndicator from "./PingIndicator";
import { useTranslations } from "use-intl";
import { Link } from "@/i18n/navigation";
import { useDashboardHref } from "@/hooks/dashboard/useDashboardHref";
import { useNotifications } from "@/contexts/NotificationContext";
import api from "@/libs/axios";
import { useEffect, useState } from "react";
import { Notification } from "@/types/dashboard/notifications";


export default function NotificationDropdown() {
    return (
        <Dropdown Trigger={NotificationTrigger} Menu={NotificationMenu} position="bottom-right" />
    );
}

function NotificationTrigger({ isOpen, onToggle }: TriggerProps) {
    const { unreadNotificationCount } = useNotifications();
    return (
        <div className="relative inline-flex bg-card-bg p-3 rounded-full custom-shadow">
            {/* Notification Dot */}
            {unreadNotificationCount ? <PingIndicator /> : null}
            {/* Bell Button */}
            <button
                type="button"
                aria-label="فتح الإشعارات"
                onClick={onToggle}
                className="text-primary inline-flex justify-center rounded-3xl text-sm hover:bg-opacity-30"
            >
                <BsBell className="w-5 h-5" />
            </button>
        </div>
    );
}




function NotificationMenu({ isOpen, onClose }: MenuProps) {
    const t = useTranslations('dashboard.notification');
    const { getHref } = useDashboardHref();
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const {
        markOneAsRead,
        subscribe,
        getNotificationIcon,
    } = useNotifications();


    // --- Fetch Logic ---
    const fetchList = async () => {
        setLoading(true);
        try {
            // We usually only need the most recent 5-10 for the popup
            const res = await api.get('/notifications?limit=10&page=1');
            const { records = [] } = res.data || {};
            setNotifications(records);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch when opened
    useEffect(() => {
        if (isOpen) fetchList();
    }, [isOpen]);

    // --- Subscription Logic ---
    useEffect(() => {
        const unsubscribe = subscribe((action) => {
            switch (action.type) {
                case "NEW_NOTIFICATION":
                    setNotifications(prev => {
                        const exists = prev.some(n => n.id === action.payload.id);
                        if (exists) return prev;
                        // Add to top and trim to keep popup small
                        return [action.payload, ...prev].slice(0, 10);
                    });
                    break;

                case "MARK_ONE_AS_READ":
                    setNotifications(prev =>
                        prev.map(n => n.id === action.payload.id ? { ...n, isRead: true } : n)
                    );
                    break;

                case "MARK_ALL_AS_READ":
                    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                    break;
            }
        });

        return () => unsubscribe();
    }, [subscribe]);

    const handleNotificationClick = async (item: Notification) => {
        await markOneAsRead(item);
        onClose();
    };

    return (
        <div className="w-80 shadow-xl rounded-lg overflow-hidden border border-gray-100">
            <header className="p-3 text-white font-bold text-sm flex justify-between items-center"
                style={{ background: 'linear-gradient(90deg, var(--secondary) 0%, var(--lightGold) 100%)' }}>
                <span>{t('title')}</span>
                {loading && (<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />)}
            </header>

            <div className="bg-white max-h-[350px] overflow-y-auto thin-scrollbar divide-y divide-gray-50">
                {loading && notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-400 text-xs animate-pulse">{t('loading')}</div>
                ) : notifications.length > 0 ? (
                    notifications.map((item) => (
                        <button
                            key={item.id}
                            className={`flex items-start gap-3 p-4 text-start w-full hover:bg-gray-50 transition-colors ${!item.isRead ? 'bg-secondary/5' : ''}`}
                            onClick={() => handleNotificationClick(item)}
                        >
                            <div className="mt-1 shrink-0">
                                {getNotificationIcon(item.relatedEntityType || '')}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <h2 className={`text-xs truncate ${!item.isRead ? 'font-bold text-dark' : 'text-gray-500'}`}>
                                        {item.title}
                                    </h2>
                                    {!item.isRead && (
                                        <div className="shrink-0 rounded-full w-2 h-2 bg-primary animate-pulse" />
                                    )}
                                </div>
                                <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{item.message}</p>
                            </div>
                        </button>
                    ))
                ) : (
                    <div className="p-10 text-center text-gray-400 text-xs">{t('noNotifications')}</div>
                )}
            </div>

            <footer className="p-2 bg-gray-50 border-t border-gray-100 text-center">
                <Link
                    href={getHref('notifications')}
                    onClick={onClose}
                    className="text-xs text-secondary font-semibold hover:underline"
                >
                    {t('seeMore')}
                </Link>
            </footer>
        </div>
    );
}