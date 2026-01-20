'use client'
import PrimaryButton from "@/components/atoms/buttons/PrimaryButton";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/constants/user";

export default function Features() {
    const t = useTranslations("homePage.features");
    const { role } = useAuth()

    return (
        <section className="my-8 mx-2" id="features">
            <div className="container grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 xl:gap-8 items-center">
                {/* Text Section */}
                <div className="space-y-4">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[55px] text-dark font-bold">
                        {t("mainTitle")}
                    </h1>
                    <p className="text-sm sm:text-base text-dark leading-[26px] max-w-[700px]">
                        {t("mainDescription")}
                    </p>
                </div>

                {/* Image Section */}
                <div className="relative w-full h-[250px] md:h-[280px] rounded-[20px] overflow-hidden ">
                    <Image
                        src="/home.png"
                        alt="home"
                        fill
                        className="object-cover rounded-[20px] image-scale"
                    />
                </div>

                {/* أعلن عن إيجارك */}
                <div className="bg-secondary flex-center flex-col h-[250px] md:h-[280px] w-full gap-5 p-4 lg:p-6 rounded-[20px]">
                    <h1 className="text-lg md:text-2xl lg:text-[35px] text-white font-bold w-fit">
                        {t("card1.title")}
                    </h1>
                    <p className="text-sm sm:text-base leading-[26px] max-w-[700px] text-white opacity-80 w-fit text-center">
                        {t("card1.description")}
                    </p>
                    <PrimaryButton href={role === UserRole.LANDLORD ? '/dashboard/properties/add' : '/auth/sign-up?type=landlord'} className="text-black transition-colors bg-white  hover:bg-gray-300 text-sm md:text-base" >
                        {t("card1.button")}
                    </PrimaryButton>
                </div>

                {/* إيجار 100% عبر الإنترنت */}
                <div className="bg-primary flex-center flex-col h-[250px] md:h-[280px] w-full gap-5 p-4 lg:p-6 rounded-[20px]">
                    <h1 className="text-lg md:text-2xl lg:text-[35px] text-white font-bold w-fit">
                        {t("card2.title")}
                    </h1>
                    <p className="text-sm sm:text-base leading-[26px] max-w-[700px] text-white opacity-80 w-fit text-center">
                        {t("card2.description")}
                    </p>
                    <PrimaryButton href={role === UserRole.LANDLORD ? '/dashboard/contracts' : '/auth/sign-up?type=landlord'} className="text-black transition-colors bg-white  hover:bg-gray-300 text-sm md:text-base">
                        {t("card2.button")}
                    </PrimaryButton>
                </div>
            </div>
        </section>
    );
}
