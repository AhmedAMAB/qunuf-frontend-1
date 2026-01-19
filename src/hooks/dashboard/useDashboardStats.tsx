import api from "@/libs/axios";
import { useCallback, useEffect, useState } from "react";

interface stat {
    value: number;
    changePercent: number; // + or - compared to last week
}

interface DashboardStats {
    totalProperties?: stat;
    freeProperties?: stat;
    rentedProperties?: stat;
    totalReviews?: stat;
    activeContracts?: stat;
    totalPendingRenewRequests?: stat;
    totalAmountWithEjar?: stat;

}

interface ChartData {
    contractsPerDay?: number[];
    statusBreakdown?: Record<string, number>;
    totalContracts?: number;
    rentedAnalytics?: number[];
}

interface RecentContract {
    id: string;
    propertyName: string;
    propertyId: string;
    date: string | Date; // Date from backend, string in frontend
    status: string;
    price: number;
    property?: {
        id: string;
        slug: string;
        images?: Array<{ url: string; is_primary: boolean }>;
    };
    // Added Review interface
    review: {
        id: string;
        rate: number;
        comment?: string | null;
    } | null;
}

interface RecentProperty {
    id: string;
    name: string;
    slug: string;
    imageSrc: string;
    address: string;
    date: string;
    rating: number;
}

export function useDashboardStats() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [recentContracts, setRecentContracts] = useState<RecentContract[]>([]);
    const [recentProperties, setRecentProperties] = useState<RecentProperty[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [statsRes, chartRes, contractsRes, propertiesRes] = await Promise.all([
                api.get('/contracts/dashboard/stats'),
                api.get('/contracts/dashboard/chart-data'),
                api.get('/contracts/dashboard/recent'),
                api.get('/properties/dashboard/recent'),
            ]);

            setStats(statsRes.data);
            setChartData(chartRes.data);
            setRecentContracts(contractsRes.data || []);
            setRecentProperties(propertiesRes.data || []);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    return {
        stats,
        chartData,
        recentContracts,
        recentProperties,
        loading,
        error,
        refetch: fetchDashboardData,
    };
}
