import { Link } from '@/i18n/navigation';
import { MdChevronRight } from 'react-icons/md';
import { cn } from '@/lib/utils';

interface Breadcrumb {
    label: string;
    href?: string;
}

interface BreadcrumbsHeaderProps {
    breadcrumbs: Breadcrumb[];
    title: string;
    children?: React.ReactNode;
    className?: string;
}

export default function BreadcrumbsHeader({
    breadcrumbs,
    title,
    children,
    className
}: BreadcrumbsHeaderProps) {
    return (
        <div className={cn("mb-8 space-y-4", className)}>
            {/* Breadcrumbs + Actions Row */}
            <div className="flex justify-between items-center flex-wrap gap-3">
                {/* Breadcrumbs */}
                <nav
                    className="flex items-center gap-2 text-sm font-medium flex-wrap"
                    aria-label="Breadcrumb"
                >
                    {breadcrumbs.map((item, index) => {
                        const isLast = index === breadcrumbs.length - 1;
                        return (
                            <div key={index} className="flex items-center gap-2">
                                {/* Separator */}
                                {index > 0 && (
                                    <MdChevronRight
                                        size={18}
                                        className="text-dark/30 rtl:rotate-180"
                                    />
                                )}

                                {/* Breadcrumb Item */}
                                {isLast || !item.href ? (
                                    <span className={cn(
                                        "px-3 py-1.5 rounded-lg font-semibold transition-all duration-200",
                                        isLast
                                            ? "bg-gradient-to-r from-secondary/15 to-primary/15 text-primary"
                                            : "text-dark/60"
                                    )}>
                                        {item.label}
                                    </span>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "group px-3 py-1.5 rounded-lg font-semibold",
                                            "text-dark/70 hover:text-primary hover:bg-secondary/10",
                                            "transition-all duration-200 relative"
                                        )}
                                    >
                                        {/* Hover underline effect */}
                                        <span className="relative">
                                            {item.label}
                                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-200" />
                                        </span>
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Actions */}
                {children && (
                    <div className="flex items-center gap-2">
                        {children}
                    </div>
                )}
            </div>

            {/* Page Title */}
            <div className="relative">
                {/* Decorative gradient line */}
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-secondary via-primary to-secondary rounded-full" />

                <h1 className="text-3xl sm:text-4xl font-bold text-dark bg-gradient-to-r from-dark via-dark/90 to-dark/70 bg-clip-text leading-tight">
                    {title}
                </h1>
            </div>
        </div>
    );
}