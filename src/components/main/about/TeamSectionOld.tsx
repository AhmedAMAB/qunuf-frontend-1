'use client';

import PageHeader from "@/components/shared/PageHeader";
import TeamMember from "./TeamMemberOld";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { useState } from "react";
import { useTranslations } from "next-intl";

const members = [
    { name: "John Carvan", imageSrc: "/about/team/user-2.png" },
    { name: "Miss Smith Ellen", imageSrc: "/about/team/user-1.png" },
    { name: "John Carvan", imageSrc: "/about/team/user-2.png" },
    { name: "Jane Doe", imageSrc: "/about/team/user-1.png" },
    { name: "Michael Smith", imageSrc: "/about/team/user-2.png" },
];

export default function TeamSection() {
    const [perView, setPerView] = useState(1);
    const [activeIndex, setActiveIndex] = useState(0);

    const t = useTranslations("about.team");

    if (!members || members.length === 0) return null;

    return (
        <section className="relative bg-white py-12">
            <PageHeader title={t("header")} />

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
                    loop={true}
                    centeredSlides={true}
                    className="swiper"
                    onSlideChange={(swiper) => {
                        const pv = swiper.params.slidesPerView as number;
                        setPerView(pv);
                        setActiveIndex(swiper.realIndex); // 👈 track the actual active slide
                    }}
                >
                    {members.map((member, idx) => (
                        <SwiperSlide key={idx} className="flex justify-center">
                            <TeamMember
                                name={member.name}
                                imageSrc={member.imageSrc}
                                // 👇 scale logic: active slide = 1, others = 0.6
                                scale={perView === 3 ? (idx === activeIndex ? 1 : 0.6) : 1}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Navigation buttons */}
                <button className="team-prev flex-center w-[45px] h-[45px] bg-primary rounded-full absolute top-1/2 -translate-y-1/2 left-2 z-10">
                    <BiSolidLeftArrow size={24} className="text-white" />
                </button>
                <button className="team-next flex-center w-[45px] h-[45px] bg-primary rounded-full absolute top-1/2 -translate-y-1/2 right-2 z-10">
                    <BiSolidRightArrow size={24} className="text-white" />
                </button>
            </div>
        </section>
    );
}
