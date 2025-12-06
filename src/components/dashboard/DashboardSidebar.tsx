'use client';

import { useNormalizedPath } from '@/hooks/useNormalizedPath';
import { dashboardItems, SidebarLink } from '@/constants/dashboardItems';
import { useTranslations } from 'next-intl';
import Logo from '../shared/Logo';
import Tooltip from '../shared/Tooltip';
import { IoChatbubbleEllipsesOutline, IoLogOutOutline, IoNotificationsOutline, IoSettingsOutline } from 'react-icons/io5';
import { FaHeadset } from 'react-icons/fa';
import FallbackImage from '../shared/FallbackImage';
import SidebarItem from '../shared/SidebarItem';
import LocaleSwitcher from '../shared/LocaleSwitcher';
import { GrLanguage } from 'react-icons/gr';
import { useDashboardHref } from '@/hooks/dashboard/useDashboardHref';
import { isPathActive } from '@/utils/dashboardPaths';



export default function DashboardSidebar() {
    const t = useTranslations('dashboard.sidebar');
    const { normalizedPath } = useNormalizedPath();

    const { getHref, role } = useDashboardHref();
    let items: SidebarLink[] = [];

    if (role) {
        items = dashboardItems[role];
    }

    return (

        <div className="sticky top-4 flex items-center flex-col gap-4 px-2 lg:px-8  my-4 lg:my-12 ">
            <div className="flex items-center justify-center gap-4 max-lg:hidden">
                {/* Logo */}
                <Logo small />
            </div>

            <div className='lg:bg-card-bg rounded-[55px] p-2 space-y-2 lg:space-y-1 max-lg:w-full lg:mt-10'>
                {items.map(({ href, key, Icon }) => {
                    const isActive = normalizedPath === href;
                    return (
                        <SidebarItem
                            key={href}
                            href={href}
                            label={t(key)}
                            isActive={isActive}
                            Icon={Icon}
                        />
                    );
                })}


                <div className="lg:mt-12 space-y-1">
                    <SidebarItem
                        href={getHref('settings')}
                        label={t("settings")}
                        isActive={isPathActive(normalizedPath, role, 'settings')}
                        Icon={IoSettingsOutline}
                    />

                    <SidebarItem
                        href={getHref('support')}
                        label={t("support")}
                        isActive={isPathActive(normalizedPath, role, 'support')}
                        Icon={FaHeadset}
                    />
                </div>

            </div>

            <div className="mt-8 flex flex-col items-center gap-4 lg:gap-[35px] w-full max-lg:p-2">
                {/* Mobile: Logout with label */}
                <LocaleSwitcher Trigger={LocaleTrigger} />

                <button
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-lighter hover:bg-gray text-dark lg:hidden w-full justify-start"
                >
                    <IoLogOutOutline className="w-6 h-6" />
                    <span className="text-sm font-medium">{t("logout")}</span>
                </button>

                {/* Desktop: Logout icon with tooltip */}
                <div className="hidden lg:block group relative">
                    <Tooltip content={t("logout")}
                        position="top-left">
                        <button
                            className="w-[44px] h-[44px] flex items-center justify-center rounded-full  hover:bg-gray text-dark"
                        >
                            <IoLogOutOutline className="w-6 h-6" />
                        </button>
                    </Tooltip>
                </div>

                {/* Profile Image */}
                <button
                    className="hidden lg:flex relative w-[44px] h-[44px]  justify-center items-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30"
                    aria-label="فتح قائمة المستخدم"
                >
                    <FallbackImage
                        alt="profile"
                        src="/users/user-4.jpg"
                        width={44}
                        height={44}
                        className="w-full h-full rounded-full object-cover"
                    />
                </button>
            </div>

        </div>
    );
}




function LocaleTrigger({
    onClick,
    disabled,
    lang
}: {
    onClick: () => void;
    disabled: boolean;
    lang?: string;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="flex items-center gap-2 px-4 py-3 rounded-lg bg-lighter hover:bg-gray text-dark w-full justify-start lg:hidden"
            aria-label="Change language"
        >
            <GrLanguage className="w-5 h-5" />
            <span className="text-sm font-medium">{lang}</span>
        </button>
    );
}