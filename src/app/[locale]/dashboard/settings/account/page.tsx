
import Account from "@/components/dashboard/settings/account/Account";
import BreadcrumbsHeader from "@/components/shared/BreadcrumbsHeader";
import { useTranslations } from "next-intl";


export default function AccountPage() {
    const t = useTranslations('dashboard.account');

    return (
        <>
            <BreadcrumbsHeader title={t('title')} breadcrumbs={[{ label: t('title') }]} />

            <Account />
        </>
    );
}
