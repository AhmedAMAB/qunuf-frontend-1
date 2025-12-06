'use client'

import LandlordRenewRequests from "@/components/dashboard/landlord/LandlordRenewRequests";
import TenantRenewRequests from "@/components/dashboard/tenant/TenantRenewRequests";
import { useAuth } from "@/contexts/AuthContext";

const pages: Record<string, React.ReactNode> = {
    tenant: <TenantRenewRequests />,
    landlord: <LandlordRenewRequests />,
};

export default function RenewRequestsPage() {
    const { role, loadingUser } = useAuth();

    if (!loadingUser) {
        return (
            <div className="flex items-center justify-center h-full">
                Loading...
            </div>
        );
    }
    return (
        <div>
            {role ? pages[role] : (
                <div className="text-center text-gray-500">
                    You do not have access to renew requests.
                </div>
            )}
        </div>

    )
}
