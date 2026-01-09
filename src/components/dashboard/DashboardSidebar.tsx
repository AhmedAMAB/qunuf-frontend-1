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

        <div className="sticky top-4 flex items-center flex-col gap-4 px-2 lg:px-8  my-4 lg:my-12 ">
            <div className="flex items-center justify-center gap-4 max-lg:hidden">
                {/* Logo */}
                <Logo small />
            </div>

            <div className='lg:bg-card-bg rounded-[55px] p-2 flex flex-col gap-2 lg:gap-1 max-lg:w-full lg:mt-10 min-h-[200px] min-w-[76px]'>
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

            </div>

            <div className="mt-8 flex flex-col items-center gap-4 lg:gap-[35px] w-full max-lg:p-2">
                {/* Mobile: Logout with label */}
                <LocaleSwitcher Trigger={LocaleTrigger} />

                <button disabled={LoggingOut}
                    onClick={handleLogOut}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-lighter hover:bg-gray text-dark lg:hidden w-full justify-start"
                >
                    <IoLogOutOutline className="w-6 h-6" />
                    <span className="text-sm font-medium">{LoggingOut ? t("loggingOut") : t("logout")}</span>
                </button>

                {/* Desktop: Logout icon with tooltip */}
                <div className="hidden lg:block group relative">
                    <Tooltip content={LoggingOut ? t("loggingOut") : t("logout")}
                        position="top-left">
                        <button onClick={handleLogOut}
                            disabled={LoggingOut}
                            className="w-[44px] h-[44px] flex items-center justify-center rounded-full  hover:bg-gray text-dark"
                        >
                            <IoLogOutOutline className="w-6 h-6" />
                        </button>
                    </Tooltip>
                </div>

                {/* Profile Image */}
                <Link
                    href={'/dashboard/settings/account'}
                    className="hidden lg:flex relative w-[44px] h-[44px]  justify-center items-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30"

                >
                    <FallbackImage
                        alt="profile"
                        src={resolveUrl(user?.imagePath) || "/users/default-user.png"}
                        defaultImage="/users/default-user.png"
                        width={44}
                        height={44}
                        className="w-full h-full rounded-full object-cover"
                    />
                </Link>
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