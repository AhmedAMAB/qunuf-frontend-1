'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import api from '@/libs/axios';
import toast from 'react-hot-toast';
import ActionPopup from '@/components/shared/ActionPopup';
import { Contract } from '@/types/dashboard/contract';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TextAreaInput from '@/components/shared/forms/TextAreaInput';
import { FaStar } from 'react-icons/fa';
import { TableRowType } from '@/types/table';
import Popup from '@/components/shared/Popup';

type ReviewPopupsProps = {
    row: Contract;
    onClose: () => void;
    setRows?: React.Dispatch<React.SetStateAction<TableRowType<Contract>[] | null>>;
    fetchRows?: (signal?: AbortSignal) => Promise<void>;
};

const getCreateReviewSchema = (t: (key: string, params?: any) => string) => z.object({
    rate: z.coerce.number()
        .min(1, { message: t("validation.min", { min: 1 }) })
        .max(5, { message: t("validation.max", { max: 5 }) }),
    reviewText: z.string()
        .max(5000, { message: t("validation.maxLength", { max: 5000 }) })
        .optional(),
});

// 3. Generate the type directly from the schema function's return type
type CreateReviewFormData = z.infer<ReturnType<typeof getCreateReviewSchema>>;

export function CreateReviewPopup({ row: contract, onClose, setRows, fetchRows }: ReviewPopupsProps) {
    const tCommon = useTranslations('comman');
    const t = useTranslations('dashboard.contracts.reviews.create');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedRating, setSelectedRating] = useState<number>(0);

    const createReviewSchema = useMemo(() => getCreateReviewSchema(tCommon), [tCommon]);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CreateReviewFormData>({
        resolver: zodResolver(createReviewSchema) as unknown as any,
        defaultValues: {
            rate: 0,
            reviewText: '',
        },
    });

    const watchedRate = watch('rate');

    useEffect(() => {
        if (selectedRating > 0) {
            setValue('rate', selectedRating);
        }
    }, [selectedRating, setValue]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const toastId = toast.loading(tCommon('submitting'));

        try {
            await api.post('/reviews', {
                contractId: contract.id,
                rate: data.rate,
                reviewText: data.reviewText || undefined,
            });

            toast.success(t('success'), { id: toastId });

            // Update the contract in the table
            if (setRows) {
                setRows((prevRows) => {
                    if (!prevRows) return null;
                    return prevRows.map((item) =>
                        item.id === contract.id ? { ...item, isReviewed: true } : item
                    );
                });
            }

            // Refresh the table
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

            {/* Star Rating */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('fields.rating')}
                </label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => {
                                setSelectedRating(star);
                                setValue('rate', star);
                            }}
                            className={`p-2 transition-colors ${(selectedRating >= star || watchedRate >= star)
                                ? 'text-yellow-400'
                                : 'text-gray-300 hover:text-yellow-300'
                                }`}
                        >
                            <FaStar size={32} />
                        </button>
                    ))}
                </div>
                <input type="hidden" {...register('rate')} />
                {errors.rate && (
                    <p className="text-xs text-red-500 mt-1">{tCommon(String(errors.rate.message))}</p>
                )}
            </div>

            {/* Review Text */}
            <TextAreaInput
                value={watch('reviewText') ?? ''}
                onChange={(e) => setValue('reviewText', e.target.value)}
                label={t('fields.reviewText')}
                placeholder={t('fields.reviewTextPlaceholder')}
                rows={6}
                error={errors.reviewText?.message ? tCommon(String(errors.reviewText.message)) : undefined}
            />

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

export function ViewReviewPopup({ row: contract, onClose }: ReviewPopupsProps) {
    const t = useTranslations('dashboard.contracts.reviews.view');
    const [review, setReview] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        const fetchReview = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/reviews/contract/${contract.id}`, {
                    signal: controller.signal,
                    params: { limit: 1 }
                });
                if (res.data.items && res.data.items.length > 0) {
                    setReview(res.data.items[0]);
                } else {
                    setError(t('noReview'));
                }
            } catch (err: any) {
                if (err?.name === 'CanceledError') return;
                setError(err?.response?.data?.message || t('error'));
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        fetchReview();
        return () => controller.abort();
    }, [contract.id, t]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!review) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">{t('noReview')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 w-[80vw] lg:w-[60vw] xl:w-[30vw]">
            <div className="text-center mb-4">
                <h2 className="text-xl font-bold mb-2">{t('title')}</h2>
                <p className="text-sm text-gray-600">{t('subtitle')}</p>
            </div>

            {/* Rating Display */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('fields.rating')}
                </label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                            key={star}
                            size={24}
                            className={star <= review.rate ? 'text-yellow-400' : 'text-gray-300'}
                        />
                    ))}
                </div>
            </div>

            {/* Review Text */}
            {review.reviewText && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('fields.reviewText')}
                    </label>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        {review.reviewText}
                    </p>
                </div>
            )}

            {/* Review Date */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('fields.reviewDate')}
                </label>
                <p className="text-gray-600">
                    {new Date(review.created_at).toLocaleDateString()}
                </p>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-hover transition-colors"
                >
                    {t('close')}
                </button>
            </div>
        </div>
    );
}
