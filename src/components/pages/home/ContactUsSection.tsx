'use client'
import PrimaryButton from "@/components/shared/buttons/PrimaryButton";
import Image from "next/image";
import { useTranslations } from "next-intl";
import api from "@/libs/axios";
import toast from "react-hot-toast";
import { useState } from "react";


export default function ContactUsSection() {
    const t = useTranslations("homePage.contactUs");
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) return;

        setLoading(true);
        try {

            await api.post('/blogs/subscribe', { email });

            toast.success(t("successMessage"));
            setEmail(''); // Clear input on success
        } catch (error: any) {
            console.error("Subscription error", error);
            toast.error(error?.response?.data?.message || t("errorMessage"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <section
            className="my-8 overflow-hidden"
            style={{
                background: "linear-gradient(90deg, var(--lighter) 0%, var(--light) 100%)",
            }}
        >
            <div className="container flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-10">
                {/* Text Section */}
                <div className="space-y-6 md:space-y-10 flex-1 mx-2 py-10">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[50px] text-dark font-bold leading-tight">
                        {t("title")}
                    </h1>
                    <p className="text-sm sm:text-base text-dark leading-[26px] max-w-[700px]">
                        {t("description")}
                    </p>

                    {/* Input + Button Form */}
                    <form onSubmit={handleSubscribe} className="bg-white rounded-full flex w-full md:w-[500px] overflow-hidden border border-transparent focus-within:border-primary transition-all shadow-sm">
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            className="bg-white w-full rounded-full px-5 py-2 sm:py-4 placeholder:text-input placeholder:opacity-50 text-sm sm:text-base focus:outline-0 disabled:opacity-50"
                            placeholder={t("placeholder")}
                        />
                        <PrimaryButton
                            type="submit"
                            className={`bg-primary transition-all hover:bg-primary-hover text-white text-nowrap px-6 sm:px-10 font-bold ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? t("loading") : t("button")}
                        </PrimaryButton>
                    </form>
                </div>

                {/* Image Section */}
                <div className="relative flex-1 w-full h-[400px] lg:h-[620px]">
                    <Image
                        src="/contact-image.png"
                        alt="contact"
                        fill
                        className="object-contain lg:object-cover pointer-events-none"
                    />
                </div>
            </div>
        </section>
    );
}