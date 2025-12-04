'use client';

import PageHeader from "@/components/shared/PageHeader";
import TeamMemberCard from "./TeamMemberCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";
import { Team } from "@/types/company";
import { resolveUrl } from "@/utils/upload";

interface TeamSectionProps {
    teams: Team[];
    locale: string;
    isArabic: boolean;
}

export default function TeamSection({ teams, locale, isArabic }: TeamSectionProps) {
    const [perView, setPerView] = useState(1);
    const [activeIndex, setActiveIndex] = useState(0);

    const t = useTranslations("about");

    // Helper function to get localized text
    const getLocalizedText = (en: string, ar: string) => isArabic ? ar : en;


    if (!teams || teams.length === 0) {
        return (
            <section className="about-team relative bg-white py-12">
                <div className="text-center space-y-2 mb-3">
                    <p className="text-[#303030] uppercase">{t('yourHostsAndGuides')}</p>
                    <h1 className="text-center">
                        <span className="font-['Playfair_Display'] font-normal text-[40px] md:text-[50px] lg:text-[60px] leading-[100%]">
                            {t('meetYour')}
                        </span>
                        <br className="my-2" />
                        <span className="font-['Playfair_Display'] font-extrabold italic text-[44px] md:text-[54px] lg:text-[64px] leading-[100%]">
                            {t('facilitators')}
                        </span>
                    </h1>
                </div>
                <div className="text-center text-gray-500 py-8">
                    <p>{t('noTeamsAvailable') || 'No team members available at the moment.'}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="about-team relative bg-white py-12" data-aos="fade-up">
            <div className="text-center space-y-2 mb-3">
                <p className="text-[#303030] uppercase">{t('yourHostsAndGuides')}</p>
                <h1 className="text-center">
                    <span className="font-['Playfair_Display'] font-normal text-[40px] md:text-[50px] lg:text-[60px] leading-[100%]">
                        {t('meetYour')}
                    </span>
                    <br className="my-2" />
                    <span className="font-['Playfair_Display'] font-extrabold italic text-[44px] md:text-[54px] lg:text-[64px] leading-[100%]">
                        {t('facilitators')}
                    </span>
                </h1>
            </div>

            <div className="relative max-w-7xl mx-auto px-4">
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={30}
                    navigation={{
                        nextEl: ".team-next",
                        prevEl: ".team-prev",
                    }}
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1280: { slidesPerView: 3 }, // 👈 3 slides on laptop
                    }}
                    className="swiper"
                    onSlideChange={(swiper) => {
                        const pv = swiper.params.slidesPerView as number;
                        setPerView(pv);
                        setActiveIndex(swiper.realIndex); // 👈 track the actual active slide
                    }}
                >
                    {teams.map((member) => (
                        <SwiperSlide key={member.id}>
                                <TeamMemberCard
                                    imageSrc={resolveUrl(member.imagePath)}
                                    name={member.name}
                                    job={member.job}
                                    description={getLocalizedText(member.description_en, member.description_ar)}
                                />

                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Navigation buttons */}
                <button className="team-next flex-center w-[45px] h-[45px]  absolute top-1/2 -translate-y-1/2 -left-2 lg:-left-10 z-10">
                    <MdOutlineArrowBackIos size={32} className="" />
                </button>
                <button className="team-prev flex-center w-[45px] h-[45px]  absolute top-1/2 -translate-y-1/2 -right-2 lg:-right-10 z-10">
                    <MdOutlineArrowForwardIos size={32} className="" />
                </button>
            </div>
        </section>
    );
}
