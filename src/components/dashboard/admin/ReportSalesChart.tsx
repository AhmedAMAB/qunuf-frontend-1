'use client'
import { BarChart } from "@/components/shared/charts/BarChart";
import EmptyState from "@/components/shared/EmptyState";
import { useTranslations } from "next-intl"
import { useEffect, useMemo, useState } from "react"

interface ReportSalesChartProps {
    data?: number[];
}

export function ReportSalesChart({ data = [] }: ReportSalesChartProps) {
    const tStat = useTranslations('dashboard.statistics');
    const tComman = useTranslations('comman');

    const labels = tComman.raw('weekdays') as string[];
    const chartData = useMemo
        (() => (data.length === 7 ? data : Array(7).fill(0)), [data]);

    const hasData = useMemo(() => chartData.some((val) => val > 0), [chartData]);

    const [resolvedColor, setResolvedColor] = useState<string>('#2F6B3E'); // fallback

    useEffect(() => {
        const cssVar = getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim();
        if (cssVar) setResolvedColor(cssVar);
    }, []);

    if (!hasData) {
        return (

            <EmptyState
                title={tStat('noChartData')}
            />
        );
    }

    return (
        <BarChart
            labels={labels}
            label={tStat('contractsCreated')}
            usePattern
            patternSpacing={30}
            patternStroke="#FFFFFF4D"
            data={chartData}
            barColors={Array(labels.length).fill(resolvedColor)}
        />
    );
}