'use client';

import { getDashboardItems, SidebarLink } from '@/constants/dashboardItems';
import { useTranslations } from 'next-intl';
import Logo from '../shared/Logo';
import Tooltip from '../shared/Tooltip';
import { IoLogOutOutline } from 'react-icons/io5';
import FallbackImage from '../shared/FallbackImage';
import SidebarItem from '../shared/SidebarItem';
import LocaleSwitcher from '../shared/LocaleSwitcher';
import { GrLanguage } from 'react-icons/gr';
import { Link, usePathname } from '@/i18n/navigation';
import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useValues } from '@/contexts/GlobalContext';
import { resolveUrl } from '@/utils/upload';



export default function DashboardSidebar() {
    const t = useTranslations('dashboard.sidebar');
    const pathname = usePathname();
    const { user, role, logout, LoggingOut } = useAuth()
    const { settings } = useValues()

    const items: SidebarLink[] = useMemo(() => (getDashboardItems(role, settings?.adminUserId) || []), [role, settings]);


    async function handleLogOut() {
        await logout()
    }
    const activeHref = useMemo(() => {
        if (!pathname) return null;

        // 2) Other paths should match by prefix (but skip root "/")

        const match = items
            .find(i => pathname === i.href);

        return match?.href ?? null;
    }, [pathname, items]);


    return (
        /* h-screen ensures it never exceeds the window height */
        <div className="flex flex-col h-screen max-h-screen py-4 lg:py-10">

            {/* 1. Header (Fixed) */}
            <div className="flex items-center justify-center shrink-0 mb-8 max-lg:hidden">
                <Logo small />
            </div>

            {/* 2. Scrollable Area (The only part that scrolls) */}
            <div className="flex-1 overflow-y-auto px-2 lg:px-8 overflow-x-hidden  thin-scrollbar">
                <nav className='lg:bg-card-bg rounded-[55px] p-2 flex flex-col gap-2 lg:gap-1 min-w-[76px]'>
                    {items.map(({ href, key, Icon, className, order, disabled }) => {
                        const isActive = activeHref === href;
                        return (
                            <div className={`${className}`} key={href} style={{ order }}>
                                <SidebarItem
                                    href={href}
                                    label={t(key)}
                                    isActive={isActive}
                                    disabled={disabled}
                                    Icon={Icon}
                                />
                            </div>
                        );
                    })}
                </nav>
            </div>

            {/* 3. Bottom Section (Fixed) */}
            <div className="shrink-0 mt-auto pt-6 flex flex-col items-center gap-4 lg:gap-[30px] w-full px-2 lg:px-8">
                <LocaleSwitcher Trigger={LocaleTrigger} />

                {/* Logout logic */}
                <div className="w-full flex flex-col items-center gap-4">
                    <Tooltip content={LoggingOut ? t("loggingOut") : t("logout")} position="top-left">
                        <button
                            onClick={handleLogOut}
                            disabled={LoggingOut}
                            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-gray text-dark"
                        >
                            <IoLogOutOutline className="w-6 h-6" />
                        </button>
                    </Tooltip>

                    <Link href={'/dashboard/settings/account'} className="w-11 h-11 rounded-full overflow-hidden border border-gray/20">
                        <FallbackImage
                            alt="profile"
                            src={resolveUrl(user?.imagePath) || "/users/default-user.png"}
                            defaultImage="/users/default-user.png"
                            width={44} height={44}
                            className="w-full h-full object-cover"
                        />
                    </Link>
                </div>
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