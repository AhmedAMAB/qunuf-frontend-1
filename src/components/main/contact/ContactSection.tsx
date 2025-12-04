'use client'
import PageHeader from "@/components/shared/PageHeader";
import ContactForm from "./ContactForm";
import { getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";
import ContactMap from "./ContactMap";
import { useTranslations } from "next-intl";



export default function ContactSection() {
    const t = useTranslations("contact.information");

    return (
        <div className="bg-highlight pb-32 px-2">
            <div className="container">
                <PageHeader title={t("title")} className="bg-highlight pt-10 md:pt-12 lg:pt-[60px] md:mb-16 lg:mb-24" />

                <div className="md:mt-20 rounded-[10px] p-2 grid grid-cols-1 lg:grid-cols-12 max-lg:gap-6">
                    {/* Form side */}
                    <div className="col-span-6">
                        <ContactForm />
                    </div>
                    {/* Info side */}
                    <ContactMap />
                </div>
            </div>
        </div>
    );
}


