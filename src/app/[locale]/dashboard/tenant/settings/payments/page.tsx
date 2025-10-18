import SavedPaymentMethods from "@/components/dashboard/payments/SavedPaymentMethods";
import SettingsCard from "@/components/dashboard/settings/SettingsCard";
import BreadcrumbsHeader from "@/components/shared/BreadcrumbsHeader";
import { useTranslations } from "next-intl";
import { MdOutlinePayment } from "react-icons/md";
import { RiFundsBoxLine } from "react-icons/ri";


export default function PaymentsPage() {
    const t = useTranslations('dashboard.payments');

    return (
        <div>
            <BreadcrumbsHeader
                title={t('title')}
                breadcrumbs={[
                    { label: t('accountSettings'), href: `/dashboard/tenant/settings` },
                    { label: t('title') },
                ]}
            />

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch">

                <div className="col-span-1 sm:col-span-6">

                    <SettingsCard
                        title={t('totalEarnings')}
                        description="$430.00"
                        icon={RiFundsBoxLine}

                    />
                </div>
                <div className="col-span-1 sm:col-span-6">
                    <SettingsCard
                        title={t('pendingPayments')}
                        description="$100.00"
                        icon={MdOutlinePayment}
                    />
                </div>

                <SavedPaymentMethods />
            </div>
        </div>
    );
}