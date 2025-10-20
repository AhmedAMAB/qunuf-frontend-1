import { PropertyCell } from "@/components/shared/properties/PropertyCell";
import { PropertyRow } from "@/types/dashboard/properties";
import { TableColumnType } from "@/types/table";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
export const locationValues = [
    'all',
    'cairo',
    'alexandria',
    'giza'
] as const;

export const subtypeValues = {
    residential: ['condo', 'multiFamily', 'townhomes', 'singleFamily'],
    commercial: ['office', 'retail', 'warehouse', 'industrial']
} as const;

export const bedroomValues = [
    'any',
    '1',
    '2',
    '3',
    '4',
    'fiveAndMore'
] as const;

export const bathroomValues = [
    'any',
    '1_0',
    '1_5',
    '2_0',
    '2_5',
    'threeAndMore'
] as const;


export const featurevalues = [
    'airConditioning',
    'assistedLiving',
    'disabilityAccess',
    'controlledAccess',
    'cableReady',
    'availableNow',
    'college',
    'corporate',
    'elevator',
    'extraStorage',
    'highSpeedInternet',
    'garage',
    'petAllowed'
];


export const periodValues: PeriodType[] = [
    'yearly',
    'monthly'
] as const;

export const propertyTypeValues: PropertyType[] = [
    'residential',
    'commercial'
] as const;

export const furnishedValues: FurnishedType[] = [
    'furnished',
    'unfurnished'
] as const;

export type PeriodType = "monthly" | "yearly";
export type PropertyType = "residential" | "commercial";
export type FurnishedType = "furnished" | "unfurnished";

export const MIN_PRICE = 1000;
export const MAX_PRICE = 100_000;

export const MIN_SCQUAREFEET = 10;
export const MAX_SCQUAREFEET = 1500;

export const MIN_YEARBUILD = 1950;
export const MAX_YEARBUILD = 2025;

export type FilterState = {
    location: string;
    period: "monthly" | "yearly";
    type: "residential" | "commercial";
    subtype: string[];
    furnished: "furnished" | "unfurnished";
    bathroom: string;
    bedroom: string;
    features: string[];
    priceMin: number;
    priceMax: number;
    scquarefeetMin: number;
    scquarefeetMax: number;
    yearBuiltMin: number;
    yearBuiltMax: number;
};

export const featureKeys = [
    "airConditioning",
    "assistedLiving",
    "disabilityAccess",
    "controlledAccess",
    "cableReady",
    "availableNow",
    "college",
    "corporate",
    "elevator",
    "extraStorage",
    "highSpeedInternet",
    "garage",
    "petAllowed",
] as const;

export const PropertyColumns = (t: ReturnType<typeof useTranslations>): TableColumnType<PropertyRow>[] => [
    {
        key: 'property',
        label: t('property'),
        cell(value) {
            return <PropertyCell {...value} />;
        }
    },
    {
        key: 'status',
        label: t('status'),
        cell(value) {
            const status = value as string;
            const statusMap: Record<string, { bg: string; text: string; dot: string; label: string }> = {
                free: {
                    bg: 'bg-[#ECFDF3]',
                    text: 'text-[#027A48]',
                    dot: 'bg-[#027A48]',
                    label: t('free'),
                },
                online: {
                    bg: 'bg-[#ECFDF3]',
                    text: 'text-[#027A48]',
                    dot: 'bg-[#027A48]',
                    label: t('online'),
                },
                offline: {
                    bg: 'bg-[#FEE2E2]',
                    text: 'text-[#B91C1C]',
                    dot: 'bg-[#B91C1C]',

                    label: t('offline'),
                },
                booked: {
                    bg: 'bg-[#FEF3C7]',
                    text: 'text-[#92400E]',
                    dot: 'bg-[#92400E]',
                    label: t('booked'),
                },
            };

            const s = statusMap[status] ?? statusMap.free;

            return (
                <div className={`${s.bg} ${s.text} flex items-center gap-1 rounded-[16px] w-fit px-2`
                }>
                    <div className={`w-[6px] h-[6px] ${s.dot} rounded-full`} />
                    < span > {s.label} </span>
                </div>
            );
        },
    },
    {
        key: 'publishedAt',
        label: t('published'),
        cell: (value) => format(new Date(value), 'dd MMM yyyy'),
    },
    {
        key: 'price',
        label: t('price'),
        cell: (value) => `${value.toLocaleString()} $`,
    },
    {
        key: 'location',
        label: t('location'),
    },
];
