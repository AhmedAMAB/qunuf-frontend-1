'use client'

import AdminDashboard from "@/components/dashboard/admin/AdminDashboard";
import LandlordDashboard from "@/components/dashboard/admin/LandlordDashboard";
import TenantDashboard from "@/components/dashboard/admin/TenantDashboard";
import { useAuth } from "@/contexts/AuthContext";



const dashboards: Record<string, React.ReactNode> = {
    admin: <AdminDashboard />,
    tenant: <TenantDashboard />,
    landlord: <LandlordDashboard />,
};

export default function DashboardPage() {
    const { role, loadingUser } = useAuth();

    if (loadingUser) {
        return (
            <div className="flex items-center justify-center h-full">
                Loading...
            </div>
        );
    }

    return (
        <div>
            {role ? dashboards[role] : (
                <div className="text-center text-gray-500">
                    You do not have access to dashboard.
                </div>
            )}
        </div>
    );
}