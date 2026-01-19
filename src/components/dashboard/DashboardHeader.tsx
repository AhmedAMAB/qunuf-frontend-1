import { FaBars } from "react-icons/fa";
import NotificationDropdown from "../shared/NotificationDropdown";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { Link } from "@/i18n/navigation";
import PingIndicator from "../shared/PingIndicator";
import LocaleSwitcher from "../shared/LocaleSwitcher";
import { GrLanguage } from "react-icons/gr";
import { useTranslations } from "next-intl";
import { useDashboardHref } from "@/hooks/dashboard/useDashboardHref";
import MobileDashboardIcons from "./MobileDashboardIcons";
import { RxDotsHorizontal } from "react-icons/rx";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import { UserRole } from "@/constants/user";
import FallbackImage from "../shared/FallbackImage";
import { resolveUrl } from "@/utils/upload";

export default function DashboardHeader({ onOpenSidebar }: { onOpenSidebar: () => void }) {
    const tHeader = useTranslations('header')
    const t = useTranslations('dashboard.header')
    const [subHeaderOpen, setSubHeaderOpen] = useState(false);
    const { getHref } = useDashboardHref();
    const { user } = useAuth();
    const { unreadChatCount } = useSocket();

    function toggleSubHeader() {
        setSubHeaderOpen(p => !p)
    }
    const roleStyles: Record<UserRole, string> = {
        [UserRole.ADMIN]: 'text-red-600 bg-red-50 border-red-100',
        [UserRole.LANDLORD]: 'text-blue-600 bg-blue-50 border-blue-100',
        [UserRole.TENANT]: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    };
    return (
        <div>
            <header className="px-4 md:px-6 bg-dashboard-bg border-b border-gray/5">
                <div className="py-[21px] flex justify-between items-center h-[98px] sm:h-[107px] md:h-[112px]">

                    {/* Left: Mobile Dots & Greeting */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSubHeaderOpen(!subHeaderOpen)}
                            className={`lg:hidden p-2 rounded-[6px] ${subHeaderOpen ? "bg-gray-100" : ""}`}
                        >
                            <RxDotsHorizontal className="text-xl text-primary" />
                        </button>

                        <div>
                            <h1 className="text-xl sm:text-2xl md:text-[32px] font-bold text-dark leading-tight">
                                {t('greeting', { name: user?.name?.split(' ')[0] || "There" })}
                            </h1>
                            <p className="hidden sm:block text-sm md:text-base text-dark/60 font-medium">
                                {t('description')}
                            </p>
                        </div>
                    </div>

                    {/* Right: Actions + Static User Profile */}
                    <div className="flex items-center gap-3 md:gap-6">

                        {user && (
                            <div className="flex items-center gap-3 ps-4 border-s border-gray/10">
                                <div className="hidden md:flex flex-col items-end leading-tight">
                                    <span className="text-sm font-bold text-dark truncate max-w-[120px]">
                                        {user.name}
                                    </span>
                                    <span className={[
                                        "text-[9px] uppercase tracking-tighter font-bold px-1.5 py-0.5 rounded-md border mt-1",
                                        roleStyles[user.role as UserRole] || "text-secondary bg-slate-50 border-slate-100"
                                    ].join(' ')}>
                                        {tHeader(`roles.${user.role}`)}
                                    </span>
                                </div>
                                <div className="relative shrink-0">
                                    <FallbackImage
                                        src={user.imagePath ? resolveUrl(user.imagePath) : '/users/default-user.png'}
                                        alt={user.name}
                                        width={44}
                                        height={44}
                                        className="rounded-full object-cover w-10 h-10 md:w-11 md:h-11 border-2 border-white shadow-sm"
                                        defaultImage="/users/default-user.png"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Desktop Quick Actions */}
                        <div className="hidden lg:flex gap-3 items-center">
                            <LocaleSwitcher Trigger={LocaleTrigger} />

                            <Link href="/dashboard/chats">
                                <div className="relative bg-card-bg custom-shadow rounded-full p-2.5 hover:scale-105 transition-transform">
                                    {/* ping logic... */}
                                    <IoChatbubbleEllipsesOutline size={20} className="text-primary" />
                                </div>
                            </Link>

                            <NotificationDropdown />
                        </div>



                        {/* Mobile Sidebar Toggle */}
                        <button
                            onClick={onOpenSidebar}
                            className="lg:hidden p-2 focus:outline-none rounded-[6px]"
                        >
                            <FaBars className="text-xl text-primary" />
                        </button>
                    </div>
                </div>
            </header>
            <MobileDashboardIcons open={subHeaderOpen} onClose={() => setSubHeaderOpen(false)} />
        </div>
    );
}


function LocaleTrigger({
    onClick,
    disabled,
}: {
    onClick: () => void;
    disabled: boolean;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="relative bg-card-bg custom-shadow rounded-full p-3 transition hover:scale-105 disabled:opacity-50"
            aria-label="Toggle locale"
        >
            <GrLanguage size={20} className="text-primary" />

        </button>
    );
}
