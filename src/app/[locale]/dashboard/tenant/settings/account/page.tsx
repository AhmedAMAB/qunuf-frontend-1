import DashboardCard from "@/components/dashboard/DashboardCard";
import EditableField from "@/components/dashboard/EditableField";
import BreadcrumbsHeader from "@/components/shared/BreadcrumbsHeader";
import { useTranslations } from "next-intl";


export default function AccountPage() {
    const t = useTranslations('dashboard.account');

    return (
        <div>
            <BreadcrumbsHeader
                title={t('title')}
                breadcrumbs={[
                    { label: t('settings'), href: `/dashboard/tenant/settings` },
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
