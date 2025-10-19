import { ReactNode } from "react";

interface StatCardProps {
    icon: ReactNode;
    label: string;
    value: number | string;
    trend?: string;
    trendColor?: string; // hex or rgba
    trendIcon?: ReactNode;
    subtext?: string;
}
export default function StatCard({
    icon,
    label,
    value,
    trend,
    trendColor = 'rgba(76,108,90,0.1)',
    trendIcon,
    subtext,
}: StatCardProps) {
    return (
        <div className="bg-card-bg rounded-[20px] p-4 md:p-5 space-y-4 h-full">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-dashboard-bg rounded-full">{icon}</div>
                <p className="text-lg md:text-xl font-medium">{label}</p>
            </div>

            <div className="flex items-center justify-between gap-1">
                <p className="text-[28px] md:text-[32px] lg:text-[36px] font-bold">{value}</p>
                <div className="flex gap-2 items-center flex-wrap md:flex-nowrap ">
                    <div
                        className="px-1 py-0.5 flex gap-1 items-center rounded-[8px] text-sm md:text-base"
                        style={{ background: trendColor }}
                    >
                        {trendIcon}
                        <span>{trend}</span>
                    </div>
                    {subtext && (
                        <p className="text-gray-500 text-sm">{subtext}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
