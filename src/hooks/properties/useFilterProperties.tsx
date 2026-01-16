import { useSearchParams, usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getSafeNumberInRange, updateUrlParams } from "@/utils/helpers";
import {
    FilterState,
    MAX_PRICE, MIN_PRICE, MAX_SCQUAREFEET, MIN_SCQUAREFEET, MAX_YEARBUILD, MIN_YEARBUILD,
    bedroomValues, bathroomValues, periodValues, propertyTypeValues, furnishedValues,
    featureKeys,
} from "@/constants/properties/constant";
import { useLocalizedOptionsGroups } from "../useLocalizedOptionsGroups";
import { useValues } from "@/contexts/GlobalContext";
import { useLocale, useTranslations } from "next-intl";
import { Option } from "@/components/shared/forms/SelectInput";
import { CommercialSubType, PropertyType, RentType, ResidentialSubType } from "@/types/dashboard/properties";
import { useRouter } from "@/i18n/navigation";


function useFilterProperties() {
    const tForm = useTranslations("dashboard.properties.form");
    const tEnums = useTranslations("property.enums");
    const t = useTranslations("property.filter");
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const locale = useLocale()
    const { states, loadingStates: loadingLocations } = useValues();
    const locations: Option[] = useMemo(
        () => [
            {
                value: "all",
                label: t("location.any"), // localized "Any location"
            },
            ...states.map((s) => ({
                value: s.id,
                label: locale === "ar" ? s.name_ar : s.name,
            })),
        ],
        [states, locale, t]
    );

    // options
    const { bedrooms,
        bathrooms,
        periods,
        propertyTypes,
        furnishedTypes
    } = useLocalizedOptionsGroups(
        [
            { key: 'bedrooms', translationPath: 'bedrooms', options: [...bedroomValues], },
            { key: 'bathrooms', translationPath: 'bathrooms', options: [...bathroomValues], },
            { key: 'periods', translationPath: 'rentalPeriod', options: [...periodValues], },
            { key: 'propertyTypes', translationPath: 'propertyType', options: [...propertyTypeValues], },
            { key: 'furnishedTypes', translationPath: 'furnishedType', options: [...furnishedValues], }
        ],
        'property.filter'
    );

    const yearOptions = useMemo(() => {
        const years: { label: string; value: number }[] = [];
        for (let year = MAX_YEARBUILD; year >= MIN_YEARBUILD; year--) {
            years.push({
                label: year.toString(),
                value: year,
            });
        }
        return years;
    }, []);


    const featureOptions = useMemo(
        () =>
            featureKeys.map((key) => ({
                value: key,
                label: tForm(`${key}`), // localized label
            })),
        [tForm]
    );

    const [filters, setFilters] = useState<FilterState>(() => {
        const rawPriceMin = getSafeNumberInRange(searchParams.get("priceMin"), MIN_PRICE, MIN_PRICE, MAX_PRICE);
        const rawPriceMax = getSafeNumberInRange(searchParams.get("priceMax"), MAX_PRICE, MIN_PRICE, MAX_PRICE);
        const priceMin = Math.min(rawPriceMin, rawPriceMax);
        const priceMax = Math.max(rawPriceMin, rawPriceMax);

        const rawSqftMin = getSafeNumberInRange(searchParams.get("scquarefeetMin"), MIN_SCQUAREFEET, MIN_SCQUAREFEET, MAX_SCQUAREFEET);
        const rawSqftMax = getSafeNumberInRange(searchParams.get("scquarefeetMax"), MAX_SCQUAREFEET, MIN_SCQUAREFEET, MAX_SCQUAREFEET);
        const scquarefeetMin = Math.min(rawSqftMin, rawSqftMax);
        const scquarefeetMax = Math.max(rawSqftMin, rawSqftMax);

        const rawYearMin = getSafeNumberInRange(searchParams.get("yearBuiltMin"), MIN_YEARBUILD, MIN_YEARBUILD, MAX_YEARBUILD);
        const rawYearMax = getSafeNumberInRange(searchParams.get("yearBuiltMax"), MAX_YEARBUILD, MIN_YEARBUILD, MAX_YEARBUILD);
        const yearBuiltMin = Math.min(rawYearMin, rawYearMax);
        const yearBuiltMax = Math.max(rawYearMin, rawYearMax);

        const type = searchParams.get("type") || PropertyType.RESIDENTIAL;
        const period = searchParams.get("period") || RentType.MONTHLY;
        const furnished = searchParams.get("furnished") || "furnished";
        const bathroom = searchParams.get("bathrooms") || 'all';
        const bedroom = searchParams.get("bedrooms") || 'all';

        const subtype = (searchParams.get("subtype")?.split(",") || [])

        const features = (searchParams.get("features")?.split(",") || [])

        return {
            location: searchParams.get("location") || locations?.[0]?.value.toString(),
            period,
            type,
            subtype,
            furnished,
            bathroom,
            bedroom,
            features,
            priceMin,
            priceMax,
            scquarefeetMin,
            scquarefeetMax,
            yearBuiltMin,
            yearBuiltMax,
        };
    });

    const subTypeOptions = useMemo(() => {
        const isCommercial = filters.type === PropertyType.COMMERCIAL;
        const subTypeEnum = isCommercial ? CommercialSubType : ResidentialSubType;
        const path = isCommercial ? "commercial" : "residential";

        return Object.values(subTypeEnum).map(val => ({
            label: tEnums(`subType.${path}.${val}`),
            value: val
        }));
    }, [filters.type, tEnums]);

    const activeLocation = useMemo(() => locations.find(o => o.value === filters.location), [filters.location, locations])


    function updateFilter(key: keyof typeof filters, value: string) {
        setFilters(prev => ({ ...prev, [key]: value }));
    }

    function toggleSubtype(value: string) {
        setFilters(prev => {
            const exists = prev.subtype.includes(value);
            const updated = exists
                ? prev.subtype.filter(v => v !== value)
                : [...prev.subtype, value];
            return { ...prev, subtype: updated };
        });
    }


    function toggleFeature(value: string) {
        setFilters(prev => {
            const exists = prev.features.includes(value);
            const updated = exists
                ? prev.features.filter(v => v !== value)
                : [...prev.features, value];
            return { ...prev, features: updated };
        });
    }


    function updateType(value: string) {
        if (value !== 'residential' && value !== 'commercial') {
            return;
        }
        setFilters(prev => {
            if (prev.type !== value) {
                return { ...prev, type: value, subtype: [] }; // reset subtype
            }
            return prev; // no change needed
        });
    }

    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        Object.entries(filters).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                params.set(key, value.join(","));
            } else {
                params.set(key, String(value));
            }
        });
        updateUrlParams(pathname, params);
    }, [filters]);

    function resetFilters() {
        const defaultFilters: FilterState = {
            location: locations[0].value.toString(),
            period: RentType.MONTHLY,
            type: PropertyType.RESIDENTIAL,
            subtype: [],
            furnished: "furnished",
            bathroom: bathrooms[0].value,
            bedroom: bedrooms[0].value,
            features: [],
            priceMin: MIN_PRICE,
            priceMax: MAX_PRICE,
            scquarefeetMin: MIN_SCQUAREFEET,
            scquarefeetMax: MAX_SCQUAREFEET,
            yearBuiltMin: MIN_YEARBUILD,
            yearBuiltMax: MAX_YEARBUILD,
        };
        setFilters(defaultFilters);
    }


    return {
        filters,
        activeLocation,
        loadingLocations,
        locations,
        subtypes: subTypeOptions,
        bedrooms,
        bathrooms,
        features: featureOptions,
        periods,
        propertyTypes,
        furnishedTypes,
        yearOptions: yearOptions,
        setFilters,
        updateFilter,
        toggleSubtype,
        toggleFeature,
        updateType,
        resetFilters
    }
}

export default useFilterProperties;