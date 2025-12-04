"use client";

import { useState, useEffect, useRef } from "react";
import { useNormalizedPath } from "@/hooks/useNormalizedPath";
import { Link } from "@/i18n/navigation";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import LocaleSwitcher from "../LocaleSwitcher";
import { useTranslations } from "next-intl";
import Logo from "../Logo";
import SecondaryButton from "../buttons/SecondaryButton";


export default function Header() {
    const { normalizedPath } = useNormalizedPath();
    const t = useTranslations("header");
    const [isSticky, setIsSticky] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const headerRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const toggleRef = useRef<HTMLButtonElement>(null);

    // Close menu when clicking outside
    useOutsideClick([menuRef, toggleRef], () => setMenuOpen(false));

    // Sticky header on scroll
    useEffect(() => {
        const handleFixed = () => {
            const isXL = window.innerWidth >= 1280;
            const threshold = isXL ? 18 : 0;
            setIsSticky(window.scrollY > threshold);
        };
        handleFixed();
        window.addEventListener("scroll", handleFixed);
        window.addEventListener("resize", handleFixed);
        return () => {
            window.removeEventListener("scroll", handleFixed)
            window.removeEventListener("resize", handleFixed)
        };
    }, []);

    const navLinks = [
        { label: t("nav.home"), href: "/" },
        { label: t("nav.realEstate"), href: "/properties" },
        { label: t("nav.blog"), href: "/blog" },
        { label: t("nav.about"), href: "/about" },
        { label: t("nav.contact"), href: "/contact" },
        { label: t("nav.dashboard"), href: "/dashboard" },
    ];

    return (
        <header
            id="main-header"
            ref={headerRef}
            className={`fixed xl:absolute left-0 w-full z-50 top-0 xl:top-[18px]  transition-colors ${isSticky ? "!fixed !top-0 left-0 w-full md:backdrop-blur-md md:bg-white/60 md:shadow-md z-50" : ""}`}>
            <div className={`w-full xl:max-w-[1208px] mx-auto flex items-center justify-between gap-4 transition-colors ${isSticky ? 'max-md:bg-white' : 'bg-[#FAFAFA]'} xl:rounded-full px-5 lg:px-8  py-3 md:py-5`}>
                {/* Logo */}

                <Logo />

                {/* Desktop nav */}
                <nav className="navbar hidden md:flex items-center gap-4 sm:gap-5 lg:gap-7 text-base sm:text-lg md:text-xl text-dark font-bold">
                    {navLinks.map(({ label, href }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`nav-item hover:text-secondary text-[15px] lg:text-[16px] pb-1 xl:text-lg 
                                ${normalizedPath === href ? "text-secondary border-b-[3px] border-b-secondary" : ""}`}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                {/* Language (desktop) */}
                <div className="flex items-center gap-2 ">
                    <SecondaryButton href="/auth/sign-in" className="bg-secondary hover:bg-secondary-hover text-white">
                        {t("nav.login")}
                    </SecondaryButton>
                    <LocaleSwitcher />

                    {/* Mobile controls */}
                    <button
                        ref={toggleRef}
                        id="menu-toggle"
                        aria-controls="mobile-menu"
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="md:hidden rounded-md border border-transparent transition-transform duration-300 ease-in-out"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-6 w-6 transform transition-transform duration-300 ease-in-out ${menuOpen ? "rotate-90" : "rotate-0"
                                }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {menuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>

                </div>
            </div>

            {/* Mobile menu */}
            <div
                id="mobile-menu"
                ref={menuRef}
                className={`md:hidden p-4 absolute top-full left-0 w-full overflow-hidden transition-all duration-500 ease-in-out ${menuOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto bg-[#FAFAFA] shadow-lg"
                    : "opacity-0 -translate-y-4 pointer-events-none bg-[#FAFAFA] shadow-lg"
                    }`}
            >

                <nav className={`flex flex-col transition-all duration-500 text-[#212529] divide-y divide-gray-200`}>
                    {navLinks.map(({ label, href }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setMenuOpen(false)}
                            className={`mobile-navitem block py-3 px-3  font-medium hover:text-secondary transition-colors 
                                ${normalizedPath === href ? "text-secondary" : ""}`}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>
            </div>

        </header>
    );
}
