

import AboutDepartments from "@/components/main/about/AboutDepartments";
import AboutInfoCard from "@/components/main/about/AboutInfoCard";
import AboutMainSection from "@/components/main/about/AboutMainSection";
import MainAboutSection from "@/components/main/about/MainAboutSection";
import TeamSection from "@/components/main/about/TeamSection";
import PageHeader from "@/components/shared/PageHeader";
import api from "@/libs/axios";
import { getLocale, getTranslations } from "next-intl/server";
import { CompanySection, type Team, type Department, type CompanyInfo } from "@/types/company";
import { resolveUrl } from "@/utils/upload";


export async function generateMetadata() {
    const t = await getTranslations("about");

    return {
        title: t("header"), // 👈 localized title
    };
}

export default async function AboutPage() {
    const t = await getTranslations("about");
    const locale = await getLocale()
    const isArabic = locale === 'ar';

    const [teamsRes, departmentsRes, companyInfoRes] = await Promise.all([
        api.get('/teams'),
        api.get('/departments'),
        api.get('/company-info'),
    ]);

    // Extract actual data
    const { records: TeamRecords } = teamsRes.data;

    // Explicitly type records as Team[]
    const teams: Team[] = TeamRecords;

    const { records: departmentsRecords } = departmentsRes.data;

    const departments: Department[] = departmentsRecords;
    const companyInfo: CompanyInfo[] = companyInfoRes.data || [];

    // Helper function to get localized text
    const getLocalizedText = (en: string, ar: string) => isArabic ? ar : en;

    // Create a map for company info by section

    // Create a map for company info by section
    const companyInfoMap = companyInfo.reduce((acc, item) => {
        acc[item.section] = item;
        return acc;
    }, {} as Record<string, CompanyInfo>);

    const historyInfo = companyInfoMap[CompanySection.HISTORY];
    const whyUsInfo = companyInfoMap[CompanySection.WHY_US];
    const visionInfo = companyInfoMap[CompanySection.VISION];
    const missionInfo = companyInfoMap[CompanySection.MISSION];
    const goalsInfo = companyInfoMap[CompanySection.GOALS];


    return (
        <section className="overflow-y-hidden lg:overflow-x-hidden">
            <MainAboutSection />
            <div className="bg-highlight 2xl:pb-[60px]" >
                <PageHeader title={t("header")} className="bg-highlight pt-10 md:pt-12 lg:pt-[60px] mb-12 md:mb-16 lg:mb-24" />
                <div className="container px-4 md:px-6 space-y-16 md:space-y-24">

                    <div className="flex flex-col gap-[60px] md:gap-[80px] lg:gap-[100px]">

                        {historyInfo && (
                            <AboutMainSection data-aos="fade-up" title={getLocalizedText(historyInfo.title_en, historyInfo.title_ar)} imageSrc={historyInfo.imagePath ? resolveUrl(historyInfo.imagePath) : '/about/History.jpg'} text={getLocalizedText(historyInfo.content_en, historyInfo.content_ar)} />
                        )}

                        {whyUsInfo && (
                            <AboutMainSection data-aos="fade-up" title={getLocalizedText(whyUsInfo.title_en, whyUsInfo.title_ar)} imageSrc={whyUsInfo.imagePath ? resolveUrl(whyUsInfo.imagePath) : '/about/Why.jpg'} reverse text={getLocalizedText(whyUsInfo.content_en, whyUsInfo.content_ar)} />
                        )}

                    </div>


                    <div className="flex flex-col gap-7 lg:flex-row md:flex-wrap">
                        {visionInfo && (
                            <AboutInfoCard
                                data-aos="fade-up" data-aos-delay="100"
                                title={getLocalizedText(visionInfo.title_en, visionInfo.title_ar)}
                                text={getLocalizedText(visionInfo.content_en, visionInfo.content_ar)}
                            />
                        )}

                        {missionInfo && (
                            <AboutInfoCard
                                data-aos="fade-up" data-aos-delay="200"
                                title={getLocalizedText(missionInfo.title_en, missionInfo.title_ar)}
                                text={getLocalizedText(missionInfo.content_en, missionInfo.content_ar)}
                            />
                        )}

                        {goalsInfo && (
                            <AboutInfoCard
                                data-aos="fade-up" data-aos-delay="300"
                                title={getLocalizedText(goalsInfo.title_en, goalsInfo.title_ar)}
                                text={getLocalizedText(goalsInfo.content_en, goalsInfo.content_ar)}
                            />
                        )}

                    </div>

                    <AboutDepartments departments={departments} isArabic={isArabic} />

                </div>
                <TeamSection teams={teams} locale={locale} isArabic={isArabic} />
            </div>
        </section>
    );
}