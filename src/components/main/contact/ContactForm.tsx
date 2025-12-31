"use client";

import { ReactNode, useState } from "react";
import ContactInput from "./ContactInput";
import { useTranslations } from "next-intl";
import { ContactSelect } from "./ContactSelect";
import { FiPhoneCall } from "react-icons/fi";
import { HiOutlineMailOpen } from "react-icons/hi";
import { LiaFaxSolid } from "react-icons/lia";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import api from "@/libs/axios";
import { phoneSchema } from "@/utils/validation";


const contactSchema = z.object({
    name: z.string().min(1, 'required'),
    email: z.email('email').optional(),
    phone: phoneSchema,
    message: z.string().min(1, 'required'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactForm() {
    const t = useTranslations('contact.form');

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            message: '',
        },
    });

    const onSubmit = async (data: ContactFormValues) => {
        const toastId = toast.loading(t('sending'));
        try {
            const res = await api.post('/contact-us', {
                name: data.name,
                email: data.email,
                phone: data.phone,
                message: data.message,
            });

            // Show success toast from response message if available
            toast.success(t('success'), { id: toastId });

            toast.success(t('success'), { id: toastId });
            reset();
        } catch (err: any) {
            toast.error(err.response?.data?.message || t('error'), { id: toastId });
        }
    };

    return (
        <form className="col-span-4 p-6 sm:p-8 md:p-10 lg:my-20" onSubmit={handleSubmit(onSubmit)}>
            {/* Header */}
            <h1 className="font-bold text-3xl sm:text-4xl md:text-[50px] lg:text-[54px] mb-3">
                {t('getIn')} <span className="text-secondary">{t('touch')}</span>
            </h1>
            <p className="font-semibold text-[14px] mb-6">{t('headerMessage')}</p>

            {/* Inputs */}
            <div className="grid grid-cols-1 gap-5">
                <ContactInput
                    id="name"
                    label={t('name')}
                    required
                    error={errors.name?.message && t(`validation.${errors.name.message}`)}
                    {...register('name')}
                />
                <ContactInput
                    id="email"
                    label={t('email')}
                    type="email"
                    error={errors.email?.message && t(`validation.${errors.email.message}`)}
                    {...register('email')}
                />
                <ContactInput
                    id="phone"
                    label={t('phone')}
                    required
                    error={errors.phone?.message && t(`validation.${errors.phone.message}`)}
                    {...register('phone')}
                />

                <Controller
                    name="message"
                    control={control}
                    render={({ field }) => (
                        <ContactSelect
                            id="message"
                            placeholder={t('message.label')}
                            options={[
                                { value: 'Friend Referral', label: "Friend Referral" },
                                { value: 'Social Media', label: "Social Media" },
                                { value: 'Search Engine', label: "Search Engine" },
                                { value: 'other', label: "Other" },
                            ]}
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.message?.message && t(`validation.${errors.message.message}`)}
                        />
                    )}
                />
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={isSubmitting}
                className={`mt-5 group relative transition bg-primary hover:bg-primary-hover text-white uppercase
          w-full h-[45px] sm:h-[50px] 2xl:h-[53px] overflow-hidden
          rounded-xl font-medium`}
                style={{ boxShadow: '0px 4px 12px 0px #0000001F' }}
            >
                {t('send')}
            </button>

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between items-start sm:items-center mt-14">
                <ContactInfo
                    icon={<FiPhoneCall size={28} />}
                    label={t('phone')}
                    value="03 5432 1234"
                />
                <ContactInfo
                    icon={<LiaFaxSolid size={28} />}
                    label={t('fax')}
                    value="03 5432 1234"
                />
                <ContactInfo
                    icon={<HiOutlineMailOpen size={28} />}
                    label={t('email')}
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
