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

export default function DashboardHeader({ onOpenSidebar }: { onOpenSidebar: () => void }) {
    const t = useTranslations('dashboard.header')
    const [subHeaderOpen, setSubHeaderOpen] = useState(false);
    const { getHref } = useDashboardHref();
    const { user } = useAuth();
    const { unreadChatCount } = useSocket();
    function toggleSubHeader() {
        setSubHeaderOpen(p => !p)
    }


    return (
        <div>
            <header className="px-4 md:px-6 bg-dashboard-bg ">
                <div className=" ">
                    <div className="py-[21px] flex justify-between items-center h-[98px] sm:h-[107px] md:h-[112px]">
                        <button
                            onClick={toggleSubHeader}
                            className={`lg:hidden p-2 rounded-[6px] ${subHeaderOpen ? "bg-gray-100" : ""}`}
                        >
                            <RxDotsHorizontal className="text-xl text-primary" />
                        </button>

                        <div>
                            <h1 className="text-2xl sm:text-[28px] md:text-[32px] font-bold text-dark">
                                {t('greeting', { name: user?.name || "There" })}
                            </h1>
                            <p className="text-base sm:text-lg md:text-xl text-dark font-medium">
                                {t('description')}
                                {/* Mock description untill now */}
                            </p>
                        </div>

                        {/* Right: Notification + Profile (hidden on very small screens) */}
                        <div className="hidden lg:flex gap-3 items-center">
                            <LocaleSwitcher Trigger={LocaleTrigger} />

                            <Link href={getHref('chats')}>
                                <div className="relative bg-card-bg custom-shadow rounded-full p-3">
                                    {unreadChatCount ? <PingIndicator /> : null}
                                    <IoChatbubbleEllipsesOutline size={20} className="text-primary" />
                                </div>
                            </Link>
                            <NotificationDropdown />

                        </div>

                        <button
                            onClick={onOpenSidebar}
                            className="lg:hidden p-2  focus:outline-none rounded-[6px]"
                            aria-label="فتح القائمة الجانبية"
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
