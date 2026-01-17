
import LandlordRenewRequests from "@/components/dashboard/landlord/LandlordRenewRequests";
import TenantRenewRequests from "@/components/dashboard/tenant/TenantRenewRequests";
import { getUserRole } from "@/utils/auth";



export default async function RenewRequestsPage() {
    const role = await getUserRole();
    return (
        <div>
            <TenantRenewRequests />
        </div>

    )
}
