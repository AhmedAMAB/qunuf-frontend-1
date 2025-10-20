import { ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type PrimaryButtonProps = {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    href?: string; // 👈 optional link
    type?: "button" | "submit" | "reset";
};

export default function PrimaryButton({
    children,
    className = "",
    onClick,
    href,
    type = "button",
    ...props
}: PrimaryButtonProps) {
    const baseClasses =
        "px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-[70px] flex-center text-dark";

    if (href) {
        return (
            <Link
                href={href}
                className={`${baseClasses} ${className}`}
                {...props}
            >
                {children}
            </Link>
        );
    }

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseClasses} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
