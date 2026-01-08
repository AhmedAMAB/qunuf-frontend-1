'use client';
import { Link, usePathname } from "@/i18n/navigation";
import Logo from "../Logo";
import SocialIcons from "./SocialIcons";
import { useLocale, useTranslations } from "next-intl";
import { useValues } from "@/contexts/GlobalContext";

// Simple skeleton component for placeholders
const Skeleton = ({ width = "w-32", height = "h-4" }) => (
    <div className={`bg-gray-600 animate-pulse rounded ${width} ${height}`} />
);

export default function Footer() {
    const t = useTranslations("footer");
    const locale = useLocale();
    const isAr = locale === 'ar';
    const { settings, loadingSettings } = useValues();

    return (
        <footer className="relative">
            {/* Background Image + Filter */}
            <div className="absolute inset-0 bg-[url('/footer.jpg')] bg-cover bg-[center_30%] z-[1] filter grayscale brightness-[35%] contrast-[120%] opacity-[0.65]"></div>

            <div className="container relative z-[3] py-18 ">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center sm:text-start mx-2">
                    {/* Logo + Description */}
                    <div className="space-y-3 flex flex-col items-center sm:items-start">
                        <div className="sm:ms-4">
                            <Logo />
                        </div>
                        <p className="text-sm sm:text-base text-white max-w-[370px] leading-relaxed">
                            {loadingSettings ? (
                                <div className="space-y-2">

                                    <Skeleton width="w-64" height="h-5" />
                                    <Skeleton width="w-62" height="h-5" />
                                    <Skeleton width="w-54" height="h-5" />
                                </div>
                            ) : (
                                isAr ? settings?.description_ar : settings?.description_en
                            )}
                        </p>

                        <SocialIcons />
                    </div>

                    {/* About Us */}
                    <div className="flex flex-col items-center sm:items-start">
                        <h2 className="mb-6 text-primary font-bold text-xl sm:text-2xl">
                            {t("about.title")}
                        </h2>
                        <ul className="flex flex-col gap-4">
                            <FooterLink href="/#home" label={t("about.menu")} />
                            <FooterLink href="/#features" label={t("about.features")} />
                            <FooterLink href="/blogs" label={t("about.blogs")} />
                            <FooterLink href="/contact" label={t("about.support")} />
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="flex flex-col items-center sm:items-start">
                        <h2 className="mb-6 text-primary font-bold text-xl sm:text-2xl">
                            {t("company.title")}
                        </h2>
                        <ul className="flex flex-col gap-4">
                            <FooterLink href="/about" label={t("company.about")} />
                            <FooterLink href="/terms" label={t("company.terms")} />
                            <FooterLink href="/privacy" label={t("company.privacy")} />
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col items-center sm:items-start">
                        <h2 className="mb-6 text-primary font-bold text-xl sm:text-2xl">
                            {t("contact.title")}
                        </h2>
                        <ul className="flex flex-col gap-4 text-white">
                            <li>
                                {loadingSettings ? (
                                    <Skeleton width="w-48" height="h-5" />
                                ) : (
                                    <p className="text-base md:text-lg">{settings?.address}</p>
                                )}
                            </li>
                            <li>
                                {loadingSettings ? (
                                    <Skeleton width="w-32" height="h-5" />
                                ) : (
                                    settings?.contactPhone && (
                                        <a
                                            href={`tel:${settings.contactPhone}`}
                                            className="text-base md:text-lg font-lighter hover:underline"
                                            dir="ltr"
                                        >
                                            {settings.contactPhone}
                                        </a>
                                    )
                                )}
                            </li>
                            <li>
                                {loadingSettings ? (
                                    <Skeleton width="w-40" height="h-5" />
                                ) : (
                                    settings?.contactEmail && (
                                        <a
                                            href={`mailto:${settings.contactEmail}`}
                                            className="hover:underline"
                                        >
                                            {settings.contactEmail}
                                        </a>
                                    )
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}


type FooterLinkProps = {
    href: string;
    label: string;
};
function FooterLink({ href, label }: FooterLinkProps) {
    const pathname = usePathname();

    // Check if the current path matches the href
    // We handle the locale prefix automatically if you're using next-intl middleware
    const isActive = pathname === href || pathname.startsWith(`${href}/`);

    return (
        <li>
            <Link
                href={href}
                className={`text-base transition-colors duration-200 ${isActive
                    ? "text-primary font-medium" // Active state styles
                    : "text-white hover:text-primary" // Default state styles
                    }`}
            >
                {label}
            </Link>
        </li>
    );
}