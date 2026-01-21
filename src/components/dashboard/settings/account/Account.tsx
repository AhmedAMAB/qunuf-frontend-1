'use client'

import DashboardCard from "@/components/dashboard/DashboardCard";
import EditableField from "@/components/dashboard/EditableField";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale, useTranslations } from "next-intl";
import api from "@/libs/axios";
import { toast } from "react-hot-toast";
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
import { cn } from "@/lib/utils";

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

    birthDate: z.union([z.date(), z.undefined()])
        .refine((val) => val !== undefined, {
            message: "validation.required",
        })
        .refine((val) => isWithinAdultRange(val), {
            message: "validation.invalidBirthDate",
        }),
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
        return <AccountSkeleton />;
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
                    <PendingEmailField user={user} />
                ) : (
                    <EditableField
                        label={t('email')}
                        valueDisplay={user?.email}
                        renderPopup={(close) => (
                            <EmailPopup
                                value={user?.email}
                                close={close}
                                onSuccess={() => startResendCooldown()}
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
                    popupClassName="popup-visable"
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
                    popupClassName="popup-visable"
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
                    popupClassName="popup-visable"
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




    // Pending Email Field Component
    function PendingEmailField({ user }: { user: any }) {
        const t = useTranslations('dashboard.account');

        return (
            <div className="group relative py-5 border-b border-gray/10">
                {/* Hover background */}
                <div className="absolute -inset-x-4 inset-y-0 bg-gradient-to-r from-yellow-50/50 to-orange-50/50 rounded-xl opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-dark/70">
                            {t('email')}
                        </label>
                        <span className="flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1.5 rounded-full shadow-sm">
                            <svg className="w-3.5 h-3.5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {t('pendingVerification')}
                        </span>
                    </div>

                    {/* Email Info */}
                    <div className="space-y-2">
                        <p className="text-base font-medium text-dark">{user.email}</p>
                        <p className="text-sm text-dark/60 flex items-center gap-2">
                            <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>
                                {t('verificationSentTo')}:
                                <span className="font-semibold text-secondary ml-1">{user.pendingEmail}</span>
                            </span>
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-2">
                        <button
                            onClick={resendEmail}
                            disabled={resendLoading || cooldown > 0}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                                cooldown > 0
                                    ? "bg-gray/10 text-dark/40 cursor-not-allowed"
                                    : "bg-secondary/10 text-secondary hover:bg-secondary hover:text-white hover:shadow-md active:scale-95"
                            )}
                        >
                            {resendLoading ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    {t('sending')}
                                </>
                            ) : cooldown > 0 ? (
                                `${t('resend')} (${cooldown}s)`
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    {t('resend')}
                                </>
                            )}
                        </button>

                        <button
                            onClick={cancelEmailChange}
                            disabled={cancelLoading}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-200 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {cancelLoading ? (
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    {t('cancel')}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    function AccountSkeleton() {
        return (
            /* Using tailwindcss-animate classes:
               - animate-in: triggers the entry
               - fade-in: smooth appearance
               - duration-1000: timing of entry
               - animate-pulse: the looping effect
            */
            <DashboardCard className="mx-auto animate-pulse">
                <div className="duration-[3000ms] ease-in-out">
                    {/* Profile Image Skeleton */}
                    <div className="flex flex-col items-center pb-8 mb-6 border-b border-gray/10">
                        <div className="h-40 w-40 rounded-full bg-gradient-to-br from-gray/10 to-gray/20 mb-6 shadow-xl" />
                        <div className="h-8 bg-gray/15 rounded-lg w-48 mb-2" />
                        <div className="h-5 bg-gray/10 rounded-lg w-64" />
                    </div>

                    {/* Fields Skeleton */}
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="py-5 border-b border-gray/10 last:border-0 space-y-3">
                            <div className="flex justify-between items-center">
                                <div className="h-4 bg-gray/15 rounded w-24" />
                                <div className="h-8 bg-secondary/10 rounded-lg w-16" />
                            </div>
                            <div className="h-6 bg-gray/10 rounded w-3/4" />
                        </div>
                    ))}
                </div>
            </DashboardCard>
        );
    }

} {/* 
    detailed address
    <EditableField
        label={t('address')}
        popupClassName="popup-visable"
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


