'use client';

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "react-hot-toast"; // Assuming you have a toaster

// UI Components (from your PropertiesForm example)
import TextInput from "@/components/shared/forms/TextInput";
import TextAreaInput from "@/components/shared/forms/TextAreaInput";
import SecondaryButton from "@/components/shared/buttons/SecondaryButton";

// Schema and Types

import { Settings } from "@/types/dashboard/settings"; // Your interface

import { z } from "zod";
import api from "@/libs/axios";
import LocationInput from "@/components/shared/forms/LocationInput";

const numberFromInput = z.preprocess(
    (value) => {
        if (value === "" || value === null || value === undefined) return undefined;
        if (typeof value === "string") return Number(value);
        return value;
    },
    z.number()
);


export const settingsSchema = z.object({
    name: z.string().min(1, { message: "required" }).nullable().optional(),
    contactEmail: z
        .email({ message: "email.invalid" })
        .nullable()
        .optional()
        .or(z.literal("")), // Allow empty string or valid email
    contactPhone: z.string().nullable().optional(),
    fax: z.string().nullable().optional(),
    address: z.string().nullable().optional(),

    // Numeric fields
    platformPercent: z
        .string()
        .refine((val) => {
            if (!val) return false; // empty string is invalid
            const num = Number(val);
            return !isNaN(num) && num >= 0 && num <= 100;
        }, {
            message: "percent.invalid", // single message from localization
        }),
    position: z.object({
        lat: z.number().nullable().optional(),
        lng: z.number().nullable().optional(),
    }),

    // Localized Text Areas
    description_en: z.string().nullable().optional(),
    description_ar: z.string().nullable().optional(),
    privacyPolicy_en: z.string().nullable().optional(),
    privacyPolicy_ar: z.string().nullable().optional(),
    termsOfService_en: z.string().nullable().optional(),
    termsOfService_ar: z.string().nullable().optional(),

    // Social Media
    facebook: z.url({ message: "url.invalid" }).nullable().optional().or(z.literal("")),
    twitter: z.url({ message: "url.invalid" }).nullable().optional().or(z.literal("")),
    instagram: z.url({ message: "url.invalid" }).nullable().optional().or(z.literal("")),
    linkedin: z.url({ message: "url.invalid" }).nullable().optional().or(z.literal("")),
    pinterest: z.url({ message: "url.invalid" }).nullable().optional().or(z.literal("")),
    tiktok: z.url({ message: "url.invalid" }).nullable().optional().or(z.literal("")),
    youtube: z.url({ message: "url.invalid" }).nullable().optional().or(z.literal("")),

});

export type SettingsFormType = z.infer<typeof settingsSchema>;

export default function SettingsForm() {
    const t = useTranslations("dashboard.admin.settings");

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<SettingsFormType>({
        resolver: zodResolver(settingsSchema),

        defaultValues: {
            name: "",
            contactEmail: "",
            contactPhone: "",
            fax: "",
            address: "",
            position: {
                lat: 0,
                lng: 0,
            },
            platformPercent: "0",
            description_en: "",
            description_ar: "",
            privacyPolicy_en: "",
            privacyPolicy_ar: "",
            termsOfService_en: "",
            termsOfService_ar: "",
            facebook: "",
            twitter: "",
            instagram: "",
            linkedin: "",
            pinterest: "",
            tiktok: "",
            youtube: "",
        },
    });

    // 1. Fetch Settings on Mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setIsFetching(true);
                const res = await api.get<Settings>("settings");

                // Reset form with fetched data
                const data = {
                    ...res.data,
                    platformPercent: res.data.platformPercent?.toString() ?? "",
                    position: {
                        lat: Number(res.data.latitude) || 0,
                        lng: Number(res.data.longitude) || 0,
                    }
                }
                if (res.data) {
                    reset(data);
                }
            } catch (error) {
                console.error("Failed to fetch settings", error);
                toast.error(t("messages.fetchError"));
            } finally {
                setIsFetching(false);
            }
        };

        fetchSettings();
    }, [reset, t]);

    // 2. Handle Update (PUT)
    const onSubmit = async (data: SettingsFormType) => {
        const toastId = toast.loading(t("messages.updating"));

        try {
            setIsLoading(true);
            const payload = {
                ...data,
                latitude: data.position?.lat,
                longitude: data.position?.lng
            }
            await api.put("settings", payload);

            toast.success(t("messages.updateSuccess"), {
                id: toastId,
            });
        } catch (error) {
            console.error("Failed to update settings", error);

            toast.error(t("messages.updateError"), {
                id: toastId,
            });
        } finally {
            setIsLoading(false);
        }
    };


    if (isFetching) {
        return (
            <div className="p-6 md:p-10 animate-pulse space-y-8">
                {/* Header Section */}
                <div className="space-y-2">
                    <div className="h-8 bg-gray-200 rounded w-1/4" />
                    <div className="h-4 bg-gray-100 rounded w-2/4" />
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                            {/* Label Skeleton */}
                            <div className="h-4 bg-gray-200 rounded w-1/3" />
                            {/* Input Skeleton */}
                            <div className="h-12 bg-gray-100 rounded-lg w-full" />
                        </div>
                    ))}
                </div>

                {/* Map/Large Area Skeleton */}
                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-20" />
                    <div className="h-64 bg-gray-100 rounded-xl w-full" />
                </div>

                {/* Button Skeleton */}
                <div className="flex justify-end">
                    <div className="h-12 bg-gray-200 rounded-lg w-32" />
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

                {/* --- General Information Section --- */}
                <div>
                    <h3 className="text-xl font-bold mb-4 border-b border-b-gray-400 pb-2 text-dark">
                        {t("sections.general")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-12">
                        <Controller
                            control={control}
                            name="name"
                            render={({ field }) => (
                                <TextInput
                                    type='text'
                                    label={t("fields.name")}
                                    placeholder={t("placeholders.name")}
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    error={errors.name?.message && t(errors.name?.message as any)}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="platformPercent"
                            render={({ field }) => (
                                <TextInput
                                    label={t("fields.platformPercent")}
                                    type="number"
                                    value={field.value?.toString()}
                                    onChange={field.onChange}
                                    error={errors.platformPercent?.message && t(errors.platformPercent?.message as any)}
                                />
                            )}
                        />
                    </div>
                </div>

                {/* --- Descriptions Section --- */}
                <div>
                    <h3 className="text-xl font-bold mb-4 border-b border-b-gray-400 pb-2 text-dark">
                        {t("sections.description")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-12">
                        <Controller
                            control={control}
                            name="description_en"
                            render={({ field }) => (
                                <TextAreaInput
                                    label={t("fields.description_en")}
                                    placeholder={t("placeholders.description_en")}
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    rows={6}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="description_ar"
                            render={({ field }) => (
                                <TextAreaInput
                                    label={t("fields.description_ar")}
                                    placeholder={t("placeholders.description_ar")}
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    rows={6}
                                />
                            )}
                        />
                    </div>
                </div>

                {/* --- Contact Info & Location --- */}
                <div>
                    <h3 className="text-xl font-bold mb-4 border-b border-b-gray-400 pb-2 text-dark">
                        {t("sections.contactAndLocation")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-12">
                        <Controller
                            control={control}
                            name="contactEmail"
                            render={({ field }) => (
                                <TextInput
                                    label={t("fields.contactEmail")}
                                    type="email"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    error={errors.contactEmail?.message && t(errors.contactEmail?.message as any)}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="contactPhone"
                            render={({ field }) => (
                                <TextInput
                                    type='text'
                                    label={t("fields.contactPhone")}
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="fax"
                            render={({ field }) => (
                                <TextInput
                                    type='text'
                                    label={t("fields.fax")}
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="address"
                            render={({ field }) => (
                                <TextInput
                                    type='text'
                                    label={t("fields.address")}
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                />
                            )}
                        />

                        <div className="md:col-span-2">

                            <LocationInput showAddress={false} control={control} name="position" />
                        </div>
                    </div>
                </div>

                {/* --- Legal (Terms & Privacy) --- */}
                <div>
                    <h3 className="text-xl font-bold mb-4 border-b border-b-gray-400 pb-2 text-dark">
                        {t("sections.legal")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-12">
                        <Controller
                            control={control}
                            name="privacyPolicy_en"
                            render={({ field }) => (
                                <TextAreaInput
                                    label={t("fields.privacyPolicy_en")}
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    rows={12}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="privacyPolicy_ar"
                            render={({ field }) => (
                                <TextAreaInput
                                    label={t("fields.privacyPolicy_ar")}
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    rows={12}

                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="termsOfService_en"
                            render={({ field }) => (
                                <TextAreaInput
                                    label={t("fields.termsOfService_en")}
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    rows={12}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="termsOfService_ar"
                            render={({ field }) => (
                                <TextAreaInput
                                    label={t("fields.termsOfService_ar")}
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    rows={12}
                                />
                            )}
                        />
                    </div>
                </div>

                {/* --- Social Media --- */}
                <div>
                    <h3 className="text-xl font-bold mb-4 border-b border-b-gray-400 pb-2 text-dark">
                        {t("sections.social")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-6">
                        {["facebook", "twitter", "instagram", "linkedin", "pinterest", "tiktok", "youtube"].map((social) => (
                            <Controller
                                key={social}
                                control={control}
                                name={social as keyof SettingsFormType}
                                render={({ field }) => (
                                    <TextInput
                                        type='text'
                                        label={t(`fields.${social}`)}
                                        placeholder="https://..."
                                        value={field.value?.toString() ?? ""}
                                        onChange={field.onChange}
                                        error={errors[social as keyof SettingsFormType]?.message && t(errors[social as keyof SettingsFormType]?.message as any)}
                                    />
                                )}
                            />
                        ))}
                    </div>
                </div>

                {/* --- Action Buttons --- */}
                <div className="pt-4">
                    <SecondaryButton
                        onClick={handleSubmit(onSubmit)}
                        className="bg-secondary hover:bg-secondary-hover text-white w-[200px] max-w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? t("saving") : t("save")}
                    </SecondaryButton>
                </div>
            </form>
        </div>
    );
}