'use client';

import { useTranslations } from "next-intl";

export default function TableError({
    message = '',
    onRetry,
}: {
    message?: string;
    onRetry?: () => void;
}) {
    const t = useTranslations('dashboard.table');
    return (
        <div className="py-12 px-6 text-center flex flex-col items-center justify-center gap-5 rounded-xl border border-red-100 bg-red-50 dark:bg-red-100/10 dark:border-red-300/30">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-300/20">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#F44336" />
                    <path d="M12 7v6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="16" r="1.5" fill="#fff" />
                </svg>
            </div>

            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400"> {message ?? t('errorMessage')}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md">{message}</p>

            {onRetry && (
                <button
                    onClick={onRetry}
                    className="mt-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition"
                >
                    {t('retry')}
                </button>
            )}
        </div>
    );
}
