'use client'
import { DoughnutChart } from "@/components/shared/charts/DoughnutChart";
import { useTranslations } from "next-intl"
import { ContractStatus } from "@/types/dashboard/contract";
import { useMemo } from "react";
import EmptyState from "@/components/shared/EmptyState";

interface CostBreakdownChartProps {
    statusBreakdown?: Record<string, number>;
    totalContracts?: number;
}

export function CostBreakdownChart({ statusBreakdown = {}, totalContracts = 0 }: CostBreakdownChartProps) {
    const tdash = useTranslations('dashboard.statistics');
    const t = useTranslations('dashboard.contracts.table.statusOptions');
    // Map contract statuses to labels
    const statusLabels: Record<string, string> = {
        [ContractStatus.PENDING_LANDLORD_ACCEPTANCE]: t('pending_landlord_acceptance'),
        [ContractStatus.PENDING_TENANT_ACCEPTANCE]: t('pending_tenant_acceptance'),
        [ContractStatus.PENDING_SIGNATURE]: t('pending_signature'),
        [ContractStatus.ACTIVE]: t('active'),
        [ContractStatus.TERMINATED]: t('terminated'),
        [ContractStatus.CANCELLED]: t('cancelled'),
        [ContractStatus.EXPIRED]: t('expired'),
    };

    // Extract statuses that have counts
    const { statuses, labels, data } = useMemo(() => {
        const statuses = Object.keys(statusLabels).filter(status => (statusBreakdown[status] || 0) > 0);
        const labels = statuses.map(status => statusLabels[status]);
        const data = statuses.map(status => statusBreakdown[status] || 0);

        return { statuses, labels, data };
    }, [statusLabels, statusBreakdown]);


    const hasData = useMemo(() => data.some((val) => val > 0), [data]);
    if (!hasData) {
        return (

            <EmptyState
                title={tdash('noChartData')}
            />
        );
    }

    // Colors for different statuses
    const colors = ['#A4C8AE', '#E5D6B8', '#C1D8DA', '#B8BED5', '#D4A5A5', '#C4B5FD', '#FDE68A'];

    return (
        <DoughnutChart
            centerText={totalContracts.toString()}
            labels={labels}
            data={data}
            colors={colors.slice(0, labels.length)}
        />
    );
}
