import { BsBell } from "react-icons/bs";
import Dropdown, { MenuProps, TriggerProps } from "./Dropdown";
import { FaRegNewspaper } from "react-icons/fa";
import PingIndicator from "./PingIndicator";
import { useTranslations } from "use-intl";
import Link from "next/link";
import { useDashboardHref } from "@/hooks/dashboard/useDashboardHref";


export default function NotificationDropdown() {
    return (
        <Dropdown Trigger={NotificationTrigger} Menu={NotificationMenu} position="bottom-right" />
    );
}

function NotificationTrigger({ isOpen, onToggle }: TriggerProps) {
    return (
        <div className="relative inline-flex bg-card-bg p-3 rounded-full custom-shadow">
            {/* Notification Dot */}
            <PingIndicator />
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


type Notification = {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
};

const notifications: Notification[] = [
    {
        id: '1',
        title: 'You have a new message from Yin',
        message: 'Hello there, check these new items you may be interested in from Motion School.',
        isRead: false,
    },
    {
        id: '2',
        title: 'Weekly digest is ready',
        message: 'Your weekly summary is now available. Click to view insights and updates.',
        isRead: true,
    },

];


function NotificationMenu({ isOpen, onClose }: MenuProps) {
    const t = useTranslations('dashboard.notification')
    const { getHref } = useDashboardHref();
    return (
        <div>
            <div className="">
                <header className="p-2 text-white"
                    style={{
                        background: 'linear-gradient(90deg, var(--secondary) 0%, var(--lightGold) 100%)',
                    }}>
                    {t('title')}
                </header>
                <div className="p-6 bg-white max-h-[250px] overflow-y-auto thin-scrollbar">
                    {notifications.map((item) => (
                        <button
                            key={item.id}
                            className="flex items-start gap-4 text-start w-full"
                            onClick={onClose}
                        >
                            <FaRegNewspaper size={20} className="text-secondary mt-1" />
                            <div className="max-w-[300px]">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-dark text-sm font-semibold">{item.title}</h2>
                                    {!item.isRead && (
                                        <div className="rounded-full w-2 h-2 border-2 border-secondary" />
                                    )}
                                </div>
                                <p className="text-xs text-dark">{item.message}</p>
                            </div>
                        </button>
                    ))}
                    <div className="flex justify-center mt-2">
                        <Link href={getHref('notifications')} className="text-sm text-secondary text-center ">
                            {t('seeMore')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

