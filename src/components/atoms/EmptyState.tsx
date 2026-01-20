import { Link } from "@/i18n/navigation";
import { FiSearch } from "react-icons/fi";

interface EmptyStateProps {
    title?: string;
    message?: string;
    /** Button text (if empty → button is hidden) */
    actionLabel?: string;
    /** Called when button clicked (ignored if href exists) */
    onAction?: () => void;
    /** If provided → button becomes a Link */
    href?: string;
    /** Additional classes for the action button */
    actionClassName?: string;
}

export default function EmptyState({
    title = "No data found",
    message,
    actionLabel,
    onAction,
    href,
    actionClassName = "",
}: EmptyStateProps) {
    return (
        <div className="relative max-w-full flex py-16 md:py-24 min-h-[360px] items-center justify-center overflow-hidden rounded-2xl px-8">
            <div className="mx-auto flex w-full max-w-lg flex-col items-center justify-center">
                
                {/* Icon Container */}
                <header className="relative mb-8">
                    {/* Animated Background Circles */}
                    <svg
                        width="240"
                        height="240"
                        viewBox="0 0 240 240"
                        fill="none"
                        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30"
                    >
                        <defs>
                            <radialGradient
                                id="emptyStateGradient"
                                cx="0"
                                cy="0"
                                r="1"
                                gradientUnits="userSpaceOnUse"
                                gradientTransform="translate(120 120) scale(120)"
                            >
                                <stop stopColor="var(--secondary)" stopOpacity="0.3" />
                                <stop offset="1" stopColor="var(--secondary)" stopOpacity="0" />
                            </radialGradient>
                        </defs>
                        <g>
                            {[30, 50, 70, 90, 110].map((r) => (
                                <circle
                                    key={r}
                                    cx="120"
                                    cy="120"
                                    r={r}
                                    stroke="var(--secondary)"
                                    strokeOpacity="0.15"
                                    strokeWidth="1"
                                    fill="none"
                                />
                            ))}
                        </g>
                        <circle cx="120" cy="120" r="110" fill="url(#emptyStateGradient)" />
                    </svg>

                    {/* Main Icon */}
                    <div className="relative group">
                        {/* Glow effect */}
                        <div className="absolute -inset-2 bg-gradient-to-br from-secondary/30 via-secondary/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                        
                        {/* Icon container */}
                        <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-secondary/20 to-secondary/10 text-secondary shadow-lg ring-1 ring-secondary/20 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                            <FiSearch size={36} className="transition-transform duration-300 group-hover:scale-110" />
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="z-10 flex w-full max-w-md flex-col items-center justify-center mb-6 gap-3 text-center">
                    <h1 className="text-xl md:text-2xl font-bold text-dark">
                        {title}
                    </h1>
                    {message && (
                        <p className="text-sm md:text-base text-dark/60 leading-relaxed max-w-sm">
                            {message}
                        </p>
                    )}
                </main>

                {/* Action Button (optional) */}
                {actionLabel && (
                    <>
                        {href ? (
                            <Link
                                href={href}
                                className={`group z-10 relative px-6 py-3 rounded-xl bg-gradient-to-r from-secondary to-secondary-hover hover:from-primary hover:to-primary-hover text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg ${actionClassName}`}
                            >
                                {/* Glow effect */}
                                <div className="absolute -inset-1 bg-primary/30 rounded-xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-200" />
                                <span className="relative">{actionLabel}</span>
                            </Link>
                        ) : (
                            <button
                                onClick={onAction}
                                className={`group z-10 relative px-6 py-3 rounded-xl bg-gradient-to-r from-secondary to-secondary-hover hover:from-primary hover:to-primary-hover text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg ${actionClassName}`}
                            >
                                {/* Glow effect */}
                                <div className="absolute -inset-1 bg-primary/30 rounded-xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-200" />
                                <span className="relative">{actionLabel}</span>
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}