'use client'
import SettingsCard from "@/components/dashboard/settings/SettingsCard";
import { useDashboardHref } from "@/hooks/dashboard/useDashboardHref";
import { useTranslations } from "next-intl";
import { AiOutlineNotification } from "react-icons/ai";
import { MdOutlinePayments, MdPerson } from "react-icons/md";


export default function Settings() {
    const { getHref } = useDashboardHref()
    const t = useTranslations('dashboard.settings.root');


    return (
        <div className="space-y-20">
            <h1 className="font-bold text-2xl sm:text-3xl">{t('account')}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
                <SettingsCard
                    title={t('personalInfo.title')}
                    description={t('personalInfo.description')}
                    icon={MdPerson}
                    href={getHref('account')}
                />
                <SettingsCard
                    title={t('notifications.title')}
                    description={t('notifications.description')}
                    icon={AiOutlineNotification}
                    href={getHref('notifications')}
                />
                {/* <SettingsCard
                    title={t('payments.title')}
                    description={t('payments.description')}
                    icon={MdOutlinePayments}
                    href={getHref('payments')}
                /> */}
            </div>
        </div>
    );
}