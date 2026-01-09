'use client'

import PushNotificationToggle from "@/components/dashboard/settings/notifications/PushNotificationToggle";
import BreadcrumbsHeader from "@/components/shared/BreadcrumbsHeader";
import { useDashboardHref } from "@/hooks/dashboard/useDashboardHref";
import { getDashboardHref } from "@/utils/dashboardPaths";
import { Link } from "@/i18n/navigation";
import { FaRegNewspaper } from "react-icons/fa";
import DashboardCard from "../../DashboardCard";
import { useTranslations } from "next-intl";
import { useSocket } from "@/contexts/SocketContext";


export default function Notifications() {
    const { getHref } = useDashboardHref();
    const t = useTranslations('dashboard.notification');
    const { } = useSocket();
    return (
        <div>
            <BreadcrumbsHeader
                title={t('title')}
                breadcrumbs={[
                    { label: t('accountSettings'), href: getHref('settings') },
                    { label: t('notifications') },
                ]}
            />

            <PushNotificationToggle />
            <DashboardCard className="mt-4">
                <h1 className="border-b-2 border-b-notification font-bold pb-3  w-fit">
                    {t('overview')}
                </h1>
                <div className="mt-10">
                    <Link href={getHref('chats', { chat: 1 })}>
                        <div className="flex items-center gap-6 py-6 border-b px-2 border-b-gray  hover:bg-gray transition cursor-pointer">
                            <div className="w-[6px] h-[6px] bg-notification rounded-full"></div>
                            <FaRegNewspaper size={26} className="text-secondary" />
                            <p className="font-medium">Your have a new message from Yin Your have a new message from Yin</p>
                        </div>
                    </Link>
                    <Link href={getHref('chats', { chat: 1 })}>
                        <div className="flex items-center gap-6 py-6 border-b px-2 border-b-gray  hover:bg-gray transition cursor-pointer">
                            <div className="w-[6px] h-[6px] bg-notification rounded-full"></div>
                            <FaRegNewspaper size={26} className="text-secondary" />
                            <p className="font-medium">Your have a new message from Yin Your have a new message from Yin</p>
                        </div>
                    </Link>
                    <Link href={getHref('chats', { chat: 1 })}>
                        <div className="flex items-center gap-6 py-6 border-b px-2 border-b-gray  hover:bg-gray transition cursor-pointer">
                            <div className="w-[6px] h-[6px] bg-notification rounded-full"></div>
                            <FaRegNewspaper size={26} className="text-secondary" />
                            <p className="font-medium">Your have a new message from Yin Your have a new message from Yin</p>
                        </div>
                    </Link>

                </div>
            </DashboardCard>
        </div>
    );
}