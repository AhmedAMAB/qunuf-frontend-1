'use client'
import { DoughnutChart } from "@/components/shared/charts/DoughnutChart";
import { useTranslations } from "next-intl"

export function CostBreakdownChart() {
    const t = useTranslations('dashboard.admin.costBreakdown');

    const labels = [
        t('maintenance'),
        t('repair'),
        t('taxes'),
        t('saving')
    ];

    const data = [300, 150, 200, 100]; // example values

    const colors = ['#A4C8AE', '#E5D6B8', '#C1D8DA', '#B8BED5'];

    return (
        <DoughnutChart
            centerText="$ 4,750"
            labels={labels}
            data={data}
            colors={colors}
        />
    );
}
