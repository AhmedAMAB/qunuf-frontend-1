import PropertiesList from "@/components/pages/properties/PropertiesList";
import PageHeroSection from "@/components/atoms/PageHeroSection";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
    const t = await getTranslations("property.hero");

    return {
        title: t("title"), // 👈 localized title
    };
}

export default async function PropertyPage() {
    const t = await getTranslations('property.hero');

    return (
        <section
            id="property"
            className="relative">
            <PageHeroSection
                title={t('title')}
                description={t('description')}
                buttonText={t('seeMore')}
            />
            <PropertiesList />
        </section>
    );
}