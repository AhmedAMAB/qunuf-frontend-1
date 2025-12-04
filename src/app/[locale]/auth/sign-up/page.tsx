import AuthHeader from "@/components/auth/AuthHeader";
import SignUpForm from "@/components/auth/SignUpForm";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export async function generateMetadata() {
    const t = await getTranslations('auth.signUp');
    return {
        title: t('title'),
    };
}

export default async function SignUpPage() {
    const t = await getTranslations('auth.signUp');

    return (
        <div className="py-20">
            <div className="container max-w-[1200px] mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-stretch justify-between rounded-2xl custom-shadow overflow-hidden">
                    <div className="w-full lg:w-[50%] bg-white p-5 md:p-6 lg:p-8 flex flex-col gap-10">
                        <div className="flex flex-col gap-2">
                            <AuthHeader />
                            <h1 className="text-dark font-semibold text-[28px] sm:text-[32px] md:text-[34px] leading-[100%] tracking-normal">
                                {t('title')}
                            </h1>
                            <p className="text-dark font-light text-[16px] sm:text-[17px] md:text-[18px] leading-[100%] tracking-normal">
                                {t('subtitle')}
                            </p>
                        </div>
                        <SignUpForm />
                    </div>
                    <div className="relative w-full lg:w-[50%] bg-white flex items-center justify-center">
                        <div className="absolute inset-0 opacity-20 z-[2]"
                            style={{ background: "linear-gradient(180deg, var(--primary) 0%, var(--lightGold) 100%)" }}></div>
                        <Image src="/auth/signup.jpg" fill alt="sign in" className="z-[1] object-cover" />
                    </div>
                </div>
            </div>
        </div>
    );
}