'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import KeywordSearch from './KeywordSearch';
import { updateUrlParams } from '@/utils/helpers';
import { useTranslations } from 'next-intl';

type Props = {
    value: string;
    onChange: (val: string) => void;
    searchPlaceholder?: string;
};

export default function SearchField({ value, onChange, searchPlaceholder }: Props) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const t = useTranslations('comman')

    const debouncedValue = useDebounce(value);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (debouncedValue) {
            params.set('search', debouncedValue);
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        } else if (params.get('search')) {
            params.delete('search');
            updateUrlParams(pathname, params);

        }
    }, [debouncedValue]);

    return <KeywordSearch value={value} onChange={onChange} searchPlaceholder={searchPlaceholder ?? t('search')} />;
}
