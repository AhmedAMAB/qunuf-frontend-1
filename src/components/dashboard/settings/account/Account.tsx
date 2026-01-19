'use client'

import DashboardCard from "@/components/dashboard/DashboardCard";
import EditableField from "@/components/dashboard/EditableField";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale, useTranslations } from "next-intl";
import api from "@/libs/axios";
import { toast } from "react-hot-toast";
import AddressPopup from "./AddressPopup";
import { IdentityPopup } from "./IdentityPopup";
import { PhonePopupDefault } from "./PhonePopupDefault";
import { NamePopupDefault } from "./NamePopupDefault";
import { useEffect, useMemo, useRef, useState } from "react";
import { IdentityType } from "@/types/global";

import { z, ZodSchema } from "zod";
import { NationalityPopup } from "./NationalityPopup";
import { BirthDatePopup } from "./BirthDatePopup";
import { PasswordPopup } from "./PasswordPopup";
import { EmailPopup } from "./EmailPopup";
import UserImageUpdater from "./UserImageUpdater";
import ShortAddressPopup from "./ShortAddressPopup";
import { saudiPhoneRegex } from "@/utils/helpers";
import { isWithinAdultRange } from "@/utils/date";

// Saudi Phone Regex


export const userUpdateSchema = z.object({
    name: z.string()
        .min(3, "validation.min3")
        .max(100, "validation.max100")
        .optional(),

    email: z.email(),

    phoneNumber: z.string()
        .regex(saudiPhoneRegex, "validation.invalidPhone")
        .optional(),

    birthDate: z.date()
        .refine((date) => {

            return isWithinAdultRange(date);
        }, "validation.invalidBirthDate")
        .optional(),
    identityType: z
        .string()
        .min(1, 'validation.required'),
    identityOtherType: z
        .string(),
    identityNumber: z.string()
        .min(3, "validation.min3")
        .max(20, "validation.max20")
        .regex(/^[a-zA-Z0-9]*$/, "validation.alphanumeric"),

    identityIssueCountryId: z.uuid().optional(),
    nationalityId: z.uuid().optional(),

    // address: z.object({
    //     stateId: z.uuid().optional(),
    //     city: z.string().min(2, "validation.required").optional(),
    //     streetName: z.string().min(2, "validation.required").optional(),
    //     buildingNumber: z.string().min(1, "validation.required").optional(),
    //     postalCode: z.string().optional(),
    //     additionalNumber: z.string().optional(),
    // }).optional(),
    shortAddress: z.string()
        .length(8, "validation.shortAddressLength")
        .regex(/^[A-Z]{4}\d{4}$|^[0-9]{8}$/, "validation.shortAddressInvalid")
        .optional(),
}).superRefine((data, ctx) => {
    if (data.identityType === IdentityType.OTHER) {
        if (!data.identityOtherType || data.identityOtherType.length < 1) {
            ctx.addIssue({
                path: ['identityOtherType'],
                message: 'validation.required',
                code: z.ZodIssueCode.custom,
            });
            return;
        }

        if (data.identityOtherType.length < 3) {
            ctx.addIssue({
                path: ['identityOtherType'],
                message: 'validation.min3',
                code: z.ZodIssueCode.custom,
            });
        }
    }
});;

export type UserUpdateInput = z.infer<typeof userUpdateSchema>;

export default function Account() {
    const t = useTranslations('dashboard.account');
    const locale = useLocale()
    const isAr = locale === 'ar'
    const { user, setCurrentUser, loadingUser } = useAuth(); // Assuming refreshUser updates local state
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [updating, setUpdateing] = useState(false);

    // --- New State for Email Logic ---
    const [resendLoading, setResendLoading] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // --- Cooldown Timer Logic ---
    useEffect(() => {
        if (cooldown > 0) {
            timerRef.current = setTimeout(() => setCooldown(cooldown - 1), 1000);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [cooldown]);

    const startResendCooldown = () => {
        setCooldown(30);
    };

    // --- Helper Functions ---
    async function resendEmail() {
        try {
            setResendLoading(true);
            await api.post('/auth/resend-email-confirmation');
            toast.success(t('messages.emailResent')); // Make sure key exists or use hardcoded string
            startResendCooldown();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || t('messages.failedToResend'));
        } finally {
            setResendLoading(false);
        }
    }

    async function cancelEmailChange() {
        try {
            setCancelLoading(true);
            await api.post('/auth/cancel-email-change');

            // Optimistically update local user state to remove pendingEmail
            if (user) {
                setCurrentUser({ ...user, pendingEmail: null });
            }
            toast.success(t('messages.changeCanceled'));
        } catch (err) {
            toast.error(t('messages.failedToCancel'));
        } finally {
            setCancelLoading(false);
        }
    }

    const handleUpdate = async (payload: any, onClose: () => void, schema: ZodSchema = userUpdateSchema) => {
        setErrors({}); // Clear previous errors

        const result = schema.safeParse(payload);

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                // join the path array: e.g., ['address', 'city'] -> "address.city"
                const path = issue.path.join('.');
                fieldErrors[path] = issue.message;
            });

            setErrors(fieldErrors)
            return;
        }
        setUpdateing(true);
        const toastId = toast.loading(t("messages.updating"));
        try {
            const res = await api.put("/users/profile", payload);
            toast.success(t("messages.updateSuccess"), { id: toastId });
            setCurrentUser(res.data)
            onClose();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || t("messages.updateError"), { id: toastId });
        }
        finally {
            setUpdateing(false);
        }
    };

    // Address Merge Logic

    //We will store at database short address number instead of detailed address
    // const fullAddress = useMemo(() => {
    //     if (!user?.address) return '';

    //     const addr = user.address;

    //     return [
    //         addr.buildingNumber ? `${t('buildingNumber')}: ${addr.buildingNumber}` : null,
    //         addr.streetName ? `${t('streetName')}: ${addr.streetName}` : null,
    //         addr.city ? `${t('city')}: ${addr.city}` : null,
    //         addr.state?.name ? `${t('state')}: ${addr.state?.name}` : null,
    //         addr.postalCode ? `${t('postalCode')}: ${addr.postalCode}` : null,
    //         addr.additionalNumber ? `${t('additionalNumber')}: ${addr.additionalNumber}` : null,
    //     ]
    //         .filter(Boolean)
    //         .join(' • ');
    // }, [
    //     user?.address?.buildingNumber,
    //     user?.address?.streetName,
    //     user?.address?.city,
    //     user?.address?.state?.name,
    //     user?.address?.postalCode,
    //     user?.address?.additionalNumber,
    //     t // include t if you are using translations inside useMemo
    // ]);

    const identityInfo = useMemo(() => {
        if (!user) return '';

        const typeValue = user.identityType === IdentityType.OTHER && user.identityOtherType
            ? user.identityOtherType
            : user.identityType ? t(`identityTypeGroup.${user.identityType}`) : '';

        const maskedNumber = user.identityNumber
            ? `${user.identityNumber.slice(0, 2)}******${user.identityNumber.slice(-2)}`
            : '';

        const countryValue = user?.identityIssueCountry
            ? ` ${isAr ? user.identityIssueCountry?.name_ar : user.identityIssueCountry?.name}`.trim()
            : '';

        const parts = [
            typeValue ? `${t('typeLabel')}: ${typeValue}` : null,
            maskedNumber ? `${t('idNumberLabel')}: ${maskedNumber}` : null,
            countryValue ? `${t('issueCountryLabel')}: ${countryValue}` : null
        ];

        const separator = ' • ';

        return parts.filter(Boolean).join(separator);

    }, [user, isAr, t]);


    if (loadingUser) {
        return (
            <div className="animate-pulse">
                {/* DashboardCard Content Skeleton */}
                <DashboardCard>
                    <div className="flex flex-col items-center pb-6 border-b border-gray-100 mb-6">
                        {/* Circular Image Skeleton */}
                        <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gray-200 mb-4 border-4 border-gray-50" />

                        {/* Name Skeleton */}
                        <div className="h-6 bg-gray-200 rounded w-48" />
                    </div>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="py-5 border-b border-gray-100 last:border-0">
                            <div className="flex justify-between items-center mb-2">
                                {/* Label Skeleton */}
                                <div className="h-3 bg-gray-200 rounded w-24" />
                                {/* Edit Button Link Skeleton */}
                                <div className="h-3 bg-blue-100 rounded w-10" />
                            </div>
                            {/* Value Display Skeleton */}
                            <div className="h-5 bg-gray-100 rounded w-3/4 sm:w-1/2" />
                        </div>
                    ))}
                </DashboardCard>
            </div>
        );
    }
    return (
        <>

            <DashboardCard>
                {/* Full Name */}
                <UserImageUpdater />
                <EditableField
                    label={t('fullName')}
                    valueDisplay={user?.name}
                    renderPopup={(close) => <NamePopupDefault
                        value={user?.name}
                        isLoading={updating}
                        error={errors.name}
                        onSave={(val) => handleUpdate({ name: val }, close, z.object({ name: userUpdateSchema.shape.name }))}
                        close={close}
                    />
                    }
                />

                {/* --- EMAIL SECTION (New) --- */}
                {user?.pendingEmail ? (
                    // PENDING EMAIL STATE
                    <div className="py-5 border-b border-gray-100 last:border-0">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-gray-500 text-sm">{t('email')}</label>
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                {t('pendingVerification')}
                            </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <p className="text-dark font-medium">{user.email}</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    {t('verificationSentTo')}: <span className="text-secondary">{user.pendingEmail}</span>
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={resendEmail}
                                    disabled={resendLoading || cooldown > 0}
                                    className={`text-sm px-3 py-1.5 rounded-md border transition-colors 
                                    ${cooldown > 0
                                            ? 'bg-gray-100 text-gray-400 border-gray-200'
                                            : 'border-secondary text-secondary hover:bg-secondary hover:text-white'
                                        }`}
                                >
                                    {resendLoading ? t('sending') : cooldown > 0 ? `${t('resend')} (${cooldown})` : t('resend')}
                                </button>
                                <button
                                    onClick={cancelEmailChange}
                                    disabled={cancelLoading}
                                    className="text-sm px-3 py-1.5 rounded-md border border-red-200 bg-red-100 text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    {cancelLoading ? '...' : t('cancel')}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    // NORMAL EMAIL EDIT STATE
                    <EditableField
                        label={t('email')}
                        valueDisplay={user?.email}
                        renderPopup={(close) => (
                            <EmailPopup
                                value={user?.email}
                                close={close}
                                onSuccess={() => {
                                    startResendCooldown();
                                }}
                            />
                        )}
                    />
                )}

                {/* --- PASSWORD SECTION (New) --- */}
                <EditableField
                    label={t('password')}
                    valueDisplay="••••••••"
                    renderPopup={(close) => (
                        <PasswordPopup close={close} />
                    )}
                />


                {/* Phone Number */}
                <EditableField
                    label={t('phone')}
                    valueDisplay={user?.phoneNumber}
                    renderPopup={(close) => (
                        <PhonePopupDefault
                            value={user?.phoneNumber}
                            isLoading={updating}
                            error={errors.phoneNumber}
                            onSave={(val) => handleUpdate({ phoneNumber: val }, close, z.object({ phoneNumber: userUpdateSchema.shape.phoneNumber }))}
                            close={close}
                        />
                    )}
                />

                {/* Address (Merged) */}
                {/* BirthDate*/}
                <EditableField
                    label={t('birthDate')}
                    valueDisplay={user?.birthDate ? new Date(user.birthDate).toLocaleDateString() : ''}
                    renderPopup={(close) => <BirthDatePopup
                        value={user?.birthDate}
                        isLoading={updating}
                        error={errors.birthDate}
                        onSave={(val) => handleUpdate({ birthDate: val }, close, z.object({ birthDate: userUpdateSchema.shape.birthDate }))}
                        close={close}
                    />
                    }
                />

                {/*  Nationality*/}
                <EditableField
                    label={t('nationality')}
                    popupClassName="!overflow-visible"
                    valueDisplay={isAr ? user?.nationality?.name_ar : user?.nationality?.name}
                    renderPopup={(close) => <NationalityPopup
                        value={isAr ? user?.nationality?.name_ar : user?.nationality?.name}
                        isLoading={updating}
                        error={errors.nationalityId}
                        onSave={(val) => handleUpdate({ nationalityId: val }, close, z.object({ nationalityId: userUpdateSchema.shape.nationalityId }))}
                        close={close}
                    />
                    }
                />


                {/* 
                detailed address
                <EditableField
                    label={t('address')}
                    popupClassName="!overflow-visible"
                    valueDisplay={fullAddress}
                    renderPopup={(close) => (
                        <AddressPopup
                            errors={errors}
                            initialData={user?.address ?? {
                                city: '',
                                streetName: '',
                                buildingNumber: '',
                                stateId: '',
                                postalCode: '',
                                additionalNumber: '',
                            }}
                            isLoading={updating}
                            onSave={(data) => handleUpdate({ address: data }, close, z.object({ address: userUpdateSchema.shape.address }))}
                            close={close}
                        />
                    )}
                /> */}

                <EditableField
                    label={t('shortAddress')}
                    valueDisplay={user?.shortAddress}
                    renderPopup={(close) => (
                        <ShortAddressPopup
                            errors={errors}
                            initialData={user?.shortAddress || ''}
                            isLoading={updating}
                            // Update handleUpdate to send { shortAddress: data }   
                            onSave={(data) => handleUpdate({ shortAddress: data }, close, z.object({ shortAddress: userUpdateSchema.shape.shortAddress }))}
                            close={close}
                        />
                    )}
                />

                {/* Identity & Nationality */}
                <EditableField
                    label={t('identityInfo')}
                    popupClassName="!overflow-visible"
                    valueDisplay={`${identityInfo}`}
                    renderPopup={(close) => (
                        <IdentityPopup
                            errors={errors}
                            user={user}
                            isLoading={updating}
                            onSave={(data) => handleUpdate(data, close, userUpdateSchema.pick({
                                identityType: true,
                                identityNumber: true,
                                identityIssueCountryId: true,
                                identityOtherType: true
                            }))}
                            close={close}
                        />
                    )}
                />
            </DashboardCard>
        </>
    );
}