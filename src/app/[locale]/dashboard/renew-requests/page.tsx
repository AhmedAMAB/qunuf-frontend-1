
import LandlordRenewRequests from "@/components/dashboard/landlord/LandlordRenewRequests";
import TenantRenewRequests from "@/components/dashboard/tenant/TenantRenewRequests";
import { getUserRole } from "@/utils/auth";

const pages: Record<string, React.ReactNode> = {
    tenant: <TenantRenewRequests />,
    landlord: <LandlordRenewRequests />,
};

export default async function RenewRequestsPage() {
    const role = await getUserRole();
    return (
        <div>
            {pages[role]}
        </div>

    )
}
