"use client";

import { ReactNode, useState } from "react";
import ContactInput from "./ContactInput";
import ContactCheckbox from "./ContactCheckbox";
import { useTranslations } from "next-intl";
import { AnimatedSecondaryButton } from "@/components/shared/buttons/AnimatedSecondaryButton";
import { ContactSelect } from "./ContactSelect";
import { FiMail, FiPhoneCall } from "react-icons/fi";
import { HiOutlineMailOpen } from "react-icons/hi";
import { LiaFaxSolid } from "react-icons/lia";

export default function ContactForm() {
    const t = useTranslations("contact.form");

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        resean: "",
    });

    const handleChange = (field: keyof typeof form) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setForm({ ...form, [field]: e.target.value });
        };

    return (
        <form className="col-span-4 p-6 sm:p-8 md:p-10 lg:my-20">
            {/* Header */}
            <h1 className="font-bold text-3xl sm:text-4xl md:text-[50px] lg:text-[54px] mb-3">
                {t("getIn")} <span className="text-secondary">{t("touch")}</span>
            </h1>
            <p className="font-semibold text-[14px] mb-6">
                {t("headerMessage")}
            </p>

            {/* Inputs */}
            <div className="grid grid-cols-1 gap-5">
                <ContactInput
                    id="name"
                    required
                    label={t("name")}
                    value={form.name}
                    onChange={handleChange("name")}
                />
                <ContactInput
                    id="email"
                    label={t("email")}
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                />
                <ContactInput
                    id="phone"
                    required
                    label={t("phone")}
                    type="tel"
                    value={form.phone}
                    onChange={handleChange("phone")}
                />

                <ContactSelect
                    id="reason"
                    value={form.resean}
                    onChange={(value) => setForm((p) => ({ ...p, resean: value }))}
                    options={[
                        { value: "support", label: t("reason.support") },
                        { value: "sales", label: t("reason.sales") },
                        { value: "partnership", label: t("reason.partnership") },
                        { value: "other", label: t("reason.other") },
                    ]}
                    placeholder={t("reason.placeholder")}
                />
            </div>

            {/* Submit */}
            <button
                className={`mt-5 group relative transition bg-primary hover:bg-primary-hover text-white uppercase
                           w-full h-[45px] sm:h-[50px] 2xl:h-[53px] overflow-hidden
                           rounded-xl font-medium`}
                style={{ boxShadow: "0px 4px 12px 0px #0000001F" }}
            >
                {t("send")}
            </button>

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between items-start sm:items-center mt-14">
                <ContactInfo
                    icon={<FiPhoneCall size={28} />}
                    label={t("phone")}
                    value="03 5432 1234"
                />
                <ContactInfo
                    icon={<LiaFaxSolid size={28} />}
                    label={t("fax")}
                    value="03 5432 1234"
                />
                <ContactInfo
                    icon={<HiOutlineMailOpen size={28} />}
                    label={t("email")}
                    value="info@example.com"
                />
            </div>
        </form>
    );
}


type ContactInfoProps = {
    icon: ReactNode;
    label: string;
    value: string;
    wrapperClassName?: string;
    valueClassName?: string;
};
function ContactInfo({
    icon,
    label,
    value,
    wrapperClassName = "",
    valueClassName = "text-[#DD5471]",
}: ContactInfoProps) {
    return (
        <div className={`flex gap-3 sm:gap-4 items-start sm:items-center ${wrapperClassName}`}>
            <div className="flex justify-start items-start sm:items-center gap-2 sm:gap-4">
                {icon}
                <div className="flex flex-col gap-[2px] text-[14px] sm:text-[15px]">
                    <p className="uppercase text-black text-[13px] sm:text-[15px]">{label}</p>
                    <p className={valueClassName}>{value}</p>
                </div>
            </div>
        </div>
    );
}
