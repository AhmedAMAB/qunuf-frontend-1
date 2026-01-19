
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface PageHeroSectionProps {
    title: string;
    description?: string;
    buttonText?: string;
    imageSrc?: string;
    gradient?: string;
}

interface PageHeroSectionProps {
    title: string;
    description?: string;
    buttonText?: string;
    buttonHref?: string;
    imageSrc?: string;
    onButtonClick?: () => void;
}

export default function PageHeroSection({
    title,
    description,
    buttonText = 'Learn more',
    buttonHref,
    imageSrc = '/main.jpg',
    onButtonClick,
}: PageHeroSectionProps) {
    const t = useTranslations('hero');
    const ButtonContent = (
        <button
            onClick={onButtonClick}
            className={cn(
                "group relative inline-flex items-center justify-center gap-2",
                "rounded-full px-8 py-3.5 text-base font-semibold",
                "bg-primary text-white overflow-hidden",
                "transition-all duration-300",
                "hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30",
                "hover:scale-105 active:scale-95",
                "animate__animated animate__fadeInUp animate__delay-3s"
            )}
        >
            {/* Shine effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

            <span className="relative z-10">{buttonText}</span>

            {/* Arrow icon */}
            <svg
                className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
        </button>
    );

    return (
        <section className="relative overflow-hidden">
            {/* Enhanced gradient background */}
            <div
                className="absolute inset-0"
                style={{
                    background: `
                        linear-gradient(
                            135deg,
                            var(--lighter) 0%,
                            var(--highlight) 55%,
                            var(--lighter) 100%
                        )
                    `,
                }}
            />

            {/* Decorative floating shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-lightGold/20 rounded-full blur-3xl animate__animated animate__fadeIn animate__slower" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate__animated animate__fadeIn animate__delay-1s animate__slower" />
                <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-light/10 rounded-full blur-3xl animate__animated animate__fadeIn animate__delay-2s animate__slower" />
            </div>

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `
                        linear-gradient(var(--secondary) 1px, transparent 1px),
                        linear-gradient(90deg, var(--secondary) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                }}
            />

            <div className="relative container mx-auto px-6 lg:px-12 min-h-[75vh] flex items-center py-16 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center w-full">

                    {/* Left: Text Content */}
                    <div className="max-w-xl space-y-6 lg:space-y-8">

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 animate__animated animate__fadeInLeft">
                            <div className="w-8 h-px bg-gradient-to-r from-secondary to-transparent" />
                            <span className="text-xs sm:text-sm font-semibold tracking-widest text-secondary uppercase">
                                {t('eyebrow')}
                            </span>
                        </div>

                        {/* Main Title */}
                        <h1 className={cn(
                            "text-4xl sm:text-5xl lg:text-6xl xl:text-7xl",
                            "font-bold leading-[1.1] tracking-tight text-dark",
                            "animate__animated animate__fadeInLeft animate__delay-1s"
                        )}>
                            {title.split(' ').map((word, index) => (
                                <span
                                    key={index}
                                    className="inline-block hover:text-primary transition-colors duration-300"
                                >
                                    {word}{' '}
                                </span>
                            ))}
                        </h1>

                        {/* Description */}
                        {description && (
                            <p className={cn(
                                "text-base sm:text-lg lg:text-xl leading-relaxed",
                                "text-input font-medium",
                                "animate__animated animate__fadeInLeft animate__delay-2s"
                            )}>
                                {description}
                            </p>
                        )}

                        {/* CTA Button */}
                        <div className="pt-2">
                            {buttonHref ? (
                                <a href={buttonHref}>
                                    {ButtonContent}
                                </a>
                            ) : (
                                ButtonContent
                            )}
                        </div>

                        {/* Stats or Trust Badges (Optional) */}
                        <div className={cn(
                            "flex items-center gap-8 pt-4",
                            "animate__animated animate__fadeInLeft animate__delay-3s"
                        )}>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                                <span className="text-sm font-medium text-grey-dark">
                                    {t('trusted')}
                                </span>
                            </div>

                            <div className="h-6 w-px bg-gray/50" />
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-75" />
                                <span className="text-sm font-medium text-grey-dark">
                                    {t('satisfaction')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Image */}
                    <div className={cn(
                        "relative flex justify-center lg:justify-end",
                        "animate__animated animate__fadeInRight animate__delay-1s"
                    )}>
                        {/* Decorative background circle */}
                        <div className="absolute inset-0 flex items-center justify-center lg:justify-end">
                            <div className="w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] xl:w-[600px] xl:h-[600px] rounded-full bg-gradient-to-br from-secondary/20 via-light/10 to-transparent blur-2xl animate-pulse" />
                        </div>

                        {/* Image container with decorative frame */}
                        <div className="relative group">
                            {/* Decorative corner accents */}
                            <div className="absolute -top-4 -left-4 w-16 h-16 border-t-4 border-l-4 border-secondary rounded-tl-2xl opacity-60 transition-all duration-500 group-hover:w-20 group-hover:h-20 group-hover:opacity-100" />
                            <div className="absolute -bottom-4 -right-4 w-16 h-16 border-b-4 border-r-4 border-primary rounded-br-2xl opacity-60 transition-all duration-500 group-hover:w-20 group-hover:h-20 group-hover:opacity-100" />

                            {/* Main Image */}
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-secondary/20 transition-all duration-500 group-hover:shadow-3xl group-hover:shadow-secondary/30 group-hover:scale-105">
                                <Image
                                    src={imageSrc}
                                    alt="Hero illustration"
                                    width={600}
                                    height={600}
                                    priority
                                    className="object-contain w-full h-auto transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Shine overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-transparent group-hover:via-white/20 transition-all duration-700 -translate-x-full group-hover:translate-x-full" />
                            </div>

                            {/* Floating badge */}
                            <div className={cn(
                                "absolute -bottom-6 -left-6 bg-dashboard-bg rounded-2xl shadow-xl p-4",
                                "border-2 border-secondary/20",
                                "animate__animated animate__fadeInUp animate__delay-3s",
                                "hover:scale-110 transition-transform duration-300"
                            )}>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div>
                                            <p className="text-xs font-medium text-placeholder">
                                                {t('quality')}
                                            </p>
                                            <p className="text-lg font-bold text-dark">
                                                {t('guaranteed')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom fade transition */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/70 via-white/30 to-transparent pointer-events-none" />
        </section>
    );
}