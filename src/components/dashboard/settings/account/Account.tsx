'use client'
import DashboardCard from "@/components/dashboard/DashboardCard";
import EditableField from "@/components/dashboard/EditableField";
import BreadcrumbsHeader from "@/components/shared/BreadcrumbsHeader";
import { useDashboardHref } from "@/hooks/dashboard/useDashboardHref";
import { useTranslations } from "next-intl";



export default function Account() {
    const t = useTranslations('dashboard.account');
    const { getHref } = useDashboardHref();
    return (
        <div>
            <BreadcrumbsHeader
                title={t('title')}
                breadcrumbs={[
                    { label: t('settings'), href: getHref('settings') },
                    { label: t('title') },
                ]}
            />
            <DashboardCard>
                <EditableField label={t('fullName')} value="Peter Griffin" />
                <EditableField label={t('email')} placeholder="h***o@designdrops.op" />
                <EditableField label={t('phone')} placeholder={t('phonePlaceholder')} />
                <EditableField label={t('nationalId')} />
                <EditableField label={t('address')} />
            </DashboardCard>
        </div>
    );
}