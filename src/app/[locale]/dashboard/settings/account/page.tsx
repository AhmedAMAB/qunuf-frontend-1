
import Account from "@/components/dashboard/settings/account/Account";
import { useTranslations } from "next-intl";


export default function AccountPage() {
    const t = useTranslations('dashboard.account');

    return (
        <Account />
    );
}
