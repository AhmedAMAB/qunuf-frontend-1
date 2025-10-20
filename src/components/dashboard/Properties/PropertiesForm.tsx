'use client'

import TextInput from "@/components/shared/forms/TextInput";
import Uploader from "@/components/shared/forms/Uploader";
import { Controller, useForm } from "react-hook-form";
import SelectField from "@/components/shared/forms/SelectField";
import TextAreaInput from "@/components/shared/forms/TextAreaInput";
import SecondaryButton from "@/components/shared/buttons/SecondaryButton";
import { FeaturesCheckboxes } from "./FeaturesCheckboxes";
import { LocationSection } from "./LocationSection";
import { NearbySection } from "./NearbySection";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { FileItem } from "@/utils/upload";
import { FeatureType, PropertyType, RentType } from "@/types/dashboard/properties";


export type PropertiesFormType = {
    title: string;
    size: number;
    propertyType: PropertyType;
    rentType: RentType;
    price: number;
    description: string;
    bathrooms: number;
    bedrooms: number;
    garage: number;
    additionalDetails: string;
    features: FeatureType[]; // array of selected features
    position: { lat: number; lng: number };
    nearby: { category: string; name: string; distance: number }[];
    images: FileItem[];
};

export default function PropertiesForm({ initialData }: { initialData?: PropertiesFormType }) {
    const [isLoading, setIsLoading] = useState(false)
    const t = useTranslations("dashboard.properties.form");
    const tCategories = useTranslations("property.filter");
    const tUploader = useTranslations("comman.form.uploader");

    console.log(initialData)

    const { handleSubmit, control } = useForm<PropertiesFormType>({
        defaultValues: initialData || {
            title: "",
            size: 0,
            propertyType: "commercial",
            rentType: "monthly",
            price: 0,
            description: "",
            bathrooms: 0,
            bedrooms: 0,
            garage: 0,
            additionalDetails: "",
            features: [],
            position: { lat: 26, lng: 36 },
            nearby: [],
            images: [],
        },
    });

    const onSubmit = (data: PropertiesFormType) => {
        console.log("Form submitted:", data);
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* inputs grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-12">
                    <Controller
                        control={control}
                        name="title"
                        render={({ field }) => (
                            <TextInput
                                label={t("title")}
                                placeholder={t("title")}
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />


                    <Controller
                        control={control}
                        name="size"
                        render={({ field }) => (
                            <TextInput
                                label={t("size")}
                                placeholder={t("size")}
                                type="number"
                                value={field.value?.toString()}
                                onChange={field.onChange}
                            />
                        )}
                    />

                    <div className="md:col-span-2">
                        <Uploader
                            control={control}
                            name="images"
                            accept="image/*"
                            allowMultiple
                            rules={[
                                tUploader("rules.maxSize", { size: 5 }),
                                tUploader("rules.maxFiles", { count: 10 }),
                            ]}
                            maxFiles={10}
                            maxSizeMB={5}
                        />
                    </div>

                    <Controller
                        control={control}
                        name="propertyType"
                        render={({ field }) => (
                            <SelectField
                                label={t("propertyType")}
                                options={[
                                    {
                                        label: tCategories("propertyType.options", { option: "commercial" }),
                                        value: "commercial",
                                    },
                                    {
                                        label: tCategories("propertyType.options", { option: "residential" }),
                                        value: "residential",
                                    },
                                ]}
                                placeholder={t("categoryPlaceholder")}
                                value={
                                    field.value
                                        ? {
                                            label: tCategories("propertyType.options", {
                                                option: field.value,
                                            }),
                                            value: field.value,
                                        }
                                        : null
                                }
                                onChange={(opt) => field.onChange(opt.value)}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="price"
                        render={({ field }) => (
                            <TextInput
                                label={t("price")}
                                placeholder={t("price")}
                                type="number"
                                value={field.value?.toString()}
                                onChange={field.onChange}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="rentType"
                        render={({ field }) => (
                            <SelectField
                                label={t("rentType")}
                                options={[
                                    {
                                        label: tCategories("rentType.options", { option: "monthly" }),
                                        value: "monthly",
                                    },
                                    {
                                        label: tCategories("rentType.options", { option: "yearly" }),
                                        value: "yearly",
                                    },
                                ]}
                                placeholder={t("categoryPlaceholder")}
                                value={
                                    field.value
                                        ? {
                                            label: tCategories("rentType.options", { option: field.value }),
                                            value: field.value,
                                        }
                                        : null
                                }
                                onChange={(opt) => field.onChange(opt.value)}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="bathrooms"
                        render={({ field }) => (
                            <TextInput
                                label={t("bathrooms")}
                                type="number"
                                value={field.value?.toString()}
                                onChange={field.onChange}
                            />
                        )}
                    />

                    <div className="row-span-2">
                        <Controller
                            control={control}
                            name="description"
                            render={({ field }) => (
                                <TextAreaInput
                                    label={t("description")}
                                    placeholder={t("description")}
                                    value={field.value}
                                    onChange={field.onChange}
                                    className="full-textarea"
                                />
                            )}
                        />
                    </div>

                    <Controller
                        control={control}
                        name="bedrooms"
                        render={({ field }) => (
                            <TextInput
                                label={t("bedrooms")}
                                type="number"
                                value={field.value?.toString()}
                                onChange={field.onChange}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="garage"
                        render={({ field }) => (
                            <TextInput
                                label={t("garage")}
                                type="number"
                                value={field.value?.toString()}
                                onChange={field.onChange}
                            />
                        )}
                    />

                </div>
                <div className="my-5">


                    <Controller
                        control={control}
                        name="additionalDetails"
                        render={({ field }) => (
                            <TextAreaInput
                                label={t("additionalDetails")}
                                placeholder={t("additionalDetails")}
                                value={field.value}
                                onChange={field.onChange}
                                className="full-textarea"
                            />
                        )}
                    />
                </div>

                <FeaturesCheckboxes control={control} name="features" />

                <LocationSection control={control} />

                <NearbySection control={control} />

                <SecondaryButton
                    onClick={handleSubmit(onSubmit)}
                    className="bg-secondary hover:bg-secondary-hover text-white w-[200px] max-w-full"
                    disabled={isLoading}
                >
                    {t("save")}
                </SecondaryButton>


            </form>
        </div>
    );
}
