'use client'
import PrimaryButton from "@/components/shared/buttons/PrimaryButton";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslations } from "next-intl";

export default function BookButton({ id }: { id: string }) {
    const t = useTranslations('property.details');
    const { role } = useAuth()
    return (
        <PrimaryButton
            className="bg-secondary hover:bg-secondary-hover text-white !rounded-[12px] shadow-[0px_4px_12px_0px_#0000001F] lg:!py-3 w-full sm:w-auto shrink-0"
            href={role != 'tenant' ? '/auth/sign-up?type=tenant' : `/booking?property=${id}`}
        >
            {t('bookingNow')}
        </PrimaryButton>
    );
}