
import { Link } from "@/i18n/navigation";
import { MdChevronRight } from "react-icons/md";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsHeaderProps {
    breadcrumbs: BreadcrumbItem[];
    title: string;
}

export default function BreadcrumbsHeader({ breadcrumbs, title }: BreadcrumbsHeaderProps) {
    return (
        <div className="mb-6">
            <nav className="flex items-center gap-1 text-base text-gray-500 font-medium flex-wrap">
                {breadcrumbs.map((item, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    return (
                        <div key={index} className="flex items-center gap-1 text-secondary">
                            {index > 0 && <MdChevronRight size={16} className="text-gray-400" />}
                            {isLast || !item.href ? (
                                <span>{item.label}</span>
                            ) : (
                                <Link href={item.href} className="text-dark hover:underline">
                                    {item.label}
                                </Link>
                            )}
                        </div>
                    );
                })}
            </nav>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-2">{title}</h1>
        </div>
    );
}
