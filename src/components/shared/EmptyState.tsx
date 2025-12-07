
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
    message = "Try adjusting your search or filters.",
    actionLabel,
    onAction,
    href, // optional navigation link
    actionClassName = "",
}: EmptyStateProps) {
    return (
        <div className="relative max-w-full md:min-w-[520px] flex py-32 min-h-[360px] items-center justify-center gap-3 overflow-hidden rounded-[20px]  px-8 mt-20">
            <div className="mx-auto flex w-full max-w-lg flex-col items-center justify-center">

                <header className="relative mb-5">

                    {/* Animated Background */}
                    <svg
                        width="480"
                        height="480"
                        viewBox="0 0 480 480"
                        fill="none"
                        className="text-border-secondary pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                        <mask id="mask0" maskUnits="userSpaceOnUse" x="0" y="0" width="480" height="480">
                            <rect width="480" height="480" fill="url(#radialGradient)" />
                        </mask>
                        <g mask="#F0F1F2">
                            {[47.5, 79.5, 111.5, 143.5, 175.5, 207.5, 239.5].map((r) => (
                                <circle key={r} cx="240" cy="240" r={r} stroke="#F0F1F2" />
                            ))}
                        </g>
                        <defs>
                            <radialGradient
                                id="radialGradient"
                                cx="0"
                                cy="0"
                                r="1"
                                gradientUnits="userSpaceOnUse"
                                gradientTransform="translate(240 240) rotate(90) scale(240 240)"
                            >
                                <stop />
                                <stop offset="1" stopOpacity="0" />
                            </radialGradient>
                        </defs>
                    </svg>

                    {/* Main Icon */}
                    <div className="
    relative flex items-center justify-center
    w-12 h-12
    bg-lighter      /* soft warm background */
    text-gray-dark   /* warm dark icon color */
    shadow-sm        /* subtle depth */
    ring-1 ring-inset ring-gray
    rounded-xl
">
                        <FiSearch size={24} />
                    </div>

                </header>

                {/* Content */}
                <main className="z-10 flex w-full max-w-88 flex-col items-center justify-center mb-8 gap-2">
                    <h1 className="text-primary text-xl font-semibold">{title}</h1>
                    <p className="text-center text-base text-tertiary">{message}</p>
                </main>

                {/* Action Button (optional) */}
                {actionLabel && (
                    <>
                        {href ? (
                            <Link
                                href={href}
                                className={`z-10 mt-2 px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover transition ${actionClassName}`}
                            >
                                {actionLabel}
                            </Link>
                        ) : (
                            <button
                                onClick={onAction}
                                className={`z-10 mt-2 px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover transition ${actionClassName}`}
                            >
                                {actionLabel}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
