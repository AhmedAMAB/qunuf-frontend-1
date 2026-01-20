'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import api from '@/libs/axios';
import toast from 'react-hot-toast';
import ActionPopup from '@/components/atoms/ActionPopup';
import { MdEdit, MdCheck, MdClose, MdUpload, MdCancel } from 'react-icons/md';
import { RiIndeterminateCircleLine } from 'react-icons/ri';
import TextAreaInput from '@/components/molecules/forms/TextAreaInput';
import TextInput from '@/components/molecules/forms/TextInput';
import { Contract, ContractStatus } from '@/types/dashboard/contract';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { diffWords, Change } from 'diff';

type ContractActionPopupsProps = {
    row: Contract;
    onClose: () => void;
    setRows?: React.Dispatch<React.SetStateAction<any[] | null>>;
    fetchRows?: (signal?: AbortSignal) => Promise<void>;
};

// Revise Contract Form Schema
const getReviseSchema = (t: (key: string, params?: any) => string) => z.object({
    newTerms: z.string().min(1, { message: t("validation.required") }).max(10000, { message: t("validation.maxLength", { max: 10000 }) }),
});

type ReviseFormData = z.infer<ReturnType<typeof getReviseSchema>>;

export interface AcceptFormData {
    shouldSendRenewalNotify?: boolean;
    renewalDiscountAmount?: number;
    requiredMonthsForIncentive?: number;
}

// Accept Contract Form Schema
export const getAcceptSchema = (t: any): z.ZodType<AcceptFormData> =>
    z.object({
        shouldSendRenewalNotify: z.boolean().optional(),
        renewalDiscountAmount: z.coerce.number().min(0, { message: t("validation.min", { min: 0 }) }).optional(),
        requiredMonthsForIncentive: z.coerce.number().min(0, { message: t("validation.min", { min: 0 }) }).optional(),
    }).refine((data) => {
        if (data.shouldSendRenewalNotify && (data.renewalDiscountAmount ?? 0) > 0) {
            return (data.requiredMonthsForIncentive ?? 0) > 0;
        }
        return true;
    }, {
        message: t("validation.required"),
        path: ['requiredMonthsForIncentive'],
    });



// Activate Contract Form Schema
const getActivateSchema = (t: (key: string, params?: any) => string) => z.object({
    contractNumber: z.string().min(1, { message: t("validation.required") }).max(50, { message: t("validation.maxLength", { max: 50 }) }),
    contractPdf: z
        .any()
        .refine((files) => files?.length > 0, { message: t("validation.required") })
        .refine((files) => files?.[0] instanceof File, { message: t("validation.required") }),
});

type ActivateFormData = z.infer<ReturnType<typeof getActivateSchema>>;

export function ReviseContractPopup({ row: contract, onClose, setRows, fetchRows }: ContractActionPopupsProps) {
    const tCommon = useTranslations('comman');
    const t = useTranslations('dashboard.contracts.actions.revise');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const reviseSchema = useMemo(() => getReviseSchema(tCommon), [tCommon]);

    const { watch, setValue, handleSubmit, formState: { errors } } = useForm<ReviseFormData>({
        resolver: zodResolver(reviseSchema),
        defaultValues: {
            newTerms: contract.currentTerms || contract.originalTerms || '',
        },
    });


    const onSubmit = async (data: ReviseFormData) => {
        setIsSubmitting(true);
        const toastId = toast.loading(tCommon('submitting'));

        try {
            await api.patch(`/contracts/${contract.id}/landlord-revise`, {
                newTerms: data.newTerms,
            });
            toast.success(t('success'), { id: toastId });
            if (fetchRows) {
                await fetchRows();
            }
            onClose();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || t('error'), { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const [showDiff, setShowDiff] = useState(false);
    const watchedNewTerms = watch('newTerms');

    // Memoize the difference calculation
    const termsDiff = useMemo(() => {
        if (!showDiff) return [];
        return diffWords(contract.originalTerms || '', watchedNewTerms || '');
    }, [showDiff, watchedNewTerms, contract.originalTerms]);

    return (
        <div className="w-[80vw] lg:w-[60vw] xl:w-[30vw] mx-auto min-h-[500px]"> {/* Forces consistent width and min-height */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="text-center mb-4">
                    <h2 className="text-xl font-bold mb-2">{t('title')}</h2>
                    <p className="text-sm text-gray-600">{t('subtitle')}</p>
                </div>

                {/* Diff Mode Toggle */}
                <div className="flex items-center gap-2 mb-2">
                    <input
                        type="checkbox"
                        id="showDiff"
                        checked={showDiff}
                        onChange={(e) => setShowDiff(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-secondary focus:ring-secondary"
                    />
                    <label htmlFor="showDiff" className="text-sm font-medium cursor-pointer">
                        {t('showComparison')}
                    </label>
                </div>

                {/* The Container below now has a forced height and width 
               to prevent layout shift when switching modes.
            */}
                <div className="min-h-[300px]">
                    {showDiff ? (
                        <div className="space-y-2 animate-in fade-in duration-200">
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 h-[300px] overflow-y-auto custom-scrollbar">
                                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {termsDiff.map((part: Change, index: number) => (
                                        <span
                                            key={index}
                                            className={
                                                part.added
                                                    ? 'bg-green-100 text-green-800 px-0.5 rounded'
                                                    : part.removed
                                                        ? 'bg-red-100 text-red-800 line-through px-0.5 rounded'
                                                        : ''
                                            }
                                        >
                                            {part.value}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            {/* Legend */}
                            <div className="flex gap-4 text-[10px] text-gray-500 uppercase font-bold px-1">
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full" /> {t('addedText')}
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 bg-red-400 rounded-full" /> {t('removedText')}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in fade-in duration-200">
                            <TextAreaInput
                                value={watch('newTerms') ?? ''}
                                onChange={(e) => setValue('newTerms', e.target.value)}
                                label={t('fields.terms')}
                                placeholder={t('fields.termsPlaceholder')}
                                rows={12}
                                error={errors.newTerms?.message}
                            />
                        </div>
                    )}
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={isSubmitting}
                    >
                        {tCommon('cancel')}
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-hover transition-colors disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? tCommon('submitting') : t('submit')}
                    </button>
                </div>
            </form>
        </div>
    );
}

export function AcceptContractPopup({ row: contract, onClose, setRows, fetchRows }: ContractActionPopupsProps) {
    const t = useTranslations('dashboard.contracts.actions.accept');
    const tCommon = useTranslations('comman');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isLandlord = contract.status === ContractStatus.PENDING_LANDLORD_ACCEPTANCE;
    const showRenewalFields = isLandlord;

    const acceptSchema = useMemo(() => getAcceptSchema(tCommon), [tCommon]);


    const { register, handleSubmit, watch, formState: { errors } } = useForm<AcceptFormData>({
        resolver: zodResolver(acceptSchema),
        defaultValues: {
            shouldSendRenewalNotify: false,
            renewalDiscountAmount: 0,
            requiredMonthsForIncentive: 0,
        },
    });

    const shouldSendRenewalNotify = watch('shouldSendRenewalNotify');
    const renewalDiscountAmount = watch('renewalDiscountAmount');

    const onSubmit = async (data: AcceptFormData) => {
        setIsSubmitting(true);
        const toastId = toast.loading(tCommon('submitting'));

        try {
            const payload: any = {};
            if (isLandlord && data.shouldSendRenewalNotify) {
                payload.shouldSendRenewalNotify = data.shouldSendRenewalNotify;
                if (data.renewalDiscountAmount && data.renewalDiscountAmount > 0) {
                    payload.renewalDiscountAmount = data.renewalDiscountAmount;
                    payload.requiredMonthsForIncentive = data.requiredMonthsForIncentive || 0;
                }
            }

            await api.post(`/contracts/${contract.id}/accept`, payload);
            toast.success(t('success'), { id: toastId });
            if (fetchRows) {
                await fetchRows();
            }
            onClose();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || t('error'), { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
            <div className="text-center mb-4">
                <h2 className="text-xl font-bold mb-2">{t('title')}</h2>
                <p className="text-sm text-gray-600">{t('subtitle')}</p>
            </div>

            {showRenewalFields && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            {...register('shouldSendRenewalNotify')}
                            className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">{t('fields.sendRenewalNotify')}</span>
                    </label>

                    {shouldSendRenewalNotify && (
                        <>
                            <TextInput
                                {...register('renewalDiscountAmount', { valueAsNumber: true })}
                                type="number"
                                label={t('fields.renewalDiscountAmount')}
                                placeholder="0"
                                min={0}
                                error={errors.renewalDiscountAmount?.message}
                            />

                            {renewalDiscountAmount && renewalDiscountAmount > 0 ? (
                                <TextInput
                                    {...register('requiredMonthsForIncentive', { valueAsNumber: true })}
                                    type="number"
                                    label={t('fields.requiredMonthsForIncentive')}
                                    placeholder="0"
                                    min={0}
                                    max={contract.durationInMonths}
                                    error={errors.requiredMonthsForIncentive?.message}
                                />
                            ) : null}
                        </>
                    )}
                </div>
            )}

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                >
                    {tCommon('cancel')}
                </button>
                <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-hover transition-colors disabled:opacity-50"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? tCommon('submitting') : t('submit')}
                </button>
            </div>
        </form>
    );
}

export function CancelContractPopup({ row: contract, onClose, setRows, fetchRows }: ContractActionPopupsProps) {
    const t = useTranslations('dashboard.contracts.actions.cancel');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCancel = async () => {
        setIsSubmitting(true);
        const toastId = toast.loading(t('submitting'));

        try {
            await api.post(`/contracts/${contract.id}/cancel`);
            toast.success(t('success'), { id: toastId });
            if (fetchRows) {
                await fetchRows();
            }
            onClose();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || t('error'), { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ActionPopup
            title={t('title')}
            subtitle={t('subtitle')}
            MainIcon={MdCancel}
            mainIconColor="#FD5257"
            cancelText={t('cancel')}
            actionText={t('confirm')}
            onCancel={onClose}
            onAction={handleCancel}
            isDisabled={isSubmitting}
        />
    );
}

export function ActivateContractPopup({ row: contract, onClose, setRows, fetchRows }: ContractActionPopupsProps) {
    const t = useTranslations('dashboard.contracts.actions.activate');
    const tCommon = useTranslations('comman');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const activateSchema = useMemo(() => getActivateSchema(tCommon), [tCommon]);

    const { register, handleSubmit, formState: { errors } } = useForm<ActivateFormData>({
        resolver: zodResolver(activateSchema),
    });

    const onSubmit = async (data: ActivateFormData) => {
        setIsSubmitting(true);
        const toastId = toast.loading(tCommon('submitting'));

        try {
            const formData = new FormData();
            formData.append('contractPdf', data.contractPdf?.[0]);
            formData.append('contractNumber', data.contractNumber);

            await api.patch(`/contracts/${contract.id}/activate-ejar`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success(t('success'), { id: toastId });
            if (fetchRows) {
                await fetchRows();
            }
            onClose();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || t('error'), { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="text-center mb-4">
                <h2 className="text-xl font-bold mb-2">{t('title')}</h2>
                <p className="text-sm text-gray-600">{t('subtitle')}</p>
            </div>

            <TextInput
                {...register('contractNumber')}
                label={t('fields.contractNumber')}
                placeholder={t('fields.contractNumberPlaceholder')}
                error={errors.contractNumber?.message}
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('fields.contractPdf')}
                </label>
                <input
                    type="file"
                    accept=".pdf"
                    {...register('contractPdf')}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-white hover:file:bg-secondary-hover"
                />
                <p className="text-xs text-red-500">
                    {errors.contractPdf?.message?.toString()}
                </p>
            </div>

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                >
                    {tCommon('cancel')}
                </button>
                <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-hover transition-colors disabled:opacity-50"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? tCommon('submitting') : t('submit')}
                </button>
            </div>
        </form>
    );
}

export function TerminateContractPopup({ row: contract, onClose, setRows, fetchRows }: ContractActionPopupsProps) {
    const t = useTranslations('dashboard.contracts.actions.terminate');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleTerminate = async () => {
        setIsSubmitting(true);
        const toastId = toast.loading(t('submitting'));

        try {
            await api.post(`/contracts/${contract.id}/terminate`);
            toast.success(t('success'), { id: toastId });
            if (fetchRows) {
                await fetchRows();
            }
            onClose();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || t('error'), { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ActionPopup
            title={t('title')}
            subtitle={t('subtitle')}
            MainIcon={RiIndeterminateCircleLine}
            mainIconColor="#FD5257"
            note={t('note')}
            cancelText={t('cancel')}
            actionText={t('confirm')}
            onCancel={onClose}
            onAction={handleTerminate}
            isDisabled={isSubmitting}
        />
    );
}

