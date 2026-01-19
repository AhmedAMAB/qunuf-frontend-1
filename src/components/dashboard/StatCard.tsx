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
    trendColor = 'rgba(47, 107, 62, 0.1)',
    trendIcon,
    subtext,
}: StatCardProps) {
    return (
        <div className="bg-card-bg relative group  rounded-2xl p-5 md:p-6 h-full shadow-sm hover:shadow-lg transition-all duration-300 border border-gray/10 overflow-hidden">
            {/* Gradient background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Content */}
            <div className="relative space-y-4">
                {/* Icon and Label */}
                <div className="flex items-center gap-3">
                    {/* Icon Container */}
                    <div className="relative">
                        {/* Glow effect on hover */}
                        <div className="absolute -inset-1 bg-gradient-to-br from-secondary/30 to-primary/30 rounded-full opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
                        
                        {/* Icon */}
                        <div className="relative p-3 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-sm">
                            {icon}
                        </div>
                    </div>
                    
                    {/* Label */}
                    <h3 className="text-base md:text-lg font-semibold text-dark group-hover:text-primary transition-colors duration-200">
                        {label}
                    </h3>
                </div>

                {/* Value and Trend */}
                <div className="flex items-end justify-between gap-3 flex-wrap">
                    {/* Main Value */}
                    <div className="flex-shrink-0">
                        <p className="text-3xl md:text-4xl lg:text-[42px] font-bold text-dark bg-gradient-to-br from-dark to-dark/80 bg-clip-text">
                            {value}
                        </p>
                    </div>

                    {/* Trend and Subtext */}
                    {(trend || subtext) && (
                        <div className="flex flex-col items-end gap-1.5">
                            {/* Trend Badge */}
                            {trend && (
                                <div
                                    className="px-2.5 py-1 flex gap-1.5 items-center rounded-lg text-sm font-semibold shadow-sm transition-transform duration-200 hover:scale-105"
                                    style={{ background: trendColor }}
                                >
                                    {trendIcon && (
                                        <span className="flex-shrink-0">{trendIcon}</span>
                                    )}
                                    <span>{trend}</span>
                                </div>
                            )}
                            
                            {/* Subtext */}
                            {subtext && (
                                <p className="text-xs md:text-sm text-dark/60 font-medium">
                                    {subtext}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-secondary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
    );
}