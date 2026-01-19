import { ReactNode } from "react";
import { Link } from "@/i18n/navigation";

interface DashboardCardProps {
    title?: string;
    linkLabel?: string;
    linkHref?: string;
    children?: ReactNode;
    className?: string;
}
export default function DashboardCard({
    title,
    linkLabel,
    linkHref,
    children,
    className
}: DashboardCardProps) {
    return (
        <div className={`relative group bg-card-bg rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray/10 flex flex-col overflow-hidden transform-gpu ${className}`}>

            {/* 1. Subtle gradient overlay - Optimized with invisible to prevent lag */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5 rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none" />

            {/* Header - Fixed at top */}
            {(title || linkLabel) && (
                <div className="relative z-10 flex items-center justify-between p-5 md:p-6 pb-4 border-b border-gray/10 bg-card-bg/50 backdrop-blur-sm shrink-0">
                    {title && (
                        <h3 className="font-bold text-lg md:text-xl text-dark line-clamp-1">
                            {title}
                        </h3>
                    )}
                    {linkLabel && linkHref && (
                        <Link
                            href={linkHref}
                            className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-primary transition-colors duration-200 shrink-0"
                        >
                            <span>{linkLabel}</span>
                            <svg
                                className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    )}
                </div>
            )}

            {/* 2. Scrollable Content Area */}
            <div className="relative flex-1 overflow-y-auto custom-scrollbar p-5 md:p-6 pt-2">
                {children}
            </div>
        </div>
    );
}