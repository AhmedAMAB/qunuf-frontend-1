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
        <div className={`relative group bg-card-bg rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray/10 ${className}`}>
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            {/* Content */}
            <div className="relative">
                {/* Header */}
                {(title || linkLabel) && (
                    <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray/10">
                        {title && (
                            <h3 className="font-bold text-lg md:text-xl text-dark">
                                {title}
                            </h3>
                        )}
                        {linkLabel && linkHref && (
                            <Link 
                                href={linkHref} 
                                className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-primary transition-colors duration-200"
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

                {/* Children */}
                {children}
            </div>
        </div>
    );
}