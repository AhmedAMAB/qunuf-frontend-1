'use client';

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Team } from "@/types/company";
import { resolveUrl } from "@/utils/upload";
import NavigationButtons from "@/components/atoms/NavigationButtons";

import ImageAlt from "@/components/atoms/ImageAlt";
import Image from "next/image";

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

                <NavigationButtons prevClassName="team-prev" nextClassName="team-next" />

            </div>
        </section>
    );
}


interface TeamMemberCardProps {
    imageSrc: string;
    name: string;
    job: string;
    description: string;
}


function TeamMemberCard({ imageSrc, name, job, description }: TeamMemberCardProps) {
    return (
        <div className="team-member w-full max-w-[400px] rounded-[24px] p-6 flex flex-col" data-aos="fade-up">
            {/* Image */}
            <div className="relative w-full aspect-square rounded-[24px] overflow-hidden bg-light mb-6">
                {imageSrc ? <Image
                    src={imageSrc}
                    alt={name}
                    fill
                    className="object-cover rounded-[24px] grayscale"
                /> : (
                    <ImageAlt title={name} />
                )}
            </div>

            {/* Name */}
            <h2 className="font-['Playfair_Display'] font-normal text-[28px] md:text-[32px] lg:text-[40px] leading-[100%] text-gray-dark mb-3">
                {name}
            </h2>

            {/* Job */}
            <p className="mb-3 font-normal text-[12px] md:text-[14px] leading-[100%] uppercase text-gray-dark">
                {job}
            </p>

            {/* Description */}
            <p className="mt-4 font-normal text-[16px] md:text-[18px] leading-[24px] md:leading-[27px] text-gray-dark">
                {description}
            </p>
        </div>
    );
}
