'use client'

import TextInput from "@/components/molecules/forms/TextInput";
import Uploader from "@/components/molecules/forms/Uploader";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import SelectField from "@/components/molecules/forms/SelectField";
import TextAreaInput from "@/components/molecules/forms/TextAreaInput";
import SecondaryButton from "@/components/atoms/buttons/SecondaryButton";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import z from "zod";
import { CommercialSubType, DocumentType, OwnershipType, Property, PropertyType, RentType, ResidentialSubType } from "@/types/dashboard/properties";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import api from "@/libs/axios";
import { useRouter } from "@/i18n/navigation";
import { FeaturesTagsInput } from "./FeaturesTagsInput";
import { useValues } from "@/contexts/GlobalContext";
import { Option } from "@/components/molecules/forms/SelectInput";
import NearbyFacilitiesSection from "./NearbySection";
import LocationInput from "@/components/molecules/forms/LocationInput";
import FormErrorMessage from "@/components/molecules/forms/FormErrorMessage";
import { FileItem } from "@/utils/upload";
import PropertyNameInput from "./PropertyNameInput";
const today = new Date();
const currentYear = today.getFullYear();

export const getPropertySchema = (t: (key: string, params?: any) => string) => {
    // Helper for required number fields
    const requiredNumber = z.coerce
        .number().min(1, { message: t("validation.min", { min: 1 }) });

    const optionalNumber = z.coerce.number().min(0, { message: t("validation.min", { min: 0 }) }).optional()

    return z.object({
        name: z.string().trim().min(3, { message: t("validation.min", { min: 3 }) }).max(100, { message: t("validation.max", { max: 100 }) }).nonempty({ message: t("validation.required") }),
        description: z.string().trim().min(20, { message: t("validation.min", { min: 20 }) }).max(2000, { message: t("validation.max", { max: 2000 }) }).nonempty({ message: t("validation.required") }),
        additionalDetails: z.string().trim().max(1500, { message: t("validation.max", { max: 1500 }) }).optional(),

        // Enums
        propertyType: z.enum(PropertyType),
        subType: z.union([z.enum(ResidentialSubType), z.enum(CommercialSubType)]),
        rentType: z.enum(RentType),
        ownershipType: z.enum(OwnershipType),

        // Document Data
        documentType: z.enum(DocumentType),
        documentNumber: z.string().trim().max(25, { message: t("validation.max", { max: 25 }) }).nonempty({ message: t("validation.required") }),

        documentIssueDate: z
            .string()
            .trim()
            .nonempty({ message: t("validation.required") })
            .refine(
                (val) => {
                    const date = new Date(val);
                    return !isNaN(date.getTime()) && date <= today;
                },
                {
                    message: t("validation.max", { max: today.toISOString().split("T")[0] }),
                }
            ),

        issuedBy: z.string().trim().max(250, { message: t("validation.max", { max: 250 }) }).nonempty({ message: t("validation.required") }),
        ownerIdNumber: z.string().trim().min(3, { message: t("validation.min", { min: 3 }) }).regex(/^[a-zA-Z0-9]*$/).max(20, { message: t("validation.max", { max: 20 }) }).nonempty({ message: t("validation.required") }),
        insurancePolicyNumber: z.string().trim().max(100, { message: t("validation.max", { max: 100 }) }).optional(),

        // Identification
        propertyNumber: z.string().trim().min(3, { message: t("validation.min", { min: 3 }) }).max(20, { message: t("validation.max", { max: 20 }) }).regex(/^[a-zA-Z0-9\-\/]+$/, { message: t("validation.invalidFormat") }).nonempty({ message: t("validation.required") }),
        complexName: z.string().trim().max(200, { message: t("validation.max", { max: 200 }) }).optional(),
        nationalAddressCode: z.string().trim().length(8, { message: t("validation.max", { max: 8 }) }).regex(/^[A-Z]{4}\d{4}$|^[0-9]{8}$/, { message: t("validation.invalidFormat") }),

        // Numeric
        securityDeposit: requiredNumber,
        capacity: optionalNumber,
        area: requiredNumber
            .refine((val) => val >= 1, {
                message: t("validation.min", { min: 1 }),
            })
            .refine((val) => val <= 100_000, {
                message: t("validation.max", { max: 100_000 }),
            }),

        rentPrice: requiredNumber
            .refine((val) => val >= 1, {
                message: t("validation.min", { min: 1 }),
            })
            .refine((val) => val <= 1_000_000, {
                message: t("validation.max", { max: 1_000_000 }),
            }),
        constructionDate: z
            .string()
            .trim()
            .optional()
            .refine(
                (val) => {
                    if (!val) return true; // allow empty
                    const year = new Date(val).getFullYear();
                    return year >= 1900 && year <= currentYear;
                },
                {
                    message: t("validation.yearRange", {
                        min: 1900,
                        max: currentYear,
                    }),
                }
            ),

        // Booleans
        isFurnished: z.boolean(),

        // Location
        stateId: z.string().nonempty({ message: t("validation.required") }),
        position: z.object({
            lat: z.number().nullable().optional(),
            lng: z.number().nullable().optional(),
        }),

        // Meters
        gasMeterNumber: z.string().max(50, { message: t("validation.max", { max: 50 }) }).optional(),
        electricityMeterNumber: z.string().max(50, { message: t("validation.max", { max: 50 }) }).optional(),
        waterMeterNumber: z.string().max(50, { message: t("validation.max", { max: 50 }) }).optional(),

        // Nested Facilities
        facilities: z.object({
            livingRooms: optionalNumber,
            parking: optionalNumber,
            elevators: optionalNumber,
            bathrooms: optionalNumber,
            bedrooms: optionalNumber,
            kitchen: optionalNumber,
            store: optionalNumber,
            majlis: optionalNumber,
            rooms: optionalNumber,
            securityEntrances: optionalNumber,
            maidRoom: z.boolean().optional(),
            backyard: z.boolean().optional(),
            centralAC: z.boolean().optional(),
            desertAC: z.boolean().optional(),
        }).optional(),

        // Lists
        features: z.array(z.string().max(50, { message: t("validation.features.tagTooLong", { max: 50 }) })).max(30, { message: t("validation.features.maxTags", { max: 30 }) }).optional(),

        // Uploader Handling (Frontend specific, transformed before submit)
        images: z
            .any()
            .refine((files) => {
                // If images is provided, it must be an array and have a length > 0
                if (files === undefined || files === null) return false; // allow optional
                return Array.isArray(files) && files.length > 0;
            }, {
                message: t("validation.atLeastOne"),
            }),
        documentImage: z.any().optional(), // validated manually or via Uploader rules

        // Separated nearby arrays based on backend DTO
        // Education Institutions
        educationInstitutions: z.array(
            z.object({
                name: z.string().min(1, { message: t("validation.required") }),
                distance_km: z.coerce.number()
                    .min(0.1, { message: t("validation.nearby.distanceTooShort", { min: 0.1 }) })
                    .max(50, { message: t("validation.nearby.distanceTooFar", { max: 50 }) })
            })
        )
            .max(8, { message: t("validation.nearby.maxFacilities", { max: 8 }) })
            .optional(),

        // Health & Medical Facilities
        healthMedicalFacilities: z.array(
            z.object({
                name: z.string().min(1, { message: t("validation.required") }),
                distance_km: z.coerce.number()
                    .min(0.1, { message: t("validation.nearby.distanceTooShort", { min: 0.1 }) })
                    .max(50, { message: t("validation.nearby.distanceTooFar", { max: 50 }) })
            })
        )
            .max(8, { message: t("validation.nearby.maxFacilities", { max: 8 }) })
            .optional(),
    });
};
type PropertySchemaType = z.infer<ReturnType<typeof getPropertySchema>>;

interface Props {
    initialData?: Property; // The full backend entity
}

export default function PropertiesForm({ initialData }: Props) {
    const tCommon = useTranslations("comman");
    const tEnums = useTranslations("property.enums"); // Create enums translation file
    const tA = useTranslations('dashboard.account');
    const t = useTranslations("dashboard.properties.form");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { states, loadingStates } = useValues();
    const locale = useLocale();
    const optionsStates: Option[] = useMemo(
        () =>
            states.map((s) => ({
                value: s.id,
                label: locale === 'ar' ? s.name_ar : s.name,
            })),
        [states, locale]
    );

    // Determine Mode
    const isEditMode = !!initialData;

    const schema = getPropertySchema(t);

    const { control, handleSubmit, setValue, formState: { errors }, setError, clearErrors } = useForm<PropertySchemaType>({
        // @ts-expect-error - Type inference issue between zodResolver and useForm types
        resolver: zodResolver(schema),
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
            additionalDetails: initialData?.additionalDetails || "",
            propertyType: initialData?.propertyType || PropertyType.RESIDENTIAL,
            subType: (initialData?.subType as CommercialSubType | ResidentialSubType) || ResidentialSubType.APARTMENT,
            rentType: initialData?.rentType || RentType.MONTHLY,
            rentPrice: initialData?.rentPrice || 0, // Mapped to rentPrice
            area: initialData?.area || 0,
            securityDeposit: initialData?.securityDeposit || 0,
            isFurnished: initialData?.isFurnished || false,
            ownershipType: initialData?.ownershipType || OwnershipType.OWNER,
            capacity: initialData?.capacity || 0,

            // Document
            documentType: initialData?.documentType || DocumentType.ELECTRONIC_DEED,
            documentNumber: initialData?.documentNumber || "",
            documentIssueDate: initialData?.documentIssueDate ? new Date(initialData.documentIssueDate).toISOString().split('T')[0] : "",
            issuedBy: initialData?.issuedBy || "",
            ownerIdNumber: initialData?.ownerIdNumber || "",
            insurancePolicyNumber: initialData?.insurancePolicyNumber || "",
            healthMedicalFacilities: initialData?.healthMedicalFacilities || [],
            educationInstitutions: initialData?.educationInstitutions || [],

            // Address
            propertyNumber: initialData?.propertyNumber || "",
            nationalAddressCode: initialData?.nationalAddressCode || "",
            stateId: initialData?.stateId || "",
            latitude: initialData?.latitude,
            longitude: initialData?.longitude,
            position: {
                lat: Number(initialData?.latitude) || 24.644911,
                lng: Number(initialData?.longitude) || 46.724039,
            },
            // Nested
            features: initialData?.features || [],
            facilities: initialData?.facilities || {},
            gasMeterNumber: initialData?.gasMeterNumber || "",
            electricityMeterNumber: initialData?.electricityMeterNumber || "",
            waterMeterNumber: initialData?.waterMeterNumber || "",
            complexName: initialData?.complexName || "",
            constructionDate: initialData?.constructionDate || "",

            // Images (Transformation needed for Uploader component)
            images: initialData?.images?.map(img => ({ url: img.url, isPrimary: img.is_primary })) || [],
            documentImage: initialData?.documentImage
                ? [{ url: initialData.documentImage?.path, name: initialData?.documentImage?.filename }]
                : [],

        } as any // Cast due to slight DTO mismatches in defaults
    });

    const positionMap = useWatch({ control, name: "position" });
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        async function handleMapSelect(lat: number, lng: number) {

            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            const controller = new AbortController();
            abortControllerRef.current = controller;

            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
                    { signal: controller.signal }
                );

                const data = await res.json();
                const address = data.address;

                if (address?.country_code !== "sa") {
                    setValue("stateId", "");
                    return;
                }

                const regionCode = address["ISO3166-2-lvl4"];
                if (!regionCode) {
                    setValue("stateId", "");
                    return;
                }

                const normalize = (str: string) => str.replace(/[-–—]/g, '-');
                const matchedState = states.find(
                    s => normalize(s.region_code) === normalize(regionCode)
                );

                setValue("stateId", matchedState?.id ?? "");

            } catch (error: any) {
                if (error.name === 'AbortError') {
                } else {
                    console.error('Fetch error:', error);
                    setValue("stateId", "");
                }
            } finally {
                if (abortControllerRef.current === controller) {
                    abortControllerRef.current = null;
                }
            }
        }

        if (positionMap?.lat && positionMap?.lng) {
            handleMapSelect(positionMap.lat, positionMap.lng);
        }

        // دالة التنظيف عند حذف المكون
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };

    }, [positionMap.lat, positionMap.lng, states, setValue]);
    // Watch property type to filter sub-types
    const selectedStateId = useWatch({ control, name: "stateId" });
    const selectedOption = useMemo(
        () => optionsStates.find((o) => o.value === selectedStateId) ?? null,
        [optionsStates, selectedStateId]
    );

    const ownershipTypeOptions = useMemo(
        () =>
            Object.values(OwnershipType).map((v) => ({
                label: tEnums(`ownershipType.${v}`),
                value: v,
            })),
        [tEnums]
    );

    const documentTypeOptions = useMemo(
        () =>
            Object.values(DocumentType).map((v) => ({
                label: tEnums(`documentType.${v}`),
                value: v,
            })),
        [tEnums]
    );


    const selectedPropertyType = useWatch({ control, name: "propertyType" });
    const selectedsubType = useWatch({ control, name: "subType" });

    const rentTypeOptions = useMemo(
        () =>
            Object.values(RentType).map((v) => ({
                label: tEnums(`rentType.${v}`),
                value: v,
            })),
        [tEnums]
    );

    const propertyTypeOptions = useMemo(
        () =>
            Object.values(PropertyType).map((v) => ({
                label: tEnums(`propertyType.${v}`),
                value: v,
            })),
        [tEnums]
    );


    const subTypeOptions = useMemo(() => {
        const isCommercial = selectedPropertyType === PropertyType.COMMERCIAL;
        const subTypeEnum = isCommercial ? CommercialSubType : ResidentialSubType;
        const path = isCommercial ? "commercial" : "residential";

        return Object.values(subTypeEnum).map(val => ({
            label: tEnums(`subType.${path}.${val}`),
            value: val
        }));
    }, [selectedPropertyType, tEnums]);

    useEffect(() => {
        const isValid = subTypeOptions.some(opt => opt.value === selectedsubType);

        if (!isValid && subTypeOptions.length > 0) {
            setValue("subType", subTypeOptions[0].value);
        }
    }, [selectedPropertyType, subTypeOptions, selectedsubType, setValue]);

    const onSubmit: SubmitHandler<PropertySchemaType> = async (data) => {
        setIsLoading(true);
        const toastId = toast.loading(tCommon("submitting"));

        try {
            const formData = new FormData();

            // 1. Append simple fields
            formData.append("name", data.name);
            formData.append("description", data.description);
            if (data.additionalDetails) formData.append("additionalDetails", data.additionalDetails);
            formData.append("propertyType", data.propertyType);
            formData.append("subType", data.subType);
            formData.append("rentType", data.rentType);
            formData.append("ownershipType", data.ownershipType);
            formData.append("rentPrice", data.rentPrice.toString());
            formData.append("area", data.area.toString());
            formData.append("securityDeposit", data.securityDeposit.toString());
            formData.append("isFurnished", String(data.isFurnished));
            formData.append("capacity", data.capacity.toString());

            // Document
            formData.append("documentType", data.documentType);
            formData.append("documentNumber", data.documentNumber);
            formData.append("documentIssueDate", data.documentIssueDate);
            formData.append("issuedBy", data.issuedBy);
            formData.append("ownerIdNumber", data.ownerIdNumber);
            formData.append("gasMeterNumber", data.gasMeterNumber);
            formData.append("electricityMeterNumber", data.electricityMeterNumber);
            formData.append("waterMeterNumber", data.waterMeterNumber);
            formData.append("insurancePolicyNumber", data.insurancePolicyNumber);
            // --- Handle Health/Medical Facilities ---
            if (data.healthMedicalFacilities && data.healthMedicalFacilities.length > 0) {
                data.healthMedicalFacilities.forEach((facility, index) => {
                    formData.append(`healthMedicalFacilities[${index}][name]`, facility.name);
                    formData.append(`healthMedicalFacilities[${index}][distance_km]`, facility.distance_km.toString());
                });
            }

            // --- Handle Education Institutions ---
            if (data.educationInstitutions && data.educationInstitutions.length > 0) {
                data.educationInstitutions.forEach((facility, index) => {
                    formData.append(`educationInstitutions[${index}][name]`, facility.name);
                    formData.append(`educationInstitutions[${index}][distance_km]`, facility.distance_km.toString());
                });
            }

            // Address
            formData.append("propertyNumber", data.propertyNumber);
            formData.append("nationalAddressCode", data.nationalAddressCode);
            formData.append("stateId", data.stateId);
            formData.append("complexName", data.complexName);
            formData.append("constructionDate", data.constructionDate);

            if (data.position.lat) formData.append("latitude", data.position.lat.toString());
            if (data.position.lng) formData.append("longitude", data.position.lng.toString());

            // 2. Append Arrays (Features)
            if (data.features && data.features.length > 0) {
                data.features.forEach(f => formData.append("features[]", f));
            }

            // 3. Append Nested Objects (Facilities) - Stringify usually safer for NestJS ValidationPipe with @Type
            // Alternatively, append as facilities[bedrooms], facilities[bathrooms]... 
            // Here we assume standard object-to-formdata mapping
            if (data.facilities) {
                Object.entries(data.facilities).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        formData.append(`facilities[${key}]`, value.toString());
                    }
                });
            }
            if (data.documentImage?.file) {
                // Uploader usually provides an array. We take the first item's 'file' property.
                const docFile = data.documentImage.file;
                if (docFile) {
                    formData.append("documentImage", docFile);
                }
            }

            // 4. Handle Images & Primary Index
            let primaryIndex = 0;
            if (data.images && Array.isArray(data.images)) {
                data.images.forEach((fileItem: any, index: number) => {
                    if (fileItem.file) {
                        formData.append("images", fileItem.file); // New files
                    }
                    if (fileItem.isPrimary) primaryIndex = index;
                });
            }
            formData.append("primaryImageIndex", primaryIndex.toString());

            // 5. API Call
            if (isEditMode) {
                await api.put(`/properties/${initialData.id}`, formData);
                toast.success(t("messages.updateSuccess"), { id: toastId });
            } else {
                await api.post("/properties", formData);
                toast.success(t("messages.createSuccess"), { id: toastId });
            }

            router.push("/dashboard/properties");
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || tCommon("error"), { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    const id = initialData?.id;

    const handleRemoveFile = useCallback(async (file: FileItem, type: 'image' | 'document') => {
        if (!isEditMode || !id) return true;

        try {
            await api.delete(`/properties/${id}/files`, {
                params: {
                    type: type,
                    url: file.url
                }
            });

            toast.success(tCommon("uploader.success.removed"));
            return true;
        } catch (error) {
            console.error("Delete error:", error);
            toast.error(tCommon("uploader.errors.deleteFailed"));
            return false;
        }
    }, [id, isEditMode, tCommon]);

    return (
        <div className="container mx-auto pb-10">
            <h1 className="text-2xl font-bold mb-6 text-dark">{isEditMode ? t("editTitle") : t("createTitle")}</h1>

            <div className="space-y-8">
                {/* --- Section 1: Basic Info --- */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-2">{t("basicInfo")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Controller
                            control={control}
                            name="name"
                            render={({ field }) => (
                                <PropertyNameInput
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    label={t("title")}
                                    placeholder={t(`placeholders.name`)}
                                    error={errors.name?.message}
                                    initialEditName={initialData?.name}
                                    propertyId={initialData?.id}
                                    setError={setError}
                                    clearErrors={() => clearErrors('name')}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="propertyType"
                            render={({ field }) => (
                                <SelectField
                                    label={t("propertyType")}
                                    placeholder={t(`placeholders.propertyType`)}
                                    value={field.value ? { label: tEnums(`propertyType.${field.value}`), value: field.value } : null}
                                    options={propertyTypeOptions}
                                    onChange={(opt) => {
                                        field.onChange(opt.value);
                                    }}
                                    error={errors.propertyType?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="subType"
                            render={({ field }) => (
                                <SelectField
                                    label={t("subType")} placeholder={t(`placeholders.subType`)}
                                    value={subTypeOptions.find(o => o.value === field.value)}
                                    options={subTypeOptions}
                                    onChange={(opt) => field.onChange(opt.value)}
                                    error={errors.subType?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="rentType"
                            render={({ field }) => (
                                <SelectField
                                    label={t("rentType")} placeholder={t(`placeholders.rentType`)}
                                    value={field.value ? { label: tEnums(`rentType.${field.value}`), value: field.value } : null}
                                    options={rentTypeOptions}
                                    onChange={(opt) => field.onChange(opt.value)}
                                    error={errors.rentType?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="ownershipType"
                            render={({ field }) => (
                                <SelectField
                                    label={t("ownershipType")} placeholder={t(`placeholders.ownershipType`)}
                                    value={field.value ? { label: tEnums(`ownershipType.${field.value}`), value: field.value } : null}
                                    options={ownershipTypeOptions}
                                    onChange={(opt) => field.onChange(opt.value)}
                                    error={errors.ownershipType?.message}
                                />
                            )}
                        />
                        <Controller control={control} name="complexName" render={({ field }) => <TextInput {...field} label={t("complexName")} placeholder={t(`placeholders.complexName`)} error={errors.complexName?.message} />} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Controller
                            control={control}
                            name="rentPrice"
                            render={({ field }) => <TextInput type="number" min={0} {...field} label={t("price")} placeholder={t(`placeholders.rentPrice`)} error={errors.rentPrice?.message} />}
                        />
                        <Controller
                            control={control}
                            name="area"
                            render={({ field }) => <TextInput type="number" min={0}{...field} label={t("size")} placeholder={t(`placeholders.area`)} suffix="m²" error={errors.area?.message} />}
                        />
                        <Controller
                            control={control}
                            name="securityDeposit"
                            render={({ field }) => <TextInput type="number" min={0} {...field} label={t("securityDeposit")} placeholder={t(`placeholders.securityDeposit`)} error={errors.securityDeposit?.message} />}
                        />
                        <Controller
                            control={control}
                            name="capacity"
                            render={({ field }) => <TextInput type="number" min={0} {...field} label={t("capacity")} placeholder={t(`placeholders.capacity`)} error={errors.securityDeposit?.message} />}
                        />
                    </div>

                    <Controller
                        control={control}
                        name="description"
                        render={({ field }) => <TextAreaInput {...field} label={t("description")} placeholder={t(`placeholders.description`)} error={errors.description?.message} />}
                    />
                    <Controller
                        control={control}
                        name="additionalDetails"
                        render={({ field }) => <TextAreaInput {...field} label={t("additionalDetails")} placeholder={t(`placeholders.additionalDetails`)} error={errors.additionalDetails?.message} />}
                    />


                </div>

                {/* --- Section 2: Address & Legal --- */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-2">{t("locationAndLegal")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Controller
                            control={control}
                            name="propertyNumber"
                            render={({ field }) => <TextInput {...field} label={t("propertyNumber")} placeholder={t(`placeholders.propertyNumber`)} error={errors.propertyNumber?.message} />}
                        />
                        <Controller
                            control={control}
                            name="nationalAddressCode"
                            render={({ field }) => <TextInput {...field} label={t("nationalAddressCode")} placeholder={t(`placeholders.nationalAddressCode`)} error={errors.nationalAddressCode?.message} />}
                        />

                        <Controller control={control} name="insurancePolicyNumber" render={({ field }) => <TextInput {...field} label={t("insurancePolicyNumber")} placeholder={t(`placeholders.insurancePolicyNumber`)} error={errors.insurancePolicyNumber?.message} />} />
                        <Controller
                            control={control}
                            name="constructionDate"
                            render={({ field }) => <TextInput type="date" {...field} label={t("constructionDate")} placeholder={t(`placeholders.constructionDate`)} error={errors.constructionDate?.message} />}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <Controller
                            control={control}
                            name="documentType"
                            render={({ field }) => (
                                <SelectField
                                    label={t("documentType")} placeholder={t(`placeholders.documentType`)}
                                    value={field.value ? { label: tEnums(`documentType.${field.value}`), value: field.value } : null}
                                    options={documentTypeOptions}
                                    onChange={(opt) => field.onChange(opt.value)}
                                    error={errors.documentType?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="documentNumber"
                            render={({ field }) => <TextInput {...field} label={t("documentNumber")} placeholder={t(`placeholders.documentNumber`)} error={errors.documentNumber?.message} />}
                        />
                        <Controller
                            control={control}
                            name="ownerIdNumber"
                            render={({ field }) => <TextInput {...field} label={t("ownerIdNumber")} placeholder={t(`placeholders.ownerIdNumber`)} error={errors.ownerIdNumber?.message} />}
                        />
                        <Controller
                            control={control}
                            name="documentIssueDate"
                            render={({ field }) => <TextInput type="date" {...field} label={t("documentIssueDate")} placeholder={t(`placeholders.documentIssueDate`)} error={errors.documentIssueDate?.message} />}
                        />
                        <Controller
                            control={control}
                            name="issuedBy"
                            render={({ field }) => <TextInput {...field} label={t("issuedBy")} placeholder={t(`placeholders.issuedBy`)} error={errors.issuedBy?.message} />}
                        />
                        <div className="md:col-span-2">
                            <Uploader
                                control={control}
                                label={t('documentImage')}
                                onRemoveFile={isEditMode ? (file) => handleRemoveFile(file, "document") : undefined}
                                name="documentImage"
                                accept="application/pdf"
                                allowMultiple={false} // Only one deed per property
                                maxFiles={1}
                                maxSizeMB={30}
                                rules={[
                                    tCommon("uploader.rules.maxSize", { size: 30 }),
                                    tCommon("uploader.rules.maxFiles", { count: 1 }),
                                    tCommon("uploader.rules.onlyPDF"),
                                ]}
                            />
                            <FormErrorMessage message={errors.documentImage?.message?.toString()} />
                        </div>
                    </div>
                </div>

                {/* --- Section: Map Location --- */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
                    <div className="flex flex-col gap-1 border-b pb-2">
                        <h3 className="text-lg font-semibold">{t("locationTitle")}</h3>
                        <p className="text-sm text-gray-500">{t("locationSubtitle")}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* State Selection needs a proper Async Select or predefined list of States */}
                        <div className='md:col-span-2'>
                            <Controller
                                control={control}
                                name="stateId"
                                render={({ field }) => (
                                    <SelectField
                                        label={t("stateId")}
                                        value={selectedOption}
                                        options={optionsStates}
                                        placeholder={
                                            loadingStates ? tA('loading') : tA('selectState')
                                        }
                                        onChange={(opt) => field.onChange(opt.value)}
                                        error={errors.stateId?.message}
                                    />
                                )}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <LocationInput
                                showAddress={false}
                                control={control}
                                name="position"
                            />
                            <FormErrorMessage message={errors.position?.lat?.message || errors.position?.lat?.message} />
                        </div>
                    </div>
                </div>

                {/* --- Section 3: Utilities (Meters) --- */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-2">{t("utilities")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Controller control={control} name="electricityMeterNumber" render={({ field }) => <TextInput {...field} label={t("electricityMeterNumber")} placeholder={t("placeholders.electricityMeterNumber")} error={errors.electricityMeterNumber?.message} />} />
                        <Controller control={control} name="waterMeterNumber" render={({ field }) => <TextInput {...field} label={t("waterMeterNumber")} placeholder={t("placeholders.waterMeterNumber")} error={errors.waterMeterNumber?.message} />} />
                        <Controller control={control} name="gasMeterNumber" render={({ field }) => <TextInput {...field} label={t("gasMeterNumber")} placeholder={t("placeholders.gasMeterNumber")} error={errors.gasMeterNumber?.message} />} />
                    </div>
                </div>

                {/* --- Section 3: Facilities (Nested) --- */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-2">{t("facilities")}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            'bedrooms', 'bathrooms', 'livingRooms', 'kitchen',
                            'parking', 'elevators', 'rooms', 'majlis', 'store'
                        ].map((key) => (
                            <Controller
                                key={key}
                                control={control}
                                name={`facilities.${key}` as any}
                                render={({ field }) => (
                                    <TextInput
                                        type="number"
                                        {...field}
                                        value={field.value ?? '0'} // Handle 0 vs undefined
                                        label={t(key)}
                                        placeholder={t(`placeholders.facilities.${key}`)}
                                        min={0}
                                        error={(errors.facilities as any)?.[key]?.message}
                                    />
                                )}
                            />
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-6 mt-4">
                        {['maidRoom', 'backyard', 'centralAC', 'desertAC'].map(key => (
                            <Controller
                                key={key}
                                control={control}
                                name={`facilities.${key}` as any}
                                render={({ field }) => (
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={!!field.value}
                                            onChange={field.onChange}
                                            className="w-4 h-4 text-secondary rounded focus:ring-secondary"
                                        />
                                        <span className="text-dark font-medium">{t(key)}</span>
                                    </label>
                                )}
                            />
                        ))}
                        <Controller
                            control={control}
                            name="isFurnished"
                            render={({ field }) => (
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={field.value} onChange={field.onChange} className="w-4 h-4 text-secondary rounded" />
                                    <span className="text-dark font-medium">{t("isFurnished")}</span>
                                </label>
                            )}
                        />
                    </div>
                </div>

                {/* --- Section 4: Features Tags --- */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4">{t(`featuresAndFacilities`)}</h3>
                    <FeaturesTagsInput
                        control={control}
                        label={t("features")}
                        name="features"
                        placeholder={t("featuresPlaceholder")}
                        errors={errors}
                    />
                    {/* Education Array */}
                    <NearbyFacilitiesSection errors={errors} control={control} name="educationInstitutions" label={t("educationInstitutions")} />

                    <NearbyFacilitiesSection errors={errors} control={control} name="healthMedicalFacilities" label={t("healthMedicalFacilities")} />

                </div>

                {/* --- Section 5: Images --- */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4">{t("gallery")}</h3>
                    <Uploader
                        control={control}
                        name="images"
                        accept="image/*"
                        onRemoveFile={isEditMode ? (file) => handleRemoveFile(file, "image") : undefined}
                        preventRemoveOn={1}
                        allowMultiple
                        maxFiles={6}
                        maxSizeMB={5}
                        rules={[
                            tCommon("uploader.rules.maxSize", { size: 5 }),
                            tCommon("uploader.rules.maxFiles", { count: 6 }),
                        ]}
                    />
                    <FormErrorMessage message={errors.images?.message?.toString()} />
                </div>

                {/* Actions */}
                <div className="flex  gap-4 pt-4">
                    <SecondaryButton
                        type="submit"
                        disabled={isLoading}
                        onClick={handleSubmit(onSubmit as any)}
                        className="bg-secondary text-white w-40"
                    >
                        {isLoading ? tCommon("saving") : tCommon("save")}
                    </SecondaryButton>
                    {/* <SecondaryButton
                        type="button"
                        onClick={() => router.back()}
                        className="bg-gray-100 text-gray-600 hover:bg-gray-200"
                    >
                        {tCommon("cancel")}
                    </SecondaryButton> */}
                </div>
            </div>
        </div>
    );
}

