'use client'
import { BarChart } from "@/components/shared/charts/BarChart";
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

export function ReportSalesChart() {
    const tStat = useTranslations('dashboard.statistics');
    const tComman = useTranslations('comman');

    const labels = tComman.raw('weekdays') as string[];
    const data = [120, 90, 150, 80, 100, 130, 110];

    const [resolvedColor, setResolvedColor] = useState<string>('#2F6B3E'); // fallback

    useEffect(() => {
        const cssVar = getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim();
        if (cssVar) setResolvedColor(cssVar);
    }, []);

    return (
        <BarChart
            labels={labels}
            label={tStat('reportSales')}
            usePattern
            patternSpacing={30}
            patternStroke="#FFFFFF4D"
            data={data}
            barColors={Array(labels.length).fill(resolvedColor)}
        />
    );
}
